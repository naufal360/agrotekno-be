const Validator = require('fastest-validator');
const httpStatus = require("http-status");
const Response = require("../util/responses");
const {Users, Roles} = require("../models");
const { usersSchema, usersLoginSchema } = require('../util/validator');
const { hash, compare } = require('../util/bcrypt');
const v = new Validator()

const registerUser = async (req, res) => {
    let response = null
    let msg = null
    try {
        const validator = v.validate(req.body, usersSchema);
        if (validator.length) {
            response = new Response.Error(true, validator)
            return res.status(httpStatus.BAD_REQUEST).json(response)
        }

        const {
            username,
            password,
            roles,
         } = req.body

        const data = await Users.findOne({
            where: {
                username: username
            }
        })
        msg = "username already exist!"
        if (data) {
            response = new Response.Error(true, msg)
            return res.status(httpStatus.BAD_REQUEST).json(response)
        }

        // let roles = req.body.roles
        msg = "roles must fill with number ADMIN = 1 or PETANI = 2 or PEDAGANG = 3 or AGROBESAR = 4 or AGROKECIL = 5" 
        if ( roles != 1 && roles != 2 && roles != 3 && roles != 4 && roles != 5){
            response = new Response.Error(true, msg)
            return res.status(httpStatus.BAD_REQUEST).json(response)
        }

        let newPassword = await hash(password)

        const register = await Users.create({
            username: username,
            password: newPassword,
            rolesId: roles
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
    let msg = null
    try {
        const validator = v.validate(req.body, usersLoginSchema)
        if (validator.length) {
            response = new Response.Error(true, validator)
            return res.status(httpStatus.BAD_REQUEST).json(response)
        }

        const {
            username,
            password,
         } = req.body

        const data = await Users.findOne({
            where: {
                username: username
            }
        })
        msg = "username doesn't exist"
        if(!data) {
            response = new Response.Error(true, msg)
            return res.status(httpStatus.BAD_REQUEST).json(response)
        }

        let comparePass = await compare(password, data.password)
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

const getUserById = async (req, res) => {
    let response = null
    let msg = null
    try {
        const idUser = req.params['id']

        const dataUser = await Users.findOne({
            where: {
                id: idUser
            },
            include: [{model: Roles, as: 'roles'}]
        })

        if (!dataUser) {
            msg = "user not found"
            response = new Response.Error(true, msg);
            return res.status(httpStatus.BAD_REQUEST).json(response);
        }

        msg = "Success get user by id"

        response = new Response.Success(false, msg, dataUser);
        return res.status(httpStatus.OK).json(response);
    } catch (error) {
        response = new Response.Error(true, error.message);
        return res.status(httpStatus.BAD_REQUEST).json(response);
    }
}

const getAllRoles = async (req, res) => {
    let response = null
    let msg = null
    try {
        const getRoles = await Roles.findAll();

        msg = "success get all roles";

        response = new Response.Success(false, msg, getRoles);
        return res.status(httpStatus.OK).json(response);
    } catch (error) {
        response = new Response.Error(true, error.message);
        return res.status(httpStatus.BAD_REQUEST).json(response);
    }
}

module.exports = {
    registerUser,
    loginUser,
    getUserById,
    getAllRoles,
}