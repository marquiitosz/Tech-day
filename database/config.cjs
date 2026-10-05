module.exports = {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'LOJA',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
  },
};