'use strict'

const express = require('express');
const protectedRoutes = express.Router();
const usuarioController = require('../controllers/usuarioController');
const monitorController = require('../controllers/monitorController');
const authMiddleware = require('../middlewares/authMiddleware');

//Usuario
protectedRoutes.get('/users/me', authMiddleware.isAuth ,usuarioController.getUsuariosMe);
protectedRoutes.post('/user',authMiddleware.isAuth,usuarioController.createUsuario);

//Monitor
protectedRoutes.get('/me', authMiddleware.isAuth, monitorController.getMe);

module.exports = protectedRoutes;