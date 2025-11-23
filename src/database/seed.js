/**
 * Seed - Inserir dados de exemplo no banco
 * Execute: node src/database/seed.js
 */

const db = require("../config/database");
const bcrypt = require("bcryptjs");

const seedData = {
  users: [
    { name: "João Silva", email: "joao@example.com", password: "senha123456", role: "user" },
    { name: "Maria Santos", email: "maria@example.com", password: "senha123456", role: "user" },
    { name: "Pedro Oliveira", email: "pedro@example.com", password: "senha123456", role: "user" }
  ],

  experiments: [
    {
      title: "Reação Exotérmica: Mistura de Ácido Sulfúrico e Água",
      description: "Um experimento fascinante...",
      materials: "Ácido sulfúrico, água...",
      steps: "1. Adicione ácido na água...",
      safety_measures: "Óculos, luvas, etc."
    },
    {
      title: "Cristalização de Açúcar",
      description: "Aprenda como cristais são formados...",
      materials: "Açúcar, água, recipiente...",
      steps: "1. Dissolva o açúcar...",
      safety_measures: "Cuidado com água quente."
    },
    {
      title: "Vulcão Químico",
      description: "Vinagre + bicarbonato...",
      materials: "Vinagre, bicarbonato...",
      steps: "1. Misture tudo...",
      safety_measures: "Proteja a área."
    }
  ]
};

async function runSeed() {
  try {
    console.log("🌱 Inserindo dados de exemplo...\n");

    // === Usuários ===
    for (const user of seedData.users) {
      const hash = bcrypt.hashSync(user.password, 10);

      await db.query(
        "INSERT IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        [user.name, user.email, hash, user.role]
      );

      console.log(`✔ Usuário criado: ${user.email}`);
    }

    // Obter admin ID
    const [admin] = await db.query("SELECT id FROM users WHERE email = ?", ["admin@quishow.com"]);
    const adminId = admin[0]?.id || 1;

    // === Experimentos ===
    for (const exp of seedData.experiments) {
      await db.query(
        `INSERT INTO experiments 
        (title, description, materials, steps, safety_measures, admin_id)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [exp.title, exp.description, exp.materials, exp.steps, exp.safety_measures, adminId]
      );

      console.log(`✔ Experimento criado: ${exp.title}`);
    }

    console.log("\n🎉 SEED FINALIZADO COM SUCESSO!");
    console.log("Admin padrão:");
    console.log("  Email: admin@quishow.com");
    console.log("  Senha: admin123456");

    process.exit(0);
  } catch (err) {
    console.error("❌ Erro no seed:", err);
    process.exit(1);
  }
}

runSeed();
