module.exports = app => {
  const kiosk = require('../../controllers/user/kiosk.controller')
  const kioskmiddleware = require('../../middleware/user/kiosk.middleware')
  var router = require('express').Router()
  let jwt = require('../../middleware/user/jwtuser')
  router.post(
    '/add',
    jwt.checkToken,
    jwt.isAdmin,
    kioskmiddleware.create(),
    kiosk.create
  )
  //get works kiosks numbers
  router.get(
    '/getnbkiosk',
    jwt.checkToken,
    jwt.isAdminAndFinancial,
    kiosk.getnbkiosk
  )
  // Retrieve all Kiosks from the database.
  router.get('/findall', jwt.checkToken, jwt.isAdminAndFinancial, kiosk.findAll)
  // Retrieve all Kiosks(id,label,adr) from the database.
  router.get(
    '/findallsmall',
    jwt.checkToken,
    jwt.isAdminAndFinancial,
    kiosk.findAllwithspecificattributes
  )
  //Retrieve lot of kiosks from database based on parameters (filter paging)
  router.get('/get', jwt.checkToken, jwt.isAdmin, kiosk.findLots)
  // Find a single Kiosk with an id
  router.get('/getbyresp', jwt.checkToken, jwt.isResponsible, kiosk.findbyrsp)
  // F
  // Find a single Kiosk with an id
  router.get(
    '/get/:id',
    jwt.checkToken,
    jwt.forAll,
    kioskmiddleware.find(),
    kiosk.findOne
  )
  // Update a Kiosk by the id in the request
  router.put(
    '/update/:id',
    jwt.checkToken,
    jwt.isAdmin,
    kioskmiddleware.find(),
    kioskmiddleware.create(),
    kiosk.update
  )
  router.patch(
    '/changerpower/:id',
    jwt.checkToken,
    jwt.isAdmin,
    kioskmiddleware.power(),
    kiosk.changerpower
  )
  // Delete a Kiosk with the specified id in the request
  router.delete(
    '/delete/:id',
    jwt.checkToken,
    jwt.isAdmin,
    kioskmiddleware.find(),
    kiosk.delete
  )
  // Delete all Kiosks from the database.
  router.delete('/deleteall', jwt.checkToken, jwt.isAdmin, kiosk.deleteAll)
  app.use('/api/kiosk', router)
}
