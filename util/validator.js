const validatorDimension = {
    name: {type: "string", nullable: false},
    user_id: "number",
}

const validatorEconomicSchema = {
    risk: "number", 
    profit_dif: "number", 
    supply: "number", 
    demand_inc: "number", 
    market_acc: "number"
}

const validatorEnvironmentSchema = {
    emission: "number", 
    water_con: "number", 
    waste_com: "number", 
    waste_util: "number", 
    waste_manage: "number"
}

const validatorSocialSchema = {
    institutional_sup: "number", 
    local_emp: "number", 
    infra_avail: "number", 
    employee_welf: "number", 
    partner_inc: "number"
}
const validatorUpdateEconomicSchema = {
    risk: "number", 
    profit_dif: "number", 
    supply: "number", 
    demand_inc: "number", 
    market_acc: "number"
}

const validatorUpdateEnvironmentSchema = {
    emission: "number", 
    water_con: "number", 
    waste_com: "number", 
    waste_util: "number", 
    waste_manage: "number"
}

const validatorUpdateSocialSchema = {
    institutional_sup: "number", 
    local_emp: "number", 
    infra_avail: "number", 
    employee_welf: "number", 
    partner_inc: "number"
}

const usersSchema = {
    username: "string|min:4",
    password: "string|min:5",
    roles: "number|min:1|max:5"
}

const usersLoginSchema = {
    username: "string|min:4",
    password: "string|min:5"
}

module.exports = {
    validatorEconomicSchema, 
    validatorEnvironmentSchema, 
    validatorSocialSchema, 
    validatorUpdateEconomicSchema, 
    validatorUpdateEnvironmentSchema, 
    validatorUpdateSocialSchema, 
    usersSchema, 
    usersLoginSchema, 
    validatorDimension,
}