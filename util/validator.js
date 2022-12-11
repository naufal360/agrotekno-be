const validatorEconomicSchema = {
    user_id: "number",
    risk: "number", 
    profit_dif: "number", 
    supply: "number", 
    demand_inc: "number", 
    market_acc: "number"
}

const validatorEnvironmentSchema = {
    user_id: "number",
    emission: "number", 
    water_con: "number", 
    waste_com: "number", 
    waste_util: "number", 
    waste_manage: "number"
}

const validatorSocialSchema = {
    user_id: "number",
    institutional_sup: "number", 
    local_emp: "number", 
    infra_avail: "number", 
    employee_welf: "number", 
    partner_inc: "number"
}

const usersSchema = {
    username: "string|min:4",
    password: "string|min5",
    roles: "string"
}

const usersLoginSchema = {
    username: "string|min:4",
    password: "string|min5"
}

module.exports = {validatorEconomicSchema, validatorEnvironmentSchema, validatorSocialSchema, usersSchema, usersLoginSchema}