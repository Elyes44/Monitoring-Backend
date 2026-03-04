/* const { verifySignUp } = require("../middleware"); */
const controller = require('../../controllers/kiosk/authkiosk.controller')
module.exports = function (app) {
  let jwtkiosk = require('../../middleware/kiosk/jwtkiosk')
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    )
    next()
  })
  app.post('/api/kiosk/auth/signin', controller.signin)
  app.post('/api/user/auth/signout', jwtkiosk.checkToken, controller.signout)
}
