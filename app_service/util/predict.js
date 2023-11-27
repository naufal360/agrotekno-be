require('dotenv').config()
const axios = require('axios')


const predictSomething = async (id, input_one, input_two, input_three, input_four, input_five) => {
    let hostFlask = process.env.HOST_FLASK
    let portFlask = process.env.PORT_FLASK
    let url = hostFlask +":"+portFlask+ "/predict"
    let res = await axios.post(url, {
        id: id,
        input_one: input_one, 
        input_two: input_two, 
        input_three: input_three,
        input_four: input_four, 
        input_five: input_five,
    });

    let data = res.data
    return data
}

const predictAnfis= async (input_one, input_two, input_three) => {
    let hostFlask = process.env.HOST_FLASK
    let portFlask = process.env.PORT_FLASK
    let url = hostFlask +":"+portFlask+ "/dimensionpredict"
    let res = await axios.post(url, {
        input_one: input_one, 
        input_two: input_two, 
        input_three: input_three,
    });

    let dimensionRes = res.data
    return dimensionRes
}

module.exports = {predictSomething, predictAnfis};