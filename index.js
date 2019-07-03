'use strict'


const MiBand = require("miband");
const bluetooth = require("webbluetooth").bluetooth;
const pulseraController = require('./controllers/pulseraController');

connectDevice();

async function connectDevice() {
  try {
    const device = await bluetooth.requestDevice({
      filters: [{ services: [MiBand.advertisementService] }],
      optionalServices: MiBand.optionalServices
    });

    const server = await device.gatt.connect();

    let miband = new MiBand(server);
    await miband.init();
    console.log('Conexion con pulsera establecida.')

    global.miband = miband;
    
    await pulseraController.sendAlert(miband,await pulseraController.getBandInfo(miband));
    await pulseraController.getRitmoCadiaco(miband);
    //await pulseraController.sendBatteryInfo(miband,await pulseraController.getBandInfo(miband));
    //await pulseraController.tapDevice(miband);
    

    //await pulseraController.getBandInfo(miband);
    

  } catch (error) {
    console.log("ERROR: ", error);
  }
}





