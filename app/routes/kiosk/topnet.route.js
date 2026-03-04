module.exports = app => {
  const topnet = require('../../controllers/kiosk/topnet.controller')
  let jwtkiosk = require('../../middleware/kiosk/jwtkiosk')
  const topnetmiddleware = require('../../middleware/kiosk/topnet.middleware')
  var router = require('express').Router()

  router.get(
    '/helloword',
    jwtkiosk.checkToken,
    jwtkiosk.isKiosk,
    topnet.helloworld
  )
  router.get(
    '/getfactures',
    jwtkiosk.checkToken,
    jwtkiosk.isKiosk,
    topnetmiddleware.getfactures(),
    topnet.getfactures
  )
  router.post(
    '/payment',
    jwtkiosk.checkToken,
    jwtkiosk.isKiosk,
    topnetmiddleware.payment(),
    topnet.payment
  )
  app.use('/api/topnet', router)
}
