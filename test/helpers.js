'use strict'

module.exports.Seneca = done => new Promise((resolve, reject) => {
  const seneca = require('../srv/start')
  seneca.test(done)
  seneca.ready(err => {
    if (err) return reject(err)
    return resolve(seneca)
  })
})
