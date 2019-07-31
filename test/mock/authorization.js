'use strict'

module.exports.setAuthorization = authorization => {
  if (!this.authorization) {
    this.authorization = authorization
  }
}

module.exports.getAuthorization = () => this.authorization
