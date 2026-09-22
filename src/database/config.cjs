module.exports = {
  development: {
    username: process.env.DB_USER || 'devuser',
    password: process.env.DB_PASSWORD || 'adilson',
    database: process.env.DB_NAME || 'LOJA',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
  },
};