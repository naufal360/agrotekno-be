const generateStatus = (result) => {
    let response = null

    if (result > 80 && result <= 100) {
        response = "Sangat Berkelanjutan"
    } else if (result > 60 && result <= 80){
        response = "Berkelanjutan"
    } else if (result > 40 && result <= 60){
        response = "Hampir Berkelanjutan"
    } else if (result > 20 && result <= 40){
        response = "Tidak Berkelanjutan"
    } else {
        response = "Sangat Tidak Berkelanjutan"
    }

    return response
} 

module.exports = { generateStatus }