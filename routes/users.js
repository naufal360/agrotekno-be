var express = require('express');
const users = require('../controller/users');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', users.registerUser)
router.post('/login', users.loginUser)
module.exports = router;
