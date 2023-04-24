const axios = require('axios')

const predictSomething = async (id, input_one, input_two, input_three, input_four, input_five) => {
    let res = await axios.post("http://127.0.0.1:8081/predict", {
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