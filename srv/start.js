'use strict'

const EncryptPassword = require('../src/encrypt-password')
const Login = require('../src/login')
const Logout = require('../src/logout')
const ValidToken = require('../src/valid-token')

const Seneca = require('seneca')
const seneca = Seneca()

seneca.use(EncryptPassword)
seneca.use(Login)
seneca.use(Logout)
seneca.use(ValidToken)

seneca.listen({
  ...((process.env.AUTH_TRANSPORT === 'amqp' && {
    type: process.env.AUTH_TRANSPORT,
    url: process.env.AMQP_URL
  }) || {
    type: process.env.AUTH_TRANSPORT || 'http',
    host: process.env.AUTH_HOST || '0.0.0.0',
    port: process.env.AUTH_PORT || process.env.PORT || 8201,
    protocol: process.env.AUTH_PROTOCOL || 'http'
  }),
  pin: { role: 'auth', cmd: '*' }
})

seneca.client({
  ...((process.env.USER_TRANSPORT === 'amqp' && {
    type: process.env.USER_TRANSPORT,
    url: process.env.AMQP_URL
  }) || {
    type: process.env.USER_TRANSPORT || 'http',
    host: process.env.USER_HOST || '0.0.0.0',
    port: process.env.USER_PORT || 8202,
    protocol: process.env.USER_PROTOCOL || 'http'
  }),
  pin: { role: 'user', cmd: 'select' }
})

module.exports = seneca
