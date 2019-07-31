'use strict'

const role = 'auth'
const { pick, omit } = require('lodash')
const { compareSync } = require('bcrypt')
const { sign } = require('jsonwebtoken')

const { LOG_TAG, PICK_FIELDS } = require('./fields')
const { defineSelectUserPattern } = require('./patterns')
const { defineSelectUserPayload } = require('./payloads')

module.exports = function Login () {
  const seneca = this

  seneca.add({ role, cmd: 'login' }, cmdLogin)

  function cmdLogin (args, done) {
    const params = pick(args, PICK_FIELDS)

    return selectUser(params)
      .then(params => comparePassword(params))
      .then(params => tokenGenerate(params))
      .then(params => saveToken(params))
      .then(result => done(null, { status: true, result }))
      .catch(err => done(null, {
        status: false,
        message: err && err.message || err
      }))
  }

  function selectUser (params) {
    return new Promise((resolve, reject) => {
      try {
        const pattern = defineSelectUserPattern()
        const payload = defineSelectUserPayload(params)
        return seneca.act(pattern, payload, (err, response) => {
          if (err) {
            seneca.log.fatal(LOG_TAG, err)
            return reject(err)
          }

          if (!response.status || !response.result) {
            seneca.log.error(LOG_TAG, response)
            return reject(response)
          }

          seneca.log.info(LOG_TAG, response)
          const { result: user } = response
          return resolve({ ...params, user })
        })
      } catch (err) {
        seneca.log.fatal(LOG_TAG, err)
        return reject(err)
      }
    })
  }

  async function comparePassword (params) {
    const { password, user } = params
    const { password: plainPassword } = user
    const comparePasswordResult = compareSync(password, plainPassword)

    if (!comparePasswordResult) {
      seneca.log.error(LOG_TAG, { comparePasswordResult })
      throw new Error('Password is invalid')
    }

    seneca.log.info(LOG_TAG, { comparePasswordResult })
    return params
  }

  async function tokenGenerate (params) {
    const user = omit(params.user, [ 'password' ])
    const token = sign(user, process.env.SECRET || 'secret')
    seneca.log.info(LOG_TAG, { token })
    return { user, token }
  }

  async function saveToken (params) {
    const redis = require('redis')
    const client = redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    })

    const { token, user } = params
    const ttl = process.env.TOKEN_TTL || 3600
    client.set(token, JSON.stringify(user), 'EX', ttl)
    client.quit()

    return { ...user, token }
  }

  return {
    name: role
  }
}
