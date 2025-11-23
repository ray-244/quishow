const mysql = require("mysql2");
const { URL } = require("url");
const dotenv = require("dotenv");
dotenv.config();

const DEFAULT_DB_URL = process.env.DB_URL;

let connection;

try {
  const parsed = new URL(DEFAULT_DB_URL);

  const config = {
    host: parsed.hostname,
    port: parsed.port ? Number(parsed.port) : 3306,
    user: decodeURIComponent(parsed.username || ""),
    password: decodeURIComponent(parsed.password || ""),
    database: parsed.pathname ? parsed.pathname.replace(/^\//, "") : undefined,
    ssl: { rejectUnauthorized: false },
    connectTimeout: 10000,
  };

  connection = mysql.createConnection(config);

  connection.connect((err) => {
    if (err) {
      console.error("Erro ao conectar ao banco de dados (MySQL/TiDB):", err);
      return;
    }
    console.log(
      "Conectado ao banco de dados MySQL/TiDB Cloud:",
      config.host + ":" + config.port + "/" + config.database
    );
  });
} catch (err) {
  console.error("URL de conexão inválida para o banco de dados:", err);
}

module.exports = connection.promise();
