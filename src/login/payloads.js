'use strict'

const { pick } = require('lodash')

module.exports.defineSelectUserPayload = params =>
  pick(params, [ 'email' ])
