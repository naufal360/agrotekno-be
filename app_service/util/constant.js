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

const kesimpulan = (dimension) => {
    let typeCode = null
    let text1, text2
    let calcSocial = {}
    let calcEconomic = {}
    let calcEnvironment = {}
    const socialValue = [1, 125, 1, 1.25, 25]
    const economicValue = [1, 40, 100, 50, 1]
    const environmentValue = [0.85, 40, 1, 100, 1]

    switch (dimension.prefixId) {
        case 1:
            typeCode = "sosial"
            code = 1;
            break;
        case 2:
            typeCode = "ekonomi"
            break;
        case 3:
            typeCode = "lingkungan"
            break;
        default:
            break;
    }

    if (dimension.prefixId === 1 || dimension.prefixId === 4) {
        for (let i = 1; i <=5; i++) {
            calcSocial[i] = Object.values(dimension)[i+3] / socialValue[i-1]
        }

        // Create the array of key-value pairs
        let items = Object.keys(calcSocial).map(
        (key) => { return [key, calcSocial[key]] });

        // Sort the array based on the second element (i.e. the value)
        items.sort(
        (first, second) => { return second[1] - first[1] }
        );

        // Obtain the list of keys in sorted order of the values.
        let keys = items.map(
        (e) => { return e[0] });

        text1 = `Dari data yang dimasukkan pada dimensi ${typeCode} ini mendapatkan nilai ${dimension.grade} yang berarti nilai keberlanjutan indikator ${typeCode} ini ${dimension.status}.`;
        if (dimension.prefixId === 1) {
            text2 = `Untuk indikator kunci pada industri sagu basah terdapat pada S${keys[0]}, S${keys[1]} dan S${keys[2]}.`; 
        } else if (dimension.prefixId === 4) {
            text2 = `Untuk indikator kunci pada industri sagu kering terdapat pada S${keys[0]}, S${keys[1]} dan S${keys[2]}.`;
        }

    } else if (dimension.prefixId === 2 || dimension.prefixId === 5) {
        for (let i = 1; i <=5; i++) {
            calcEconomic[i] = Object.values(dimension)[i+3] / economicValue[i-1]
        }
        
        // Create the array of key-value pairs
        let items = Object.keys(calcEconomic).map(
        (key) => { return [key, calcEconomic[key]] });

        // Sort the array based on the second element (i.e. the value)
        items.sort(
        (first, second) => { return second[1] - first[1] }
        );

        // Obtain the list of keys in sorted order of the values.
        let keys = items.map(
        (e) => { return e[0] });

        text1 = `Dari data yang dimasukkan pada dimensi ${typeCode} ini mendapatkan nilai ${dimension.grade} yang berarti nilai keberlanjutan indikator ${typeCode} ini ${dimension.status}.`;
        if (dimension.prefixId === 2) {
            text2 = `Untuk indikator kunci pada industri sagu basah terdapat pada E${keys[0]}, E${keys[1]} dan E${keys[2]}.`; 
        } else if (dimension.prefixId === 5) {
            text2 = `Untuk indikator kunci pada industri sagu kering terdapat pada E${keys[0]}, E${keys[1]} dan E${keys[2]}.`;
        }
    } else {
        for (let i = 1; i <=5; i++) {
            calcEnvironment[i] = Object.values(dimension)[i+3] / environmentValue[i-1]
        }
        
        // Create the array of key-value pairs
        let items = Object.keys(calcEnvironment).map(
        (key) => { return [key, calcEnvironment[key]] });

        // Sort the array based on the second element (i.e. the value)
        items.sort(
        (first, second) => { return second[1] - first[1] }
        );

        // Obtain the list of keys in sorted order of the values.
        let keys = items.map(
        (e) => { return e[0] });

        text1 = `Dari data yang dimasukkan pada dimensi ${typeCode} ini mendapatkan nilai ${dimension.grade} yang berarti nilai keberlanjutan indikator ${typeCode} ini ${dimension.status}.`;
        if (dimension.prefixId === 3) {
            text2 = `Untuk indikator kunci pada industri sagu basah terdapat pada L${keys[0]}, L${keys[1]} dan L${keys[2]}.`; 
        } else if (dimension.prefixId === 6) {
            text2 = `Untuk indikator kunci pada industri sagu kering terdapat pada L${keys[0]}, L${keys[1]} dan L${keys[2]}.`;
        }
    }

    const result = [text1, text2];

    return result;
}

const saran = (dimension) => {
    let typeCode = null
    let text
    let calcSocial = {}
    let calcEconomic = {}
    let calcEnvironment = {}
    const socialValue = [1, 125, 1, 1.25, 25]
    const economicValue = [1, 40, 100, 50, 1]
    const environmentValue = [0.85, 40, 1, 100, 1]

    switch (dimension.prefixId) {
        case 1:
            typeCode = "sosial"
            code = 1;
            break;
        case 2:
            typeCode = "ekonomi"
            break;
        case 3:
            typeCode = "lingkungan"
            break;
        default:
            break;
    }

    if (dimension.prefixId === 1 || dimension.prefixId === 4) {
        for (let i = 1; i <=5; i++) {
            calcSocial[i] = Object.values(dimension)[i+3] / socialValue[i-1]
        }

        // Create the array of key-value pairs
        let items = Object.keys(calcSocial).map(
        (key) => { return [key, calcSocial[key]] });

        // Sort the array based on the second element (i.e. the value)
        items.sort(
        (first, second) => { return second[1] - first[1] }
        );

        // Obtain the list of keys in sorted order of the values.
        let keys = items.map(
        (e) => { return e[0] });

        if (dimension.prefixId === 1) {
            text = `Industri sagu basah S${keys[4]} dan S${keys[3]}.`; 
        } else if (dimension.prefixId === 4) {
            text = `Industri sagu  kering S${keys[4]} dan S${keys[3]}.`;
        }

    } else if (dimension.prefixId === 2 || dimension.prefixId === 5) {
        for (let i = 1; i <=5; i++) {
            calcEconomic[i] = Object.values(dimension)[i+3] / economicValue[i-1]
        }
        
        // Create the array of key-value pairs
        let items = Object.keys(calcEconomic).map(
        (key) => { return [key, calcEconomic[key]] });

        // Sort the array based on the second element (i.e. the value)
        items.sort(
        (first, second) => { return second[1] - first[1] }
        );

        // Obtain the list of keys in sorted order of the values.
        let keys = items.map(
        (e) => { return e[0] });

        if (dimension.prefixId === 2) {
            text = `Industri sagu basah E${keys[4]} dan E${keys[3]}.`; 
        } else if (dimension.prefixId === 5) {
            text = `Industri sagu kering pada E${keys[4]} dan E${keys[3]}.`;
        }
    } else {
        for (let i = 1; i <=5; i++) {
            calcEnvironment[i] = Object.values(dimension)[i+3] / environmentValue[i-1]
        }
        
        // Create the array of key-value pairs
        let items = Object.keys(calcEnvironment).map(
        (key) => { return [key, calcEnvironment[key]] });

        // Sort the array based on the second element (i.e. the value)
        items.sort(
        (first, second) => { return second[1] - first[1] }
        );

        // Obtain the list of keys in sorted order of the values.
        let keys = items.map(
        (e) => { return e[0] });

        if (dimension.prefixId === 3) {
            text = `Industri sagu basah L${keys[4]} dan L${keys[3]}.`; 
        } else if (dimension.prefixId === 6) {
            text = `Industri sagu kering L${keys[4]} dan L${keys[3]}.`;
        }
    }

    const result = text

    return result;
}

module.exports = { generateStatus, theDate, kesimpulan, saran }