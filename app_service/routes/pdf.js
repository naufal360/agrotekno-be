var express = require('express');
var router = express.Router();

const filepdf = require('../controller/pdf');


router.get('/download', filepdf.getDownloadPdf);
router.get('/view', filepdf.getViewPdf);


module.exports = router;
