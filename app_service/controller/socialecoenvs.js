const Validator = require('fastest-validator');
const httpStatus = require("http-status");
const Response = require("../util/responses");
const {DataDimension, SocialEcoEnvs, PrefixCode} = require("../models");
const validatorSchema = require("../util/validator");
const predict = require("../util/predict")
const GenerateStatus = require("../util/constant");
const sequelize = require('sequelize');
const { theDate, kesimpulan, saran } = require('../util/constant');
const v = new Validator()

const Op = sequelize.Op

const socialPrefixWet = 1
const economicPrefixWet = 2
const environmentPrefixWet = 3
const socialPrefixDry = 4
const economicPrefixDry = 5
const environmentPrefixDry = 6

// GET
const getDataByDimensionId = async (req, res) => {
    let response = null
    let msg = null
    try {
        const id = req.params['id']

        const dataSocialEcoEnv = await SocialEcoEnvs.findAll({
            where: {
                dataDimensionId: id
            }
        })

        msg = "Success get all social economic environment"

        response = new Response.Success(false, msg, dataSocialEcoEnv);
        return res.status(httpStatus.OK).json(response);
    } catch (error) {
        response = new Response.Error(true, error.message);
        return res.status(httpStatus.BAD_REQUEST).json(response);
    }
}

// POST
const predictDimensionSocial = async (req, res) => {
    let response = null
    let result = 0
    let status = null
    let msg = null
    let numberCode = null
    let code = null
    let numPrefix
    try {
        const dimension_id = req.params['id']
        const validator = v.validate(req.body, validatorSchema.validatorSocialSchema)
        if (validator.length) {
            response = new Response.Error(true, validator)
            return res.status(httpStatus.BAD_REQUEST).json(response)
        }

        const {
            is_wet,
            institutional_sup, 
            local_emp, 
            infra_avail, 
            employee_welf, 
            partner_inc
        } = req.body

        const theRes = await predict.predictSomething(
            0,
            institutional_sup, 
            local_emp, 
            infra_avail, 
            employee_welf, 
            partner_inc
        )
        result = theRes['result']

        if (is_wet === true) {
            numPrefix = socialPrefixWet
        } else {
            numPrefix = socialPrefixDry
        }

        const prefixData = await PrefixCode.findOne({
            where: {
                id: numPrefix,
            }
        })

        const findExist = await SocialEcoEnvs.findOne({
            where: {
                dataDimensionId: dimension_id,
                prefixId: numPrefix
            }
        })

        if (findExist) {
            msg = "data with dimension id already exist, please use endpoint update data"
            response = new Response.Error(true, msg);
            return res.status(httpStatus.BAD_REQUEST).json(response);
        }
        
        const countSameDimensionId = await SocialEcoEnvs.findOne({
            where: {
                dataDimensionId: dimension_id
            }
        })

        if (!countSameDimensionId) {

            const countPrefixData = await SocialEcoEnvs.findOne({
                attributes: [
                    [sequelize.fn('MAX', sequelize.col('codeId')), "codeMax"],
                ],
                raw: true,
            })

            if (countPrefixData.codeMax === undefined) {
                numberCode = 1
            } else {
                numberCode = countPrefixData.codeMax + 1
            }

            code = null
            if (numberCode.toString().length === 1) {
                code = prefixData.prefix + "00" + numberCode.toString()
            } else if (numberCode.toString().length === 2) {
                code = prefixData.prefix + "0" + numberCode.toString()
            } else if (numberCode.toString().length === 3) {
                code = prefixData.prefix + numberCode.toString()
            } else {
                msg = "exceed ammount of codeId"
                response = new Response.Error(true, msg);
                return res.status(httpStatus.BAD_REQUEST).json(response);
            }
        } else {
            let newCode = countSameDimensionId.code
            codeString = newCode.substring(7,10)
            numberCode = Number(codeString)
            code = prefixData.prefix + codeString
        }

        status = GenerateStatus.generateStatus(result)

        const data = await SocialEcoEnvs.create({
            prefixId: numPrefix,
            dataDimensionId: dimension_id,
            code: code,
            codeId: numberCode,
            firstIndicator: institutional_sup,
            secondIndicator: local_emp,
            thirdIndicator: infra_avail,
            fourthIndicator: employee_welf,
            fifthIndicator: partner_inc,
            grade: result,
            status: status,
        })

        const dataSocEcoEnv = await SocialEcoEnvs.findAll({
            where: {
                codeId: numberCode,
            },
            raw: true,
            order: [
                ['prefixId', 'ASC']
            ],
        })

        let gradeSocial = 0.12
        let gradeEconomic = 0.01
        let gradeEnvironment = 0.16
        let inputResult = 0
        let calculate = 0
        let initialCode, bufferCode

        for (let x = 1; x <= dataSocEcoEnv.length; x++) {
            let plusPrefix = x - 1
            if (dataSocEcoEnv[plusPrefix].prefixId <= 3) {
                bufferCode = dataSocEcoEnv[plusPrefix].code
                initialCode = bufferCode.substring(0,3)
                if (initialCode === 'SOC' && is_wet === true) {
                    gradeSocial = dataSocEcoEnv[plusPrefix].grade
                } else if (initialCode === 'ECO' && is_wet === true) {
                    gradeEconomic = dataSocEcoEnv[plusPrefix].grade
                } else if (initialCode === 'ENV' && is_wet === true) {
                    gradeEnvironment = dataSocEcoEnv[plusPrefix].grade
                } 
            } else {
                bufferCode = dataSocEcoEnv[plusPrefix].code
                initialCode = bufferCode.substring(0,3)
                if (initialCode === 'SOC' && is_wet === false) {
                    gradeSocial = dataSocEcoEnv[plusPrefix].grade
                } else if (initialCode === 'ECO' && is_wet === false) {
                    gradeEconomic = dataSocEcoEnv[plusPrefix].grade
                } else if (initialCode === 'ENV' && is_wet === false) {
                    gradeEnvironment = dataSocEcoEnv[plusPrefix].grade
                } 
            }
        }
        
        if (is_wet === true) {
            calculate = await predict.predictAnfis(gradeEconomic, gradeSocial, gradeEnvironment)
            inputResult = calculate['result']

            await DataDimension.update({
                gradeWet: inputResult,
            },{
                where: {
                    id: dimension_id,
                }
            })
        } else {
            calculate = await predict.predictAnfis(gradeEconomic, gradeSocial, gradeEnvironment)
            inputResult = calculate['result']

            await DataDimension.update({
                gradeDry: inputResult,
            },{
                where: {
                    id: dimension_id,
                }
            })
        }

        msg = "Success predict social"

        response = new Response.Success(false, msg, data);
        return res.status(httpStatus.CREATED).json(response);
    } catch (error) {
        response = new Response.Error(true, error.message);
        return res.status(httpStatus.BAD_REQUEST).json(response);
    }
}

