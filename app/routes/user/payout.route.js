module.exports = app => {
  const payout = require('../../controllers/user/payout.controller')
  let jwt = require('../../middleware/user/jwtuser')
  var router = require('express').Router()

  // Retrieve all cashboxs from the database.
  router.get('/findall', jwt.checkToken, jwt.forAll, payout.findAll)
  // Retrieve all cashboxs from the database.
  router.get('/deleteall', jwt.checkToken, jwt.isAdmin, payout.deleteAll)
  app.use('/api/payout', router)
}
