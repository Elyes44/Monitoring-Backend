/* const { verifySignUp } = require("../middleware"); */
const controller = require('../../controllers/user/authuser.controller')
module.exports = function (app) {
  let jwt = require('../../middleware/user/jwtuser')
  var router = require('express').Router()
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    )
    next()
  })
  app.post('/api/user/auth/signin', controller.signin)
  app.post(
    '/api/user/auth/signout',
    jwt.checkToken,
    jwt.forAll,
    controller.signout
  )
}
