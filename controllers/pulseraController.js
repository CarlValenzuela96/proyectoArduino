'use strict'

const delay = require('delay');
const mqtt = require('mqtt');
const config = require('../config');
const Usuario = require('../models/Usuario');

/**
 * Envia a thingsboard informacion referente a la bateria de la pulsera
 * @param {*} miband 
 * @param {*} info 
 */
async function sendBatteryInfo(miband, info) {
  var bartteryInfo = info.battery;

  console.log(bartteryInfo);
}

/**
 * Envia una alerta a thingsboard si se presiona 2 veces el boton de la banda en menos de 5 segundos
 * @param {*} miband 
 * @param {*} info 
 */
async function sendAlert(miband, info) {
  var cont = 0
  Usuario.findOne({
    serial_pulsera: info.serial
  }).exec((err, usuario) => {

    if (usuario) {

      var alert = {
        alerta: 'Usuario ' + usuario.nombre + ' necesita ayuda'
      };

      miband.on('button', () => {

        cont = cont + 1
        if (cont != 2) {
          let setCount = async () => {
            await delay(5000);
            cont = 0;
          
          }
          setCount();
        }
        
        if (cont == 2) {

          cont = 0;
          var client = mqtt.connect(config.mqttIp, {
            username: config.mqttToken
          })

          client.on('connect', function () {
            client.subscribe('v1/devices/me/telemetry')
            client.publish('v1/devices/me/telemetry', JSON.stringify(alert))
            client.end()
          })

          client.on('message', function (topic, message) {
            console.log('response.topic: ' + topic)
            console.log('response.body: ' + message.toString())
            client.end()
          })

        }
      });

    }

  });

  try {
    await miband.waitButton(10000)
  } catch (e) {
    console.log('OK, nevermind ;)')
    cont = 0;
    console.log("cont espera: " + cont);
  }
}

/**
 * Envia true en caso de que el usuario toque el boton de la pulsera
 * @param {*} miband 
 */
async function tapDevice(miband) {
  var cont = 0;
  console.log('Tap MiBand button, quick!')
  miband.on('button', () => {

    console.log('Tap detected')
    var tap = {
      tap: true
    }
    var client = mqtt.connect(config.mqttIp, {
      username: config.mqttToken
    })

    client.on('connect', function () {
      //client.subscribe('v1/devices/me/telemetry')
      client.subscribe('v1/devices/me/attributes/response/+')
      //client.publish('v1/devices/me/telemetry',  JSON.stringify(tap))
      client.publish('v1/devices/me/attributes/request/1', JSON.stringify(tap))
    })


    client.on('message', function (topic, message) {
      console.log('response.topic: ' + topic)
      console.log('response.body: ' + message.toString())
      client.end()
    })


  })
  try {
    await miband.waitButton(10000)

  } catch (e) {
    console.log('OK, nevermind ;)')
  }
}

/**
 * Envia a thingsboard el ritmo cardiaco del usuario de la pulsera
 * @param {*} miband 
 */
async function getRitmoCadiaco(miband) {
  console.log('Heart Rate Monitor (single-shot)')
  console.log('Result:', await miband.hrmRead())

  console.log('Heart Rate Monitor (continuous for 30 sec)...')
  miband.on('heart_rate', (rate) => {
    var heart_rate = {
      heart_rate: rate
    }

    var client = mqtt.connect(config.mqttIp, {
      username: config.mqttToken
    })

    client.on('connect', function () {
      client.subscribe('v1/devices/me/telemetry')
      client.publish('v1/devices/me/telemetry', JSON.stringify(heart_rate))
    })


    client.on('message', function (topic, message) {
      console.log('response.topic: ' + topic)
      console.log('response.body: ' + message.toString())
      client.end()
    })
  })
  await miband.hrmStart();
  await delay(30000);
  await miband.hrmStop();
}

async function getBandInfo(miband) {
  var info = {
    battery: await miband.getBatteryInfo(),
    serial: await miband.getSerial()
  }

  return info;
}

module.exports = {
  getBandInfo,
  getRitmoCadiaco,
  tapDevice,
  sendAlert,
  sendBatteryInfo
};

