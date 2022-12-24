var express = require('express');
var router = express.Router();
var socialEcoEnvsController = require("../controller/socialecoenvs");

router.post('/dimension/:id/social/predict', socialEcoEnvsController.predictDimensionSocial)
router.post('/dimension/:id/economic/predict', socialEcoEnvsController.predictDimensionEconomic)
router.post('/dimension/:id/environment/predict', socialEcoEnvsController.predictDimensionEnvironment)
router.get('/dimension/:id/socecoenv', socialEcoEnvsController.getDataByDimensionId)
router.put('/dimension/:id/social', socialEcoEnvsController.updateSocial)
router.put('/dimension/:id/economic', socialEcoEnvsController.updateEconomic)
router.put('/dimension/:id/environment', socialEcoEnvsController.updateEnvironment)
router.get('/dimension/:id/social', socialEcoEnvsController.getDetailSocialById)
router.get('/dimension/:id/economic', socialEcoEnvsController.getDetailEconomicById)
router.get('/dimension/:id/environment', socialEcoEnvsController.getDetailEnvironmentById)

module.exports = router