const request = require('supertest')
const express = require('express')

function createApp() {
  const app = express()

  const router = express.Router()
  router.route('/users').get(function(req, res) {
    const users = [{name: 'test1'}, {name: 'test2'}]
    return res.json(users)
  })

  app.use(router)

  return app
}

describe('Sample', function() {
  let app

  before(function(done) {
    app = createApp()
    app.listen(function(err) {
      if (err) { return done(err) }
      done()
    })
  })

  it('should return two users', function() {
    request(app)
      .get('/users')
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, function(err, res) {
        if (err) { return done(err) }
        expect(res.body.length).to.equal(2)
        done()
      })
  })
})
