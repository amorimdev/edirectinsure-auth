'use strict'

module.exports = {
  pattern: {
    role: 'auth',
    cmd: 'encrypt-password'
  },

  payload: {
    invalid: {},

    valid: {
      password: '1234'
    }
  }
}
