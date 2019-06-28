'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MonitorSchema = Schema({
    nombreUsuario: {type:String, unique:true, required:true},
    nombre: String,
    apellido: String,
    password: {type: String, required:true, selected:false },
    token: String,
    usuarios:[{type:mongoose.Schema.Types.ObjectId, ref: 'Usuario'}] 
});

module.exports = mongoose.model('Monitor', MonitorSchema);