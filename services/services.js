'use strict'

const jwt = require('jsonwebtoken');
const config = require('../config');

function createToken(monitor){
    const payload = {
        id: monitor._id,
        nombre: monitor.nombre,
        nombreUsuario : monitor.nombreUsuario
    }

    var token = jwt.sign(payload,config.secret,{
        expiresIn: 60*60*24
    });
    return token;
}

module.exports = {
    createToken
}