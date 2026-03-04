module.exports = app => {
  const cashbox = require('../../controllers/user/cashbox.controller')
  const cashboxmiddleware = require('../../middleware/user/cashbox.middleware')
  let jwt = require('../../middleware/user/jwtuser')
  var router = require('express').Router()

  // Retrieve all cashboxs from the database.
  router.get('/findall', jwt.checkToken, jwt.forAll, cashbox.findAll)
  //Retrieve lot of cashboxs from database based on parameters (filter paging)
  router.get('/get', jwt.checkToken, jwt.forAll, cashbox.findLots)
  // Find a single cashbox with an id
  router.get(
    '/get/:id',
    jwt.checkToken,
    jwt.forAll,
    cashboxmiddleware.find(),
    cashbox.findOne
  )
  router.get('/getfeeding', jwt.checkToken, jwt.forAll, cashbox.findfeeding)
  router.get('/getclose', jwt.checkToken, jwt.forAll, cashbox.findclose)
  router.get(
    '/getfeedingdetails/:id',
    jwt.checkToken,
    jwt.forAll,
    cashboxmiddleware.find(),
    cashbox.findfeedingdetails
  )
   // Retrieve all cashboxs from the database.
   router.get('/deleteall', jwt.checkToken, jwt.isAdmin, cashbox.deleteAll)
  app.use('/api/cashbox', router)
}
