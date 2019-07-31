'use strict'

const role = 'auth'
const { pick } = require('lodash')
const { LOG_TAG, PICK_FIELDS } = require('./fields')

module.exports = async function Logout () {
  const seneca = this

  seneca.add({ role, cmd: 'logout' }, cmdLogout)

  function cmdLogout (args, done) {
    const params = pick(args, PICK_FIELDS)

    return removeUserToken(params)
      .then(() => done(null, { status: true }))
      .catch(err => done(null, {
        status: false,
        message: err && err.message || err
      }))
  }

  function removeUserToken (params) {
    return new Promise((resolve, reject) => {
      try {
        const redis = require('redis')
        const client = redis.createClient({
          url: process.env.REDIS_URL || 'redis://localhost:6379'
        })

        client.del(params.authorization, (err, result) => {
          if (err) {
            seneca.log.fatal(LOG_TAG, err.message || err)
            return reject(err)
          }

          if (!result) {
            seneca.log.error(LOG_TAG, { result })
            return reject(new Error('Invalid credentials'))
          }

          client.quit()
          seneca.log.info(LOG_TAG, { result })
          return resolve()
        })
      } catch (err) {
        seneca.log.fatal(LOG_TAG, err.message || err)
        return reject(err)
      }
    })
  }

  return {
    name: role
  }
}
