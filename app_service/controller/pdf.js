const fs = require('fs')

const getViewPdf = async (req, res) => {
    var stream = fs.createReadStream('./filepdf/file1.pdf');
    var filename = "Rancangan Penguatan Kelembagaan Rantai Pasok Agroindustri Sagu.pdf"; 
    // Be careful of special characters

    filename = encodeURIComponent(filename);
    // Ideally this should strip them

    res.setHeader('Content-disposition', 'inline; filename="' + filename + '"');
    res.setHeader('Content-type', 'application/pdf');

    stream.pipe(res);
} 

const getDownloadPdf = async (req, res) => {
    var file = fs.createReadStream('./filepdf/file1.pdf');
    var stat = fs.statSync('./filepdf/file1.pdf');
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=Rancangan Penguatan Kelembagaan Rantai Pasok Agroindustri Sagu.pdf');
    file.pipe(res);
} 

module.exports = {getViewPdf, getDownloadPdf}