const yup = require('yup')
module.exports = app => {
  const turnover = require('../../controllers/user/turnover.controller')
  const turnovermiddleware = require('../../middleware/user/turnover.middleware')
  var router = require('express').Router()
  let jwt = require('../../middleware/user/jwtuser')

  // Retrieve all turnovers from the database.
  router.get(
    '/findall',
    jwt.checkToken,
    jwt.isAdminAndFinancial,
    turnover.findAll
  )

  //Retrieve lot of turnovers from database based on parameters (filter paging)
  router.get('/get', jwt.checkToken, jwt.isAdminAndFinancial, turnover.findLots)
  // Find a single turnover with an id
  router.get(
    '/get/:id',
    jwt.checkToken,
    jwt.isAdminAndFinancial,
    turnovermiddleware.find(),
    turnover.findOne
  )
  // Find a single turnover with an id
  router.get(
    '/getturnover',
    jwt.checkToken,
    jwt.forAll,
    turnover.turnoverinperiod
  )
  app.use('/api/turnover', router)
}
