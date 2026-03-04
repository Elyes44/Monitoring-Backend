module.exports = app => {
  const cashbox = require('../../controllers/kiosk/cashbox.controller')
  let jwtkiosk = require('../../middleware/kiosk/jwtkiosk')
  const cashboxmiddleware = require('../../middleware/kiosk/cashbox.middleware')
  const feedingmiddleware = require('../../middleware/kiosk/feeding.middleware')
  const feedingdetailmiddleware = require('../../middleware/kiosk/feedingdetail.middleware')
  const hitorystockmiddleware = require('../../middleware/kiosk/hitorystock.middleware')
  const closemiddleware = require('../../middleware/kiosk/close.middleware')
  const cashboxm = require('../../controllers/user/cashbox.controller')
  var router = require('express').Router()

  router.post(
    '/add',
    jwtkiosk.checkToken,
    jwtkiosk.isKiosk,
    cashboxmiddleware.create(),
    cashbox.create
  )
  
  router.get(
   '/getcashboxid',
   jwtkiosk.checkToken,
   jwtkiosk.isKiosk,
   cashboxm.findCash,
   
  )

  router.post(
    '/feeding',
    jwtkiosk.checkToken,
    jwtkiosk.isKiosk,
    feedingmiddleware.create(),
    cashbox.feeding
  )
  
  router.post(
    '/feedingdetail',
    jwtkiosk.checkToken,
    jwtkiosk.isKiosk,
    feedingdetailmiddleware.create(),
    cashbox.feedingdetails
  )

  router.post(
    '/stock',
    jwtkiosk.checkToken,
    jwtkiosk.isKiosk,
    hitorystockmiddleware.create(),
    cashbox.stock
  )
  router.post(
    '/close',
    jwtkiosk.checkToken,
    jwtkiosk.isKiosk,
    closemiddleware.create(),
    cashbox.close
  )
  app.use('/api/cashbox', router)
}
