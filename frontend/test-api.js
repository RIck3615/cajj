// Script de test pour vérifier la connexion à l'API
// Utilisation: node test-api.js [URL]
// Exemple: node test-api.js http://localhost:4000

const url = process.argv[2] || "http://localhost:4000";

console.log(`\n🧪 Test de connexion à l'API: ${url}\n`);

async function testConnection() {
  try {
    console.log("1️⃣ Test de la route racine (/)...");
    const response1 = await fetch(`${url}/`);
    const data1 = await response1.json();
    console.log("   ✅ Succès:", data1);

    console.log("\n2️⃣ Test de la route /api/about...");
    const response2 = await fetch(`${url}/api/about`);
    const data2 = await response2.json();
    console.log("   ✅ Succès:", Object.keys(data2));

    console.log("\n3️⃣ Test de la route /api/auth/login (sans credentials)...");
    const response3 = await fetch(`${url}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "test", password: "test" }),
    });
    const data3 = await response3.json();
    console.log("   ✅ Réponse reçue (attendu: erreur 401):", data3);

    console.log("\n✅ Tous les tests sont passés !");
    console.log(`\n💡 Utilisez cette URL dans frontend/.env :`);
    console.log(`   VITE_API_URL=${url}\n`);
  } catch (error) {
    console.error("\n❌ Erreur:", error.message);
    console.error("\n💡 Vérifiez que :");
    console.error("   1. Le backend est démarré (cd backend && npm run dev)");
    console.error("   2. L'URL est correcte");
    console.error("   3. Le port 4000 n'est pas bloqué par un pare-feu\n");
    process.exit(1);
  }
}

// Utiliser node-fetch si disponible, sinon fetch natif (Node 18+)
if (typeof fetch === "undefined") {
  console.error("❌ Node.js 18+ est requis pour ce script");
  console.error("   Ou installez node-fetch: npm install node-fetch\n");
  process.exit(1);
}

testConnection();

