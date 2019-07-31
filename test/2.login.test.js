/* eslint-env mocha */
/* eslint no-debugger: off */

const { expect } = require('chai')
const { Seneca } = require('./helpers')

const Mock = require('./mock/login')
const { setAuthorization } = require('./mock/authorization')

describe('Auth Login Tests', () => {
  let seneca = null

  before(done => {
    Seneca()
      .then(instance => {
        seneca = instance
        return done(null)
      })
      .catch(done)
  })

  beforeEach(() => { debugger })

  it('Expect seneca instance not equal to null', done => {
    try {
      expect(seneca).not.to.equal(null)
      done(null)
    } catch (err) {
      done(err)
    }
  })

  it('Expect to not login because has invalid payload', done => {
    try {
      const pattern = Mock.pattern
      const payload = Mock.payload.invalid
      const expectMessageError = 'data and hash arguments required'
      seneca.act(pattern, payload, (err, response) => {
        if (err) {
          return done(err)
        }

        expect(typeof response).to.be.equal('object')
        expect(response.status).to.be.equal(false)
        expect(response.message).to.be.equal(expectMessageError)
        done(null)
      })
    } catch (err) {
      done(err)
    }
  })

  it('Expect to not login because has unauthorized user', done => {
    try {
      const pattern = Mock.pattern
      const payload = Mock.payload.unauthorized
      const expectMessageError = 'Password is invalid'
      seneca.act(pattern, payload, (err, response) => {
        if (err) {
          return done(err)
        }

        expect(typeof response).to.be.equal('object')
        expect(response.status).to.be.equal(false)
        expect(response.message).to.be.equal(expectMessageError)
        done(null)
      })
    } catch (err) {
      done(err)
    }
  })

  it('Expect to login an user', done => {
    try {
      const pattern = Mock.pattern
      const payload = Mock.payload.valid
      seneca.act(pattern, payload, (err, response) => {
        if (err) {
          return done(err)
        }

        expect(typeof response).to.be.equal('object')
        expect(response.status).to.be.equal(true)
        expect(typeof response.result).to.be.equal('object')
        expect(response.result.email).to.be.equal(payload.email)
        expect(typeof response.result.token).to.be.equal('string')

        setAuthorization(response.result.token)
        done(null)
      })
    } catch (err) {
      done(err)
    }
  })
})