const predictDimensionEconomic = async (req, res) => {
    let response = null
    let result = 0
    let status = null
    let msg = null
    let numberCode = null
    let code = null
    let numPrefix
    try {
        const dimension_id = req.params['id']
        const validator = v.validate(req.body, validatorSchema.validatorEconomicSchema)
        if (validator.length) {
            response = new Response.Error(true, validator)
            return res.status(httpStatus.BAD_REQUEST).json(response)
        }

        const {
            is_wet,
            risk, 
            profit_dif, 
            supply, 
            demand_inc, 
            market_acc
        } = req.body

        const theRes = await predict.predictSomething(
            1,
            risk, 
            profit_dif, 
            supply, 
            demand_inc, 
            market_acc
        )
        result = theRes['result']

        if (is_wet === true) {
            numPrefix = economicPrefixWet
        } else {
            numPrefix = economicPrefixDry
        }

        const prefixData = await PrefixCode.findOne({
            where: {
                id: numPrefix,
            }
        })

        const findExist = await SocialEcoEnvs.findOne({
            where: {
                dataDimensionId: dimension_id,
                prefixId: numPrefix
            }
        })

        if (findExist) {
            msg = "data with dimension id already exist, please use endpoint update data"
            response = new Response.Error(true, msg);
            return res.status(httpStatus.BAD_REQUEST).json(response);
        }

        const countSameDimensionId = await SocialEcoEnvs.findOne({
            where: {
                dataDimensionId: dimension_id
            }
        })
        
        if (!countSameDimensionId) {

            const countPrefixData = await SocialEcoEnvs.findOne({
                attributes: [
                    [sequelize.fn('MAX', sequelize.col('codeId')), "codeMax"],
                ],
                raw: true,
            })

            if (countPrefixData.codeMax === undefined) {
                numberCode = 1
            } else {
                numberCode = countPrefixData.codeMax + 1
            }

            code = null
            if (numberCode.toString().length === 1) {
                code = prefixData.prefix + "00" + numberCode.toString()
            } else if (numberCode.toString().length === 2) {
                code = prefixData.prefix + "0" + numberCode.toString()
            } else if (numberCode.toString().length === 3) {
                code = prefixData.prefix + numberCode.toString()
            } else {
                msg = "exceed ammount of codeId"
                response = new Response.Error(true, msg);
                return res.status(httpStatus.BAD_REQUEST).json(response);
            }
        } else {
            let newCode = countSameDimensionId.code
            codeString = newCode.substring(7,10)
            numberCode = Number(codeString)
            code = prefixData.prefix + codeString
        }

        status = GenerateStatus.generateStatus(result)

        const data = await SocialEcoEnvs.create({
            prefixId: numPrefix,
            dataDimensionId: dimension_id,
            code: code,
            codeId: numberCode,
            firstIndicator: risk,
            secondIndicator: profit_dif,
            thirdIndicator: supply,
            fourthIndicator: demand_inc,
            fifthIndicator: market_acc,
            grade: result,
            status: status,
        })

        const dataSocEcoEnv = await SocialEcoEnvs.findAll({
            where: {
                codeId: numberCode,
            },
            raw: true,
            order: [
                ['prefixId', 'DESC']
            ]
        })

        let gradeSocial = 0.12
        let gradeEconomic = 0.01
        let gradeEnvironment = 0.16
        let inputResult = 0
        let calculate = 0
        let initialCode, bufferCode

        for (let x = 1; x <= dataSocEcoEnv.length; x++) {
            let plusPrefix = x - 1
            if (dataSocEcoEnv[plusPrefix].prefixId <= 3) {
                bufferCode = dataSocEcoEnv[plusPrefix].code
                initialCode = bufferCode.substring(0,3)
                if (initialCode === 'SOC' && is_wet === true) {
                    gradeSocial = dataSocEcoEnv[plusPrefix].grade
                } else if (initialCode === 'ECO' && is_wet === true) {
                    gradeEconomic = dataSocEcoEnv[plusPrefix].grade
                } else if (initialCode === 'ENV' && is_wet === true) {
                    gradeEnvironment = dataSocEcoEnv[plusPrefix].grade
                } 
            } else {
                bufferCode = dataSocEcoEnv[plusPrefix].code
                initialCode = bufferCode.substring(0,3)
                if (initialCode === 'SOC' && is_wet === false) {
                    gradeSocial = dataSocEcoEnv[plusPrefix].grade
                } else if (initialCode === 'ECO' && is_wet === false) {
                    gradeEconomic = dataSocEcoEnv[plusPrefix].grade
                } else if (initialCode === 'ENV' && is_wet === false) {
                    gradeEnvironment = dataSocEcoEnv[plusPrefix].grade
                } 
            }
        }

        if (is_wet === true) {
            calculate = await predict.predictAnfis(gradeEconomic, gradeSocial, gradeEnvironment)
            inputResult = calculate['result']

            await DataDimension.update({
                gradeWet: inputResult,
            },{
                where: {
                    id: dimension_id,
                }
            })
        } else {
            calculate = await predict.predictAnfis(gradeEconomic, gradeSocial, gradeEnvironment)
            inputResult = calculate['result']

            await DataDimension.update({
                gradeDry: inputResult,
            },{
                where: {
                    id: dimension_id,
                }
            })
        }

        msg = "Success predict economic"

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
    let msg = null
    let numberCode = null
    let code = null
    let numPrefix
    try {
        const dimension_id = req.params['id']

        const validator = v.validate(req.body, validatorSchema.validatorEnvironmentSchema)
        if (validator.length) {
            response = new Response.Error(true, validator)
            return res.status(httpStatus.BAD_REQUEST).json(response)
        }

        const {
            is_wet,
            emission, 
            water_con, 
            waste_com, 
            waste_util, 
            waste_manage,
        } = req.body

        const theRes = await predict.predictSomething(
            2,
            emission, 
            water_con, 
            waste_com, 
            waste_util, 
            waste_manage,
        )
        result = theRes['result']

        if (is_wet === true) {
            numPrefix = environmentPrefixWet
        } else {
            numPrefix = environmentPrefixDry
        }

        const prefixData = await PrefixCode.findOne({
            where: {
                id: numPrefix,
            }
        })

        const findExist = await SocialEcoEnvs.findOne({
            where: {
                dataDimensionId: dimension_id,
                prefixId: numPrefix
            }
        })

        if (findExist) {
            msg = "data with dimension id already exist, please use endpoint update data"
            response = new Response.Error(true, msg);
            return res.status(httpStatus.BAD_REQUEST).json(response);
        }

        const countSameDimensionId = await SocialEcoEnvs.findOne({
            where: {
                dataDimensionId: dimension_id
            }
        })
        
        if (!countSameDimensionId) {

            const countPrefixData = await SocialEcoEnvs.findOne({
                attributes: [
                    [sequelize.fn('MAX', sequelize.col('codeId')), "codeMax"],
                ],
                raw: true,
            })

            if (countPrefixData.codeMax === undefined) {
                numberCode = 1
            } else {
                numberCode = countPrefixData.codeMax + 1
            }

            code = null
            if (numberCode.toString().length === 1) {
                code = prefixData.prefix + "00" + numberCode.toString()
            } else if (numberCode.toString().length === 2) {
                code = prefixData.prefix + "0" + numberCode.toString()
            } else if (numberCode.toString().length === 3) {
                code = prefixData.prefix + numberCode.toString()
            } else {
                msg = "exceed ammount of code"
                response = new Response.Error(true, msg);
                return res.status(httpStatus.BAD_REQUEST).json(response);
            }
        } else {
            let newCode = countSameDimensionId.code
            codeString = newCode.substring(7,10)
            numberCode = Number(codeString)
            code = prefixData.prefix + codeString
        }

        status = GenerateStatus.generateStatus(result)

        const data = await SocialEcoEnvs.create({
            prefixId: numPrefix,
            dataDimensionId: dimension_id,
            code: code,
            codeId: numberCode,
            firstIndicator: emission,
            secondIndicator: water_con,
            thirdIndicator: waste_com,
            fourthIndicator: waste_util,
            fifthIndicator: waste_manage,
            grade: result,
            status: status,
        })

        const dataSocEcoEnv = await SocialEcoEnvs.findAll({
            where: {
                codeId: numberCode,
            },
            raw: true,
            order: [
                ['prefixId', 'DESC']
            ]
        })

        let gradeSocial = 0.12
        let gradeEconomic = 0.01
        let gradeEnvironment = 0.16
        let inputResult = 0
        let calculate = 0
        let initialCode, bufferCode

        for (let x = 1; x <= dataSocEcoEnv.length; x++) {
            let plusPrefix = x - 1
            if (dataSocEcoEnv[plusPrefix].prefixId <= 3) {
                bufferCode = dataSocEcoEnv[plusPrefix].code
                initialCode = bufferCode.substring(0,3)
                if (initialCode === 'SOC' && is_wet === true) {
                    gradeSocial = dataSocEcoEnv[plusPrefix].grade
                } else if (initialCode === 'ECO' && is_wet === true) {
                    gradeEconomic = dataSocEcoEnv[plusPrefix].grade
                } else if (initialCode === 'ENV' && is_wet === true) {
                    gradeEnvironment = dataSocEcoEnv[plusPrefix].grade
                } 
            } else {
                bufferCode = dataSocEcoEnv[plusPrefix].code
                initialCode = bufferCode.substring(0,3)
                if (initialCode === 'SOC' && is_wet === false) {
                    gradeSocial = dataSocEcoEnv[plusPrefix].grade
                } else if (initialCode === 'ECO' && is_wet === false) {
                    gradeEconomic = dataSocEcoEnv[plusPrefix].grade
                } else if (initialCode === 'ENV' && is_wet === false) {
                    gradeEnvironment = dataSocEcoEnv[plusPrefix].grade
                } 
            }
        }
        
        if (is_wet === true) {
            calculate = await predict.predictAnfis(gradeEconomic, gradeSocial, gradeEnvironment)
            inputResult = calculate['result']

            await DataDimension.update({
                gradeWet: inputResult,
            },{
                where: {
                    id: dimension_id,
                }
            })
        } else {
            calculate = await predict.predictAnfis(gradeEconomic, gradeSocial, gradeEnvironment)
            inputResult = calculate['result']

            await DataDimension.update({
                gradeDry: inputResult,
            },{
                where: {
                    id: dimension_id,
                }
            })
        }

        msg = "Success predict environment"

        response = new Response.Success(false, msg, data);
        return res.status(httpStatus.CREATED).json(response);
    }
    catch (error) {
        response = new Response.Error(true, error.message);
        return res.status(httpStatus.BAD_REQUEST).json(response);
    }
}

// PUT
const updateSocial = async (req, res) => {
    let response = null
    let msg = null
    let result = null
    let numPrefix
    try {
        const id = req.params['id']

        const validator = v.validate(req.body, validatorSchema.validatorSocialSchema)
        if (validator.length) {
            response = new Response.Error(true, validator)
            return res.status(httpStatus.BAD_REQUEST).json(response)
        }
        
        const {
            is_wet,
            institutional_sup, 
            local_emp, 
            infra_avail, 
            employee_welf, 
            partner_inc
        } = req.body

        const theRes = await predict.predictSomething(
            0,
            institutional_sup, 
            local_emp, 
            infra_avail, 
            employee_welf, 
            partner_inc
        )
        result = theRes['result']

        let status = GenerateStatus.generateStatus(result)
        
        if (is_wet === true) {
            numPrefix = socialPrefixWet
        } else {
            numPrefix = socialPrefixDry
        }

        await SocialEcoEnvs.update(
            {
                firstIndicator: institutional_sup,
                secondIndicator: local_emp,
                thirdIndicator: infra_avail,
                fourthIndicator: employee_welf,
                fifthIndicator: partner_inc,
                grade: result,
                status: status,
            }, {
                where: {
                    dataDimensionId: id,
                    prefixId: numPrefix,
                },
                returning: true,
                plain: true,
            }
        )
        const findData = await SocialEcoEnvs.findOne({
            where: {
                dataDimensionId: id,
                prefixId: numPrefix,
            }
        })

        if(!findData) {
            msg = "data not found"
            response = new Response.Error(true, msg)
            return res.status(httpStatus.BAD_REQUEST).json(response) 
        }

        const dataSocEcoEnv = await SocialEcoEnvs.findAll({
            where: {
                codeId: findData.codeId,
            },
            raw: true,
            order: [
                ['prefixId', 'DESC']
            ]
        })

        let gradeSocial = 0.12
        let gradeEconomic = 0.01
        let gradeEnvironment = 0.16
        let inputResult = 0
        let calculate = 0
        let initialCode, bufferCode

        for (let x = 1; x <= dataSocEcoEnv.length; x++) {
            let plusPrefix = x - 1
            if (dataSocEcoEnv[plusPrefix].prefixId <= 3) {
                bufferCode = dataSocEcoEnv[plusPrefix].code
                initialCode = bufferCode.substring(0,3)
                if (initialCode === 'SOC' && is_wet === true) {
                    gradeSocial = dataSocEcoEnv[plusPrefix].grade
                } else if (initialCode === 'ECO' && is_wet === true) {
                    gradeEconomic = dataSocEcoEnv[plusPrefix].grade
                } else if (initialCode === 'ENV' && is_wet === true) {
                    gradeEnvironment = dataSocEcoEnv[plusPrefix].grade
                } 
            } else {
                bufferCode = dataSocEcoEnv[plusPrefix].code
                initialCode = bufferCode.substring(0,3)
                if (initialCode === 'SOC' && is_wet === false) {
                    gradeSocial = dataSocEcoEnv[plusPrefix].grade
                } else if (initialCode === 'ECO' && is_wet === false) {
                    gradeEconomic = dataSocEcoEnv[plusPrefix].grade
                } else if (initialCode === 'ENV' && is_wet === false) {
                    gradeEnvironment = dataSocEcoEnv[plusPrefix].grade
                } 
            }
        }
        
        if (is_wet === true) {
            calculate = await predict.predictAnfis(gradeEconomic, gradeSocial, gradeEnvironment)
            inputResult = calculate['result']

            await DataDimension.update({
                gradeWet: inputResult,
            },{
                where: {
                    id: id,
                }
            })
        } else {
            calculate = await predict.predictAnfis(gradeEconomic, gradeSocial, gradeEnvironment)
            inputResult = calculate['result']

            await DataDimension.update({
                gradeDry: inputResult,
            },{
                where: {
                    id: id,
                }
            })
        }

        msg = "Success update predict social"

        response = new Response.Success(false, msg, findData);
        return res.status(httpStatus.OK).json(response);
    } catch (error) {
        response = new Response.Error(true, error.message);
        return res.status(httpStatus.BAD_REQUEST).json(response);
    }
}

const updateEconomic = async (req, res) => {
    let response = null
    let msg = null
    let result = null
    let numPrefix
    try {
        const id = req.params['id']

        const validator = v.validate(req.body, validatorSchema.validatorEconomicSchema)
            if (validator.length) {
                response = new Response.Error(true, validator)
                return res.status(httpStatus.BAD_REQUEST).json(response)
            }

            const {
                is_wet,
                risk, 
                profit_dif, 
                supply, 
                demand_inc, 
                market_acc
            } = req.body

            const theRes = await predict.predictSomething(
                1,
                risk, 
                profit_dif, 
                supply, 
                demand_inc, 
                market_acc
            )
            result = theRes['result']
            
            if (is_wet === true) {
                numPrefix = economicPrefixWet
            } else {
                numPrefix = economicPrefixDry
            }
            
            let status = GenerateStatus.generateStatus(result)

            await SocialEcoEnvs.update(
                {
                    firstIndicator: risk,
                    secondIndicator: profit_dif,
                    thirdIndicator: supply,
                    fourthIndicator: demand_inc,
                    fifthIndicator: market_acc,
                    grade: result,
                    status: status,
                }, {
                    where: {
                        dataDimensionId: id,
                        prefixId: numPrefix,
                    },
                    returning: true,
                    plain: true,
                }
            )
            
        const findData = await SocialEcoEnvs.findOne({
            where: {
                dataDimensionId: id,
                prefixId: numPrefix,
            }
        })

        if(!findData) {
            msg = "data not found"
            response = new Response.Error(true, msg)
            return res.status(httpStatus.BAD_REQUEST).json(response) 
        }
        
        const dataSocEcoEnv = await SocialEcoEnvs.findAll({
            where: {
                codeId: findData.codeId,
            },
            raw: true,
            order: [
                ['prefixId', 'DESC']
            ]
        })

        let gradeSocial = 0.12
        let gradeEconomic = 0.01
        let gradeEnvironment = 0.16
        let inputResult = 0
        let calculate = 0
        let initialCode, bufferCode

        for (let x = 1; x <= dataSocEcoEnv.length; x++) {
            let plusPrefix = x - 1
            if (dataSocEcoEnv[plusPrefix].prefixId <= 3) {
                bufferCode = dataSocEcoEnv[plusPrefix].code
                initialCode = bufferCode.substring(0,3)
                if (initialCode === 'SOC' && is_wet === true) {
                    gradeSocial = dataSocEcoEnv[plusPrefix].grade
                } else if (initialCode === 'ECO' && is_wet === true) {
                    gradeEconomic = dataSocEcoEnv[plusPrefix].grade
                } else if (initialCode === 'ENV' && is_wet === true) {
                    gradeEnvironment = dataSocEcoEnv[plusPrefix].grade
                } 
            } else {
                bufferCode = dataSocEcoEnv[plusPrefix].code
                initialCode = bufferCode.substring(0,3)
                if (initialCode === 'SOC' && is_wet === false) {
                    gradeSocial = dataSocEcoEnv[plusPrefix].grade
                } else if (initialCode === 'ECO' && is_wet === false) {
                    gradeEconomic = dataSocEcoEnv[plusPrefix].grade
                } else if (initialCode === 'ENV' && is_wet === false) {
                    gradeEnvironment = dataSocEcoEnv[plusPrefix].grade
                } 
            }
        }
        
        if (is_wet === true) {
            calculate = await predict.predictAnfis(gradeEconomic, gradeSocial, gradeEnvironment)
            inputResult = calculate['result']

            await DataDimension.update({
                gradeWet: inputResult,
            },{
                where: {
                    id: id,
                }
            })
        } else {
            calculate = await predict.predictAnfis(gradeEconomic, gradeSocial, gradeEnvironment)
            inputResult = calculate['result']

            await DataDimension.update({
                gradeDry: inputResult,
            },{
                where: {
                    id: id,
                }
            })
        }

        response = new Response.Success(false, msg, findData);
        return res.status(httpStatus.OK).json(response);
    } catch (error) {
        response = new Response.Error(true, error.message);
        return res.status(httpStatus.BAD_REQUEST).json(response);
    }
}

const updateEnvironment = async (req, res) => {
    let response = null
    let msg = null
    let result = null
    try {
        const id = req.params['id']

        const validator = v.validate(req.body, validatorSchema.validatorEnvironmentSchema)
            if (validator.length) {
                response = new Response.Error(true, validator)
                return res.status(httpStatus.BAD_REQUEST).json(response)
            }

            const {
                is_wet,
                emission, 
                water_con, 
                waste_com, 
                waste_util, 
                waste_manage,
            } = req.body

            const theRes = await predict.predictSomething(
                2,
                emission, 
                water_con, 
                waste_com, 
                waste_util, 
                waste_manage,
            )
            result = theRes['result']

            if (is_wet === true) {
                numPrefix = environmentPrefixWet
            } else {
                numPrefix = environmentPrefixDry
            }

            let status = GenerateStatus.generateStatus(result)

            await SocialEcoEnvs.update(
                {
                    firstIndicator: emission,
                    secondIndicator: water_con,
                    thirdIndicator: waste_com,
                    fourthIndicator: waste_util,
                    fifthIndicator: waste_manage,
                    grade: result,
                    status: status,
                }, {
                    where: {
                        dataDimensionId: id,
                        prefixId: numPrefix,
                    },
                    returning: true,
                    plain: true,
                }
            )

            const findData = await SocialEcoEnvs.findOne({
                where: {
                    dataDimensionId: id,
                    prefixId: numPrefix,
                }
            })

            if(!findData) {
                msg = "data not found"
                response = new Response.Error(true, msg)
                return res.status(httpStatus.BAD_REQUEST).json(response) 
            }

        const dataSocEcoEnv = await SocialEcoEnvs.findAll({
            where: {
                codeId: findData.codeId,
            },
            raw: true,
            order: [
                ['prefixId', 'DESC']
            ]
        })

        let gradeSocial = 0.12
        let gradeEconomic = 0.01
        let gradeEnvironment = 0.16
        let inputResult = 0
        let calculate = 0
        let initialCode, bufferCode

        for (let x = 1; x <= dataSocEcoEnv.length; x++) {
            let plusPrefix = x - 1
            if (dataSocEcoEnv[plusPrefix].prefixId <= 3) {
                bufferCode = dataSocEcoEnv[plusPrefix].code
                initialCode = bufferCode.substring(0,3)
                if (initialCode === 'SOC' && is_wet === true) {
                    gradeSocial = dataSocEcoEnv[plusPrefix].grade
                } else if (initialCode === 'ECO' && is_wet === true) {
                    gradeEconomic = dataSocEcoEnv[plusPrefix].grade
                } else if (initialCode === 'ENV' && is_wet === true) {
                    gradeEnvironment = dataSocEcoEnv[plusPrefix].grade
                } 
            } else {
                bufferCode = dataSocEcoEnv[plusPrefix].code
                initialCode = bufferCode.substring(0,3)
                if (initialCode === 'SOC' && is_wet === false) {
                    gradeSocial = dataSocEcoEnv[plusPrefix].grade
                } else if (initialCode === 'ECO' && is_wet === false) {
                    gradeEconomic = dataSocEcoEnv[plusPrefix].grade
                } else if (initialCode === 'ENV' && is_wet === false) {
                    gradeEnvironment = dataSocEcoEnv[plusPrefix].grade
                } 
            }
        }
        
        if (is_wet === true) {
            calculate = await predict.predictAnfis(gradeEconomic, gradeSocial, gradeEnvironment)
            inputResult = calculate['result']

            await DataDimension.update({
                gradeWet: inputResult,
            },{
                where: {
                    id: id,
                }
            })
        } else {
            calculate = await predict.predictAnfis(gradeEconomic, gradeSocial, gradeEnvironment)
            inputResult = calculate['result']

            await DataDimension.update({
                gradeDry: inputResult,
            },{
                where: {
                    id: id,
                }
            })
        }

        msg = "Success update predict environment"

        response = new Response.Success(false, msg, findData);
        return res.status(httpStatus.OK).json(response);
    } catch (error) {
        response = new Response.Error(true, error.message);
        return res.status(httpStatus.BAD_REQUEST).json(response);
    }
}

const getDetailSocialById = async (req, res) => {
    let response = null
    let msg = null
    let data = []
    try {
        const id = req.params['id']
        const idPrefixWet = 1
        const idPrefixDry = 4

        const dataSocialEcoEnv = await SocialEcoEnvs.findAll({
            where: {
                dataDimensionId: id,
                [Op.or]: [
                    {prefixId: idPrefixWet},
                    {prefixId: idPrefixDry} 
                ]
            },
            raw: true,
        })

        for (let i = 0; i < dataSocialEcoEnv.length; i++) {
            let dateRaw = dataSocialEcoEnv[i].createdAt.toISOString().replace(/T/, ' ').replace(/\..+/, '')
            let dateParse = theDate(dateRaw.substring(0,10))
    
            let kesimpulan = GenerateStatus.kesimpulan(dataSocialEcoEnv[i]);
            let saran = GenerateStatus.saran(dataSocialEcoEnv[i]);
    
            const customResponse = {
                id: dataSocialEcoEnv[i].id,
                prefixId: dataSocialEcoEnv[i].prefixId,
                code: dataSocialEcoEnv[i].code,
                codeId: dataSocialEcoEnv[i].codeId,
                firstIndicator: dataSocialEcoEnv[i].fifthIndicator,
                secondIndicator: dataSocialEcoEnv[i].secondIndicator,
                thirdIndicator: dataSocialEcoEnv[i].thirdIndicator,
                fourthIndicator: dataSocialEcoEnv[i].fourthIndicator,
                fifthIndicator: dataSocialEcoEnv[i].fifthIndicator,
                grade: dataSocialEcoEnv[i].grade,
                status: dataSocialEcoEnv[i].status,
                kesimpulan: kesimpulan,
                saran: saran,
                createdAt: dateParse,
            }

            data[i] = customResponse
        }

        msg = "Success get social by id"

        response = new Response.Success(false, msg, data);
        return res.status(httpStatus.OK).json(response);
    } catch (error) {
        response = new Response.Error(true, error.message);
        return res.status(httpStatus.BAD_REQUEST).json(response);
    }
}

const getDetailEconomicById = async (req, res) => {
    let response = null
    let msg = null
    let data = []
    try {
        const id = req.params['id']
        const idPrefixWet = 2
        const idPrefixDry = 5

        const dataSocialEcoEnv = await SocialEcoEnvs.findAll({
            where: {
                dataDimensionId: id,
                [Op.or]: [
                    {prefixId: idPrefixWet},
                    {prefixId: idPrefixDry} 
                ]
            },
            raw: true,
        })

        for (let i = 0; i < dataSocialEcoEnv.length; i++) {
            let dateRaw = dataSocialEcoEnv[i].createdAt.toISOString().replace(/T/, ' ').replace(/\..+/, '')
            let dateParse = theDate(dateRaw.substring(0,10))
    
            let kesimpulan = GenerateStatus.kesimpulan(dataSocialEcoEnv[i]);
            let saran = GenerateStatus.saran(dataSocialEcoEnv[i]);
    
            const customResponse = {
                id: dataSocialEcoEnv[i].id,
                prefixId: dataSocialEcoEnv[i].prefixId,
                code: dataSocialEcoEnv[i].code,
                codeId: dataSocialEcoEnv[i].codeId,
                firstIndicator: dataSocialEcoEnv[i].fifthIndicator,
                secondIndicator: dataSocialEcoEnv[i].secondIndicator,
                thirdIndicator: dataSocialEcoEnv[i].thirdIndicator,
                fourthIndicator: dataSocialEcoEnv[i].fourthIndicator,
                fifthIndicator: dataSocialEcoEnv[i].fifthIndicator,
                grade: dataSocialEcoEnv[i].grade,
                status: dataSocialEcoEnv[i].status,
                kesimpulan: kesimpulan,
                saran: saran,
                createdAt: dateParse,
            }

            data[i] = customResponse
        }

        msg = "Success get economic by id"

        response = new Response.Success(false, msg, data);
        return res.status(httpStatus.OK).json(response);
    } catch (error) {
        response = new Response.Error(true, error.message);
        return res.status(httpStatus.BAD_REQUEST).json(response);
    }
}

const getDetailEnvironmentById = async (req, res) => {
    let response = null
    let msg = null
    let data = []
    try {
        const id = req.params['id']
        const idPrefixWet = 3
        const idPrefixDry = 6

        const dataSocialEcoEnv = await SocialEcoEnvs.findAll({
            where: {
                dataDimensionId: id,
                [Op.or]: [
                    {prefixId: idPrefixWet},
                    {prefixId: idPrefixDry} 
                ]
            },
            raw: true,
        })

        for (let i = 0; i < dataSocialEcoEnv.length; i++) {
            let dateRaw = dataSocialEcoEnv[i].createdAt.toISOString().replace(/T/, ' ').replace(/\..+/, '')
            let dateParse = theDate(dateRaw.substring(0,10))
    
            let kesimpulan = GenerateStatus.kesimpulan(dataSocialEcoEnv[i]);
            let saran = GenerateStatus.saran(dataSocialEcoEnv[i]);
    
            const customResponse = {
                id: dataSocialEcoEnv[i].id,
                prefixId: dataSocialEcoEnv[i].prefixId,
                code: dataSocialEcoEnv[i].code,
                codeId: dataSocialEcoEnv[i].codeId,
                firstIndicator: dataSocialEcoEnv[i].fifthIndicator,
                secondIndicator: dataSocialEcoEnv[i].secondIndicator,
                thirdIndicator: dataSocialEcoEnv[i].thirdIndicator,
                fourthIndicator: dataSocialEcoEnv[i].fourthIndicator,
                fifthIndicator: dataSocialEcoEnv[i].fifthIndicator,
                grade: dataSocialEcoEnv[i].grade,
                status: dataSocialEcoEnv[i].status,
                kesimpulan: kesimpulan,
                saran: saran,
                createdAt: dateParse,
            }

            data[i] = customResponse
        }

        msg = "Success get environment by id"

        response = new Response.Success(false, msg, data);
        return res.status(httpStatus.OK).json(response);
    } catch (error) {
        response = new Response.Error(true, error.message);
        return res.status(httpStatus.BAD_REQUEST).json(response);
    }
}

const deleteSocial = async (req, res) => {
    let response = null
    let msg = null
    try {
        const id = req.params['id']
        const prefixid = 1

        const findData = await SocialEcoEnvs.findOne({
            where: {
                dataDimensionId: id,
                prefixId: prefixid,
            }
        })

        if(!findData) {
            msg = "data not found"
            response = new Response.Error(true, msg)
            return res.status(httpStatus.BAD_REQUEST).json(response) 
        }

        const deleteData = await SocialEcoEnvs.destroy({
            where: {
                dataDimensionId: id,
                prefixId: prefixid,
            },
            force: true,
        })
        
        const dataSocEcoEnv = await SocialEcoEnvs.findAll({
            where: {
                codeId: findData.codeId,
            },
            order: [
                ['prefixId', 'DESC']
            ]
        })

        let gradeSocial = 0.12
        let gradeEconomic = 0.01
        let gradeEnvironment = 0.16
        let inputResult = 0
        let calculate = 0

        if (dataSocEcoEnv.length === 1) {
            gradeSocial = dataSocEcoEnv[0].grade
            calculate = await predict.predictAnfis(gradeEconomic, gradeSocial, gradeEnvironment)
            inputResult = calculate['result']
        } else if (dataSocEcoEnv.length === 2) {
            gradeSocial = dataSocEcoEnv[0].grade
            gradeEconomic = dataSocEcoEnv[1].grade
            calculate = await predict.predictAnfis(gradeEconomic, gradeSocial, gradeEnvironment)
            inputResult = calculate['result']
        } else if (dataSocEcoEnv.length === 3) {
            gradeSocial = dataSocEcoEnv[0].grade
            gradeEconomic = dataSocEcoEnv[1].grade
            gradeEnvironment = dataSocEcoEnv[2].grade
            calculate = await predict.predictAnfis(gradeEconomic, gradeSocial, gradeEnvironment)
            inputResult = calculate['result']
        } else {
            inputResult = 0
        }

        await DataDimension.update({
            grade: inputResult,
        },{
            where: {
                id: id,
            }
        })

        msg = "Success delete social"

        response = new Response.Success(false, msg, deleteData)
        return res.status(httpStatus.OK).json(response)
    } catch (error) {
        response = new Response.Error(true, error.message);
        return res.status(httpStatus.BAD_REQUEST).json(response);
    }
}

const deleteEconomic = async (req, res) => {
    let response = null
    let msg = null
    try {
        const id = req.params['id']
        const prefixid = 2

        const findData = await SocialEcoEnvs.findOne({
            where: {
                dataDimensionId: id,
                prefixId: prefixid,
            }
        })

        if(!findData) {
            msg = "data not found"
            response = new Response.Error(true, msg)
            return res.status(httpStatus.BAD_REQUEST).json(response) 
        }

        const deleteData = await SocialEcoEnvs.destroy({
            where: {
                dataDimensionId: id,
                prefixId: prefixid,
            },
            force: true,
        })
        
        const dataSocEcoEnv = await SocialEcoEnvs.findAll({
            where: {
                codeId: findData.codeId,
            },
            order: [
                ['prefixId', 'DESC']
            ]
        })

        let gradeSocial = 0.12
        let gradeEconomic = 0.01
        let gradeEnvironment = 0.16
        let inputResult = 0
        let calculate = 0

        if (dataSocEcoEnv.length === 1) {
            gradeSocial = dataSocEcoEnv[0].grade
            calculate = await predict.predictAnfis(gradeEconomic, gradeSocial, gradeEnvironment)
            inputResult = calculate['result']
        } else if (dataSocEcoEnv.length === 2) {
            gradeSocial = dataSocEcoEnv[0].grade
            gradeEconomic = dataSocEcoEnv[1].grade
            calculate = await predict.predictAnfis(gradeEconomic, gradeSocial, gradeEnvironment)
            inputResult = calculate['result']
        } else if (dataSocEcoEnv.length === 3) {
            gradeSocial = dataSocEcoEnv[0].grade
            gradeEconomic = dataSocEcoEnv[1].grade
            gradeEnvironment = dataSocEcoEnv[2].grade
            calculate = await predict.predictAnfis(gradeEconomic, gradeSocial, gradeEnvironment)
            inputResult = calculate['result']
        } else {
            inputResult = 0
        }

        await DataDimension.update({
            grade: inputResult,
        },{
            where: {
                id: id,
            }
        })

        msg = "Success delete economic"

        response = new Response.Success(false, msg, deleteData)
        return res.status(httpStatus.OK).json(response)
    } catch (error) {
        response = new Response.Error(true, error.message);
        return res.status(httpStatus.BAD_REQUEST).json(response);
    }
}


const deleteEnvironment = async (req, res) => {
    let response = null
    let msg = null
    try {
        const id = req.params['id']
        const prefixid = 3

        const findData = await SocialEcoEnvs.findOne({
            where: {
                dataDimensionId: id,
                prefixId: prefixid,
            }
        })

        if(!findData) {
            msg = "data not found"
            response = new Response.Error(true, msg)
            return res.status(httpStatus.BAD_REQUEST).json(response) 
        }

        const deleteData = await SocialEcoEnvs.destroy({
            where: {
                dataDimensionId: id,
                prefixId: prefixid,
            },
            force: true,
        })
        
        const dataSocEcoEnv = await SocialEcoEnvs.findAll({
            where: {
                codeId: findData.codeId,
            },
            order: [
                ['prefixId', 'DESC']
            ]
        })

        let gradeSocial = 0.12
        let gradeEconomic = 0.01
        let gradeEnvironment = 0.16
        let inputResult = 0
        let calculate = 0

        if (dataSocEcoEnv.length === 1) {
            gradeSocial = dataSocEcoEnv[0].grade
            calculate = await predict.predictAnfis(gradeEconomic, gradeSocial, gradeEnvironment)
            inputResult = calculate['result']
        } else if (dataSocEcoEnv.length === 2) {
            gradeSocial = dataSocEcoEnv[0].grade
            gradeEconomic = dataSocEcoEnv[1].grade
            calculate = await predict.predictAnfis(gradeEconomic, gradeSocial, gradeEnvironment)
            inputResult = calculate['result']
        } else if (dataSocEcoEnv.length === 3) {
            gradeSocial = dataSocEcoEnv[0].grade
            gradeEconomic = dataSocEcoEnv[1].grade
            gradeEnvironment = dataSocEcoEnv[2].grade
            calculate = await predict.predictAnfis(gradeEconomic, gradeSocial, gradeEnvironment)
            inputResult = calculate['result']
        } else {
            inputResult = 0
        }

        await DataDimension.update({
            grade: inputResult,
        },{
            where: {
                id: id,
            }
        })

        msg = "Success delete environment"

        response = new Response.Success(false, msg, deleteData)
        return res.status(httpStatus.OK).json(response)
    } catch (error) {
        response = new Response.Error(true, error.message);
        return res.status(httpStatus.BAD_REQUEST).json(response);
    }
}

module.exports = {
    predictDimensionSocial,
    predictDimensionEconomic,
    predictDimensionEnvironment,
    getDataByDimensionId,
    updateSocial,
    updateEconomic,
    updateEnvironment,
    getDetailSocialById,
    getDetailEconomicById,
    getDetailEnvironmentById,
    deleteSocial,
    deleteEconomic,
    deleteEnvironment
}