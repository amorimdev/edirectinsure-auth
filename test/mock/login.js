'use strict'

module.exports = {
  pattern: {
    role: 'auth',
    cmd: 'login'
  },

  payload: {
    invalid: {},

    unauthorized: {
      email: 'amorim.dev@gmail.com',
      password: '4321'
    },

    valid: {
      email: 'amorim.dev@gmail.com',
      password: '1234'
    }
  }
}
