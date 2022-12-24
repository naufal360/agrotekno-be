const Validator = require('fastest-validator');
const httpStatus = require("http-status");
const Response = require("../util/responses");
const {dimensionResult} = require("../models");
const validatorSchema = require("../util/validator");
const predictEconomic = require("../util/fuzzyis/economicDimension");
const predictEnvironment = require("../util/fuzzyis/environmentDimension");
const predictSocial = require("../util/fuzzyis/socialDimension");
const GenerateStatus = require("../util/constant");
const v = new Validator()

// GET
const getAllDataDimension = async (req, res) => {
    let response = null
    try {
        const data = await dimensionResult.findAll();

        let msg = "Success get all dimension"

        response = new Response.Success(false, msg, data);
        return res.status(httpStatus.OK).json(response);
    } catch (error) {
        response = new Response.Error(true, error.message);
        return res.status(httpStatus.BAD_REQUEST).json(response);
    }
}

// POST
const predictDimensionEconomic = async (req, res) => {
    let response = null
    let result = 0
    let status = null
    try {
        const validator = v.validate(req.body, validatorSchema.validatorEconomicSchema)
        if (validator.length) {
            response = new Response.Error(true, validator)
            return res.status(httpStatus.BAD_REQUEST).json(response)
        }
        result = predictEconomic(
            req.body.risk, 
            req.body.profit_dif, 
            req.body.supply, 
            req.body.demand_inc, 
            req.body.market_acc
        )
        status = GenerateStatus.generateStatus(result)
        const name = "EKONOMI"

        const data = await dimensionResult.create({
            userId: req.body.user_id,
            name: name,
            grade: result,
            status: status
        })

        let msg = "Success predict economic"

        response = new Response.Success(false, msg, data);
        return res.status(httpStatus.CREATED).json(response);
    }
    catch (error) {
        response = new Response.Error(true, error.message);
        return res.status(httpStatus.BAD_REQUEST).json(response);
    }
}

const predictDimensionSocial = async (req, res) => {
    let response = null
    let result = 0
    let status = null
    try {
        const validator = v.validate(req.body, validatorSchema.validatorSocialSchema)
        if (validator.length) {
            response = new Response.Error(true, validator)
            return res.status(httpStatus.BAD_REQUEST).json(response)
        }

        result = predictSocial(
            req.body.institutional_sup, 
            req.body.local_emp, 
            req.body.infra_avail, 
            req.body.employee_welf, 
            req.body.partner_inc
        )

        status = GenerateStatus.generateStatus(result)
        const name = "SOSIAL"

        const data = await dimensionResult.create({
            userId: req.body.user_id,
            name: name,
            grade: result,
            status: status
        })

        let msg = "Success predict social"

        response = new Response.Success(false, msg, data);
        return res.status(httpStatus.CREATED).json(response);
    }
    catch (error) {
        response = new Response.Error(true, error.message);
        return res.status(httpStatus.BAD_REQUEST).json(response);
    }
}

const predictDimensionEnvironment = async (req, res) => {
    let response = null
    let result = 0
    let status = null
    try {
        const validator = v.validate(req.body, validatorSchema.validatorEnvironmentSchema)
        if (validator.length) {
            response = new Response.Error(true, validator)
            return res.status(httpStatus.BAD_REQUEST).json(response)
        }

        result = predictEnvironment(
            req.body.emission, 
            req.body.water_con, 
            req.body.waste_com, 
            req.body.waste_util, 
            req.body.waste_manage,
        )

        status = GenerateStatus.generateStatus(result)
        const name = "LINGKUNGAN"

        console.log(result)
        console.log(status)

        const data = await dimensionResult.create({
            userId: req.body.user_id,
            name: name,
            grade: result,
            status: status
        })

        let msg = "Success predict environment"

        response = new Response.Success(false, msg, data);
        return res.status(httpStatus.CREATED).json(response);
    }
    catch (error) {
        response = new Response.Error(true, error.message);
        return res.status(httpStatus.BAD_REQUEST).json(response);
    }
}


module.exports = {
    predictDimensionEconomic, 
    predictDimensionSocial, 
    predictDimensionEnvironment,
    getAllDataDimension,
}