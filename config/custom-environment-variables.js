module.exports = {
  env: 'NODE_ENV',
  connectionDB: {
    host: 'DATABASE_HOST',
    user: 'DATABASE_USER',
    password: 'DATABASE_PASSWORD',
    name: 'DATABASE_NAME',
  },
  api_sendgrid: 'Email_api_key',
  auth: {
    jwt: {
      secret: 'JWT_SECRET',
    },
  },
};