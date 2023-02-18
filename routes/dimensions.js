var express = require('express');
var router = express.Router();
var dimensionController = require("../controller/dimensions");

router.post('/dimension', dimensionController.CreateDimension)
router.get('/:id/dimension', dimensionController.getAllDataDimensionByUserId)
router.delete('/dimension/:id', dimensionController.DeleteDataDimension)

module.exports = router