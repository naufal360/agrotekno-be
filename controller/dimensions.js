const Validator = require('fastest-validator');
const httpStatus = require("http-status");
const Response = require("../util/responses");
const {DataDimension, Users, SocialEcoEnvs} = require("../models");
const validatorSchema = require("../util/validator");
const { theDate } = require('../util/constant');
const v = new Validator()

// GET
const getAllDataDimensionByUserId = async (req, res) => {
    let response = null
    try {
        const user = req.params['id']

        const data = await DataDimension.findAll({
            where: {
                userId: user
            }
        });

        let msg = "Success get all dimension by user"

        const lengthData = data.length
    
        let allData = []
        
        for (let i = 0; i < lengthData; i++) {
            let dateRaw = data[i].createdAt.toISOString().replace(/T/, ' ').replace(/\..+/, '')
            let date = data[i].createdAt.toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(/-/g,'')
            let newdate = date.substring(2,8)
            let dateParse = theDate(dateRaw.substring(0,10))
            const dataSocialEcoEnv = await SocialEcoEnvs.findAll({
                where: {
                    dataDimensionId: data[i].id
                }
            })
            allData.push({
                "id": data[i].id,
                "name": data[i].name,
                "date": dateParse,
                "datesCode": newdate,
                "grade": data[i].grade,
                "socEcoEnv": dataSocialEcoEnv,
            })
        }

        

        response = new Response.SuccessCustomDimension(false, msg, lengthData, allData);
        return res.status(httpStatus.OK).json(response);
    } catch (error) {
        response = new Response.Error(true, error.message);
        return res.status(httpStatus.BAD_REQUEST).json(response);
    }
}

// POST
const CreateDimension = async (req, res) => {
    let response = null
    let msg = null
    try {
        const validator = v.validate(req.body, validatorSchema.validatorDimension)
        if (validator.length) {
            response = new Response.Error(true, validator)
            return res.status(httpStatus.BAD_REQUEST).json(response)
        }
        const { name, user_id } = req.body

        const checkUser = await Users.findOne({ where: {id: user_id}})
        msg = "user doesn't exist!"
        if (!checkUser) {
            response = new Response.Error(true, msg);
            return res.status(httpStatus.BAD_REQUEST).json(response);
        }

        const newData = await DataDimension.create({
            name: name,
            userId: user_id,
        })

        let date = newData.createdAt.toISOString().replace(/T/, ' ').replace(/\..+/, '')
        date = date.substring(0,10)

        msg = "success create new dimension data"

        const customResponse = {
            id: newData.id,
            name: newData.name,
            userId: newData.userId,
            createdAt: date
        } 
        
        response = new Response.Success(false, msg, customResponse);
        return res.status(httpStatus.OK).json(response);
    } catch (error) {
        response = new Response.Error(true, error.message);
        return res.status(httpStatus.BAD_REQUEST).json(response);
    }
}

const DeleteDataDimension = async(req, res) => {
    let response = null
    let msg = null
    try {
        const id = req.params['id']

        const data = await DataDimension.findOne({
            where: {
                id: id
            }
        });

        if (data.grade != 0) {
            let prefixSoc=1
            let prefixEco=2
            let prefixEnv=3

            // deleteDataSocial
            await SocialEcoEnvs.destroy({
            where: {
                    dataDimensionId: id,
                    prefixId: prefixSoc,
                },
                force: true,
            })

            // deleteDataEconomic
            await SocialEcoEnvs.destroy({
            where: {
                    dataDimensionId: id,
                    prefixId: prefixEco,
                },
                force: true,
            })
            
            // deleteDataEnvironment
            await SocialEcoEnvs.destroy({
            where: {
                    dataDimensionId: id,
                    prefixId: prefixEnv,
                },
                force: true,
            })

            // Update grade dimension 
            await DataDimension.update({
            grade: 0,
            },{
                where: {
                    id: id,
                }
            })
        }

        // delete data dimension
        const dataDeleted = await DataDimension.destroy({
            where: {
                id: id,
            }
        })

        msg = "success delete dimension data"
        
        response = new Response.Success(false, msg, dataDeleted);
        return res.status(httpStatus.OK).json(response);
    } catch (error) {
        response = new Response.Error(true, error.message);
        return res.status(httpStatus.BAD_REQUEST).json(response);
    }
}

module.exports = {
    CreateDimension,
    getAllDataDimensionByUserId,
    DeleteDataDimension,
}