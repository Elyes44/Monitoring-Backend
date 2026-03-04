module.exports = app => {
  const panne = require('../../controllers/kiosk/panne.controller')
  const panneuser= require("../../controllers/user/panne.controller")
  let jwtkiosk = require('../../middleware/kiosk/jwtkiosk')
  const pannemiddleware = require('../../middleware/kiosk/panne.middleware')
  var router = require('express').Router()

  router.get("/getall",
    jwtkiosk.checkToken,
    jwtkiosk.isKiosk,
    panneuser.findLots,
  )

  router.post(
    '/add',
    jwtkiosk.checkToken,
    jwtkiosk.isKiosk,
    pannemiddleware.create(),
    panne.create
  )
  router.put(
    '/correction/:id',
    jwtkiosk.checkToken,
    jwtkiosk.isKiosk,
    pannemiddleware.find(),
    panne.correction
    
  )
  app.use('/api/panne', router)
}
