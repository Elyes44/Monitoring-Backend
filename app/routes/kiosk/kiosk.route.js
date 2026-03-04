module.exports = app => {
  const kiosk = require('../../controllers/kiosk/kiosk.controller')
  let jwtkiosk = require('../../middleware/kiosk/jwtkiosk')
  const kioskmiddleware = require('../../middleware/kiosk/kiosk.middleware')
  var router = require('express').Router()

  router.get('/init', jwtkiosk.checkToken, jwtkiosk.isKiosk, kiosk.init)
  router.patch(
    '/updatestatus/:id',
    jwtkiosk.checkToken,
    jwtkiosk.isKiosk,
    kioskmiddleware.status(),
    kiosk.updatestatus
  )
  app.use('/api/kiosk', router)
}
