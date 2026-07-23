require("dotenv").config();

const dialect = process.env.DB_TYPE || "mysql";
const isPostgres = dialect === "postgres";
const isSSL = process.env.DB_SSL === "true";

const dialectOptions = {
  ...(isSSL && {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  }),
  ...(!isPostgres && { charset: 'utf8mb4' }),
};

const baseConfig = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || (isPostgres ? 5432 : 3306),
  pool: {
    max: 5,
    min: 0,
    acquire: 15000,
    idle: 10000,
  },
  dialect,
  dialectOptions,
  define: isPostgres
    ? {}
    : { charset: 'utf8mb4', collate: 'utf8mb4_general_ci' },
};

module.exports = {
  development: { ...baseConfig },
  test: { ...baseConfig },
  production: { ...baseConfig, logging: false },
};