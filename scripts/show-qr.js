const os = require('os');
const qrcode = require('qrcode-terminal');

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // In newer Node versions, family can be 'IPv4' or 4
      if ((iface.family === 'IPv4' || iface.family === 4) && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const port = process.env.PORT || 4000;
const ip = getLocalIp();
const url = `http://${ip}:${port}`;

console.log('\n==================================================');
console.log(`CapClub - Café & Bistrot Local Server`);
console.log(`Scan this QR code with your phone (connected to the same Wi-Fi)`);
console.log(`URL: ${url}`);
console.log('==================================================\n');

qrcode.generate(url, { small: true });
