module.exports = app => {
  const transaction = require('../../controllers/user/transaction.controller')
  let jwtuser = require('../../middleware/user/jwtuser')
  const transactionmiddleware = require('../../middleware/user/transaction.middleware')
  var router = require('express').Router()

  router.get(
    '/findall',
    jwtuser.checkToken,
    jwtuser.forAll,
    transaction.findAll
  )
  //Retrieve lot of transactions from database based on parameters (filter paging)
  router.get('/get', jwtuser.checkToken, jwtuser.forAll, transaction.findLots)
  //get number transactions in period
  router.get(
    '/getnbtransaction',
    jwtuser.checkToken,
    jwtuser.forAll,
    transaction.getnbtransaction
  )
  // Find a single transaction with an id
  router.get(
    '/get/:id',
    jwtuser.checkToken,
    jwtuser.forAll,
    transactionmiddleware.find,
    transaction.findOne
  )

  // Delete a transaction with the specified id in the request
  router.delete(
    '/delete/:id',
    jwtuser.checkToken,
    jwtuser.isAdmin,
    transactionmiddleware.find,
    transaction.delete
  )
  // Delete all transactions from the database.
  router.delete(
    '/deleteall',
    jwtuser.checkToken,
    jwtuser.isAdmin,
    transaction.deleteAll
  )
  app.use('/api/transaction', router)
}
