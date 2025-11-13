// Script pour obtenir l'adresse IP locale
// Utile pour configurer VITE_API_URL sur d'autres appareils

const os = require("os");

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  const addresses = [];

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Ignorer les adresses internes et IPv6
      if (iface.family === "IPv4" && !iface.internal) {
        addresses.push({
          interface: name,
          address: iface.address,
        });
      }
    }
  }

  return addresses;
}

const ips = getLocalIP();

console.log("\n🌐 Adresses IP locales détectées :\n");
if (ips.length === 0) {
  console.log("❌ Aucune adresse IP trouvée");
} else {
  ips.forEach((ip) => {
    console.log(`  📍 ${ip.interface}: ${ip.address}`);
    console.log(`     → URL API: http://${ip.address}:4000\n`);
  });
  console.log("💡 Utilisez l'une de ces adresses pour configurer VITE_API_URL");
  console.log("   Créez un fichier frontend/.env avec :");
  console.log(`   VITE_API_URL=http://${ips[0].address}:4000\n`);
}

