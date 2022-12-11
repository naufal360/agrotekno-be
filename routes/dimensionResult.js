var express = require('express');
var router = express.Router();
var dimensionController = require("../controller/dimensionResult");

router.post("/economic", dimensionController.predictDimensionEconomic)
router.post("/social", dimensionController.predictDimensionSocial)
router.post("/environment", dimensionController.predictDimensionEnvironment)

module.exports = router