'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const UsuarioSchema = Schema({
    nombre:String,
    apellido:String,
    edad:Number,
    serial_pulsera:{type:String,unique:true},
    monitor:{type:mongoose.Schema.Types.ObjectId, ref: 'Monitor'}
});

module.exports= mongoose.model('Usuario',UsuarioSchema);