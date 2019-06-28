'use strict'

const express = require('express');
const publicRouter = express.Router();
const usuarioController = require('../controllers/usuarioController');
const monitorController = require('../controllers/monitorController');

//Usuario
publicRouter.get('/users/me', usuarioController.getUsuariosMe);
publicRouter.get('/users', usuarioController.getUsuarios);
publicRouter.get('/user/:usuarioId', usuarioController.getUsuarioPorId);

//Monitor
publicRouter.get('/monitors', monitorController.getMonitores);
publicRouter.get('/monitor/:monitorId', monitorController.getMonitorPorId);

module.exports = publicRouter;