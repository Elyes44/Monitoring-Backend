module.exports = app => {
  const device = require('../../controllers/user/device.controller')
  const devicemiddleware = require('../../middleware/user/device.middleware')
  let jwt = require('../../middleware/user/jwtuser')
  var router = require('express').Router()

  router.post(
    '/add',
    jwt.checkToken,
    jwt.isAdmin,
    devicemiddleware.create(),
    device.create
  )
  // Retrieve all devices from the database.
  router.get(
    '/findall',
    jwt.checkToken,
    jwt.isAdminAndResponsible,
    device.findAll
  )
  //Retrieve lot of devices from database based on parameters (filter paging)
  router.get('/get', jwt.checkToken, jwt.isAdminAndResponsible, device.findLots)
  // Find a single device with an id
  router.get(
    '/get/:id',
    jwt.checkToken,
    jwt.isAdminAndResponsible,
    devicemiddleware.find(),
    device.findOne
  )
  // Update a device by the id in the request
  router.put(
    '/update/:id',
    jwt.checkToken,
    jwt.isAdmin,
    devicemiddleware.find(),
    devicemiddleware.create(),
    device.update
  )
  // Delete a device with the specified id in the request
  router.delete(
    '/delete/:id',
    jwt.checkToken,
    jwt.isAdmin,
    devicemiddleware.find(),
    device.delete
  )
  // Delete all devices from the database.
  router.delete('/deleteall', jwt.checkToken, jwt.isAdmin, device.deleteAll)
  app.use('/api/device', router)
}
