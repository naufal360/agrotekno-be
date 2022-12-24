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

const theDate = (dates) => {
    let result, year, month, date, themonth, thedate = null

    year = dates.substring(0,4)
    month = Number(dates.substring(5,7))
    date = dates.substring(8,10)

    const d = new Date(dates);
    let numDay = d.getDay()

    switch (numDay) {
        case 0:
            thedate = "Minggu"
            break;
        case 1:
            thedate = "Senin"
            break;
        case 2:
            thedate = "Selasa"
            break;
        case 3:
            thedate = "Rabu"
            break;
        case 4:
            thedate = "Kamis"
            break;
        case 5:
            thedate = "Jumat"
            break;
        case 6:
            thedate = "Sabtu"
            break;
        default:
            break;
    }

    switch (month) {
        case 1:
            themonth = "Januari"
            break;
        case 2:
            themonth = "Febuari"
            break;
        case 3:
            themonth = "Maret"
            break;
        case 4:
            themonth = "April"
            break;
        case 5:
            themonth = "Mei"
            break;
        case 6:
            themonth = "Juni"
            break;
        case 7:
            themonth = "Juli"
            break;
        case 8:
            themonth = "Agustus"
            break;
        case 9:
            themonth = "September"
            break;
        case 10:
            themonth = "Oktober"
            break;
        case 11:
            themonth = "November"
            break;
        case 12:
            themonth = "Desember"
            break;
        default:
            break;
    }

    result = thedate + ", " + date + " " +  themonth + " " + year

    return result
}

module.exports = { generateStatus, theDate }