const yup = require('yup')
module.exports = app => {
  const panne = require('../../controllers/user/panne.controller')
  const pannemiddleware = require('../../middleware/user/panne.middleware')
  var router = require('express').Router()
  let jwt = require('../../middleware/user/jwtuser')

  // Retrieve all Pannes from the database.
  router.get('/findall', jwt.checkToken, jwt.isAdmin, panne.findAll)

  //Retrieve lot of Pannes from database based on parameters (filter paging)
  router.get('/get', jwt.checkToken, jwt.isAdminAndResponsible, panne.findLots)
  // Find a single panne with an id
  router.get(
    '/get/:id',
    jwt.checkToken,
    jwt.isAdmin,
    pannemiddleware.find(),
    panne.findOne
  )
  //Retrieve lot of notifications today
  router.get(
    '/getinfo',
    jwt.checkToken,
    jwt.isAdminAndResponsible,
    panne.getinfopannes
  )
  app.use('/api/panne', router)
}
