'use strict'

module.exports = {
  pattern: {
    role: 'auth',
    cmd: 'valid-token'
  },

  payload: {
    invalid: {},

    valid: token => ({
      token
    })
  }
}
