import "../bootstrap";

module.exports = {
  define: {
    charset: "utf8mb4",
    collate: "utf8mb4_bin"
  },
  dialect: process.env.DB_DIALECT || "mysql",
  timezone: "-03:00",
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  logging: false,
  logQueryParameters: true,
  pool: {
    max: 20,
    min: 5,
    acquire: 60000,
    idle: 10000
  },
  hooks: {
    afterConnect: async (connection: any) => {
      await connection.query('SET idle_in_transaction_session_timeout = \'30s\'');
    },
  },
  // logging: process.env.DB_DEBUG === "false"
};
