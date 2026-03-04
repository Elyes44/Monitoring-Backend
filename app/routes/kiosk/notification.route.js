module.exports = app => {
  const notification = require('../../controllers/kiosk/notification.controller')
  let jwtkiosk = require('../../middleware/kiosk/jwtkiosk')
  const notificationmiddleware = require('../../middleware/kiosk/notification.middleware')
  var router = require('express').Router()

  router.post(
    '/add',
    jwtkiosk.checkToken,
    jwtkiosk.isKiosk,
    notificationmiddleware.create(),
    notification.create
  )
  app.use('/api/notification', router)
}
