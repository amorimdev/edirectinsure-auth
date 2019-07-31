'use strict'

const role = 'auth'
const { pick } = require('lodash')
const { LOG_TAG, PICK_FIELDS } = require('./fields')

module.exports = function ValidToken () {
  const seneca = this

  seneca.add({ role, cmd: 'valid-token' }, cmdValidToken)

  function cmdValidToken (args, done) {
    const params = pick(args, PICK_FIELDS)

    return validToken(params)
      .then(() => done(null, { status: true }))
      .catch(err => done(null, {
        status: false,
        message: err.message || err
      }))
  }

  function validToken (params) {
    return new Promise((resolve, reject) => {
      try {
        const redis = require('redis')
        const client = redis.createClient({
          url: process.env.REDIS_URL || 'redis://localhost:6379'
        })

        client.exists(params.token, (err, result) => {
          if (err) {
            seneca.log.fatal(LOG_TAG, err.message || err)
            return reject(err)
          }

          if (!result) {
            seneca.log.error(LOG_TAG, { result })
            return reject(new Error('Invalid credentials'))
          }

          seneca.log.info(LOG_TAG, { result })
          client.quit()
          return resolve(result)
        })
      } catch (err) {
        seneca.log.fatal(LOG_TAG, err.message || err)
        return reject(err)
      }
    })
  }
}
