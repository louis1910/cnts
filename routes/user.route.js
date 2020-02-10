const express = require('express');
const router = express.Router();


const register = require('../controllers/register.controller.js');
const login = require('../controllers/login.controller.js');

const authMiddleware = require('../middleware/authencation.middleware');

// -------------register
router.get('/register', register.register);

router.post('/register', register.postRegister);


// -------------login
router.get('/login', authMiddleware.isLogin, login.login);

router.post('/login', login.postLogin);

router.get('/logout', login.logout);




module.exports = router; 