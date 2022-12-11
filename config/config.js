require('dotenv').config()
const {
  DB_USERNAME, 
  DB_PASSWORD, 
  DB_HOSTNAME, 
  DB_NAME, 
  DB_DIALECT,
  DB_USERNAME_PROD, 
  DB_PASSWORD_PROD, 
  DB_HOSTNAME_PROD, 
  DB_NAME_PROD, 
  DB_DIALECT_PROD,
} = process.env
module.exports = {
  "development": {
    "username": DB_USERNAME,
    "password": DB_PASSWORD,
    "database": DB_NAME,
    "host": DB_HOSTNAME,
    "dialect": DB_DIALECT
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": DB_USERNAME_PROD,
    "password": DB_PASSWORD_PROD,
    "database": DB_NAME_PROD,
    "host": DB_HOSTNAME_PROD,
    "dialect": DB_DIALECT_PROD
  }
}
