const Validator = require('fastest-validator');
const httpStatus = require("http-status");
const Response = require("../util/responses");
const {users} = require("../models");
const { usersSchema, usersLoginSchema } = require('../util/validator');
const { hash, compare } = require('../util/bcrypt');
const v = new Validator()

const registerUser = async (req, res) => {
    let response = null
    let msg = ""
    try {
        const validator = v.validate(req.body, usersSchema);
        if (validator.length) {
            response = new Response.Error(true, validator)
            return res.status(httpStatus.BAD_REQUEST).json(response)
        }
        const data = await users.findOne({
            where: {
                username: req.body.username
            }
        })
        msg = "username already exist!"
        if (data) {
            response = new Response.Error(true, msg)
            return res.status(httpStatus.BAD_REQUEST).json(response)
        }

        let roles = req.body.roles
        msg = "roles must fill with ADMIN or PETANI or PEDAGANG or AGRO_BESAR or AGRO_KECIL" 
        if ( roles != "ADMIN" && roles != "PETANI" && roles != "PEDAGANG" && roles != "AGRO_BESAR" && roles != "AGRO_KECIL"){
            response = new Response.Error(true, msg)
            return res.status(httpStatus.BAD_REQUEST).json(response)
        }

        let password = await hash(req.body.password)

        const register = await users.create({
            username: req.body.username,
            password: password,
            roles: req.body.roles
        })

        msg = "Success create user"

        response = new Response.Success(false, msg, register);
        return res.status(httpStatus.OK).json(response);
    } catch (error) {
        response = new Response.Error(true, error.message);
        return res.status(httpStatus.BAD_REQUEST).json(response);
    }
}

const loginUser = async (req, res) => {
    let response = null
    let msg = ""
    try {
        const validator = v.validate(req.body, usersLoginSchema)
        if (validator.length) {
            response = new Response.Error(true, validator)
            return res.status(httpStatus.BAD_REQUEST).json(response)
        }

        const data = await users.findOne({
            where: {
                username: req.body.username
            }
        })
        msg = "username doesn't exist"
        if(!data) {
            response = new Response.Error(true, msg)
            return res.status(httpStatus.BAD_REQUEST).json(response)
        }

        let comparePass = await compare(req.body.password, data.password)
        msg = "wrong password"
        if (!comparePass) {
            response = new Response.Error(true, msg)
            return res.status(httpStatus.BAD_REQUEST).json(response)
        }
        msg = "Success login user"

        response = new Response.Success(false, msg, data);
        return res.status(httpStatus.OK).json(response);
    } catch (error) {
        response = new Response.Error(true, error.message);
        return res.status(httpStatus.BAD_REQUEST).json(response);
    }
}

module.exports = {
    registerUser,
    loginUser,
}