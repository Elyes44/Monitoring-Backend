const yup = require('yup')
module.exports = app => {
  const notification = require('../../controllers/user/notification.controller')
  const notificationmiddleware = require('../../middleware/user/notification.middleware')
  var router = require('express').Router()
  let jwt = require('../../middleware/user/jwtuser')

  // Retrieve all notifications from the database.
  router.get('/findall', jwt.checkToken, jwt.isAdmin, notification.findAll)

  //Retrieve lot of notifications from database based on parameters (filter paging)
  router.get(
    '/get',
    jwt.checkToken,
    jwt.isAdminAndResponsible,
    notification.findLots
  )
  // Find a single notification with an id
  router.get(
    '/get/:id',
    jwt.checkToken,
    jwt.isAdminAndResponsible,
    notificationmiddleware.find(),
    notification.findOne
  )

  //Retrieve lot of notifications today
  router.get(
    '/getinfo',
    jwt.checkToken,
    jwt.isAdminAndResponsible,
    notification.getinfonotifications
  )
  app.use('/api/notification', router)
}
