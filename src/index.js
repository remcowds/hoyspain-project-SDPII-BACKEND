const createServer = require('./createServer');

//main omdat anders await niet werkt
async function main() {
  try {
    const server = await createServer();
    await server.start();

    const onClose = async () => {
      await server.stop();
      process.exit(0);
    };

    process.on('SIGTERM', onClose); //algemeen signaal bij afsluiten
    process.on('SIGQUIT', onClose); //zelfde + core dump
  } catch (error) {
    process.exit(-1);
  }
}

main();