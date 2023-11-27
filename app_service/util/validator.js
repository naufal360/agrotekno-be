const validatorDimension = {
    name: {type: "string", nullable: false},
    user_id: "number",
}

const validatorEconomicSchema = {
    is_wet: "boolean", 
    risk: "number|min:0|max:1", 
    profit_dif: "number|min:10|max:40", 
    supply: "number|min:0|max:100", 
    demand_inc: "number|min:-50|max:50", 
    market_acc: "number|min:0|max:100"
}

const validatorEnvironmentSchema = {
    is_wet: "boolean", 
    emission: "number|min:0|max:0.85", 
    water_con: "number|min:6|max:40", 
    waste_com: "number|min:0|max:1", 
    waste_util: "number|min:0|max:100", 
    waste_manage: "number|min:0|max:1"
}

const validatorSocialSchema = {
    is_wet: "boolean", 
    institutional_sup: "number|min:0|max:1",
    local_emp: "number|min:0|max:100", 
    infra_avail: "number|min:0|max:1", 
    employee_welf: "number|min:0|max:1", 
    partner_inc: "number|min:-25|max:25"
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
    usersSchema, 
    usersLoginSchema, 
    validatorDimension,
}