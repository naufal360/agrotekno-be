require('dotenv').config()
const axios = require('axios')


const predictSomething = async (id, input_one, input_two, input_three, input_four, input_five) => {
    let hostFlask = process.env.HOST_FLASK
    let url = hostFlask + "/predict"
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

module.exports = {predictSomething};