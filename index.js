'use strict'


const MiBand = require("miband");
const bluetooth = require("webbluetooth").bluetooth;
const pulseraController = require('./controllers/pulseraController');

const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config');

const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const publicRoutes = require('./routes/publicRoutes');



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
    app.use('/auth', authRoutes);
    app.use('/protected', protectedRoutes);
    app.use('/public', publicRoutes);

    mongoose.connect(config.db, { useNewUrlParser: true }, (err, res) => {
      if (err) {
        return console.log(`Error al conectar a base de datos: ${err}`);
      }
      console.log('Conexion a base de datos establecida');

      //Start backend
      app.listen(config.port, () => {
        console.log(`API REST conrriendo en http://localhost:${config.port}`)
      });
    })

    
    await pulseraController.sendAlert(miband,await pulseraController.getBandInfo(miband));
    await pulseraController.getRitmoCadiaco(miband);
    await pulseraController.sendBatteryInfo(miband,await pulseraController.getBandInfo(miband));
    //await pulseraController.tapDevice(miband);
    

    //await pulseraController.getBandInfo(miband);
    

  } catch (error) {
    console.log("ERROR: ", error);
  }
}





