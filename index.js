const MiBand = require("miband");
const bluetooth = require("webbluetooth").bluetooth;

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

    console.log("Notifications demo...");
    await miband.showNotification("message");
  } catch (error) {
    console.log("ERROR: ", error);
  }
}
