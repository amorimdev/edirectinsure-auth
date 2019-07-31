'use strict'

const role = 'auth'
const { pick } = require('lodash')
const { hashSync } = require('bcrypt')
const { LOG_TAG, PICK_FIELDS, SALT } = require('./fields')

module.exports = function EncryptPassword () {
  const seneca = this

  seneca.add({ role, cmd: 'encrypt-password' }, cmdEncryptPassword)

  function cmdEncryptPassword (args, done) {
    const params = pick(args, PICK_FIELDS)

    return encryptPassword(params)
      .then(result => done(null, {
        status: true,
        result
      }))
      .catch(err => done(null, {
        status: false,
        message: err.message || err
      }))
  }

  function encryptPassword (params) {
    return new Promise((resolve, reject) => {
      try {
        const hashedPassword = hashSync(params.password, SALT)
        seneca.log.info(LOG_TAG, { hashedPassword })
        return resolve(hashedPassword)
      } catch (err) {
        seneca.log.fatal(LOG_TAG, err.message || err)
        return reject(err)
      }
    })
  }
}
