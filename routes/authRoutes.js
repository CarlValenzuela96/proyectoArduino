'use strict'

const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/authController.js');
    
authRouter.post('/register', authController.registrarMonitor);
authRouter.post('/login', authController.loginMonitor);


module.exports = authRouter;