'use strict'

const MiBand = require("miband");
const bluetooth = require("webbluetooth").bluetooth;
const delay = require('delay');



  async function tapDevice(miband){
    var cont = 0;  
    console.log('Tap MiBand button, quick!')
    miband.on('button', () => console.log('Tap detected'))
    try {  
      await miband.waitButton(10000)
      
    } catch (e) {
      console.log('OK, nevermind ;)')
  }
  }
  
  async function getRitmoCadiaco(miband){
    console.log('Heart Rate Monitor (single-shot)')
    console.log('Result:', await miband.hrmRead())
  
    console.log('Heart Rate Monitor (continuous for 30 sec)...')
    miband.on('heart_rate', (rate) => {
      console.log('Heart Rate:', rate)
    })
    await miband.hrmStart();
    await delay(30000);
    await miband.hrmStop();
  }

  async function getBandInfo(miband){
      var info = {
          battery: await miband.getBatteryInfo(),
          serial: await miband.getSerial()      
                }
      return info;
  }

  module.exports = {
      getBandInfo,
      getRitmoCadiaco,
      tapDevice
  };

  