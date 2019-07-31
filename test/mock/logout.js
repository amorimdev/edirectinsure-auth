'use strict'

module.exports = {
  pattern: {
    role: 'auth',
    cmd: 'logout'
  },

  payload: {
    unauthorized: {
      authorization: '1234'
    },

    valid: authorization => ({
      authorization
    })
  }
}
