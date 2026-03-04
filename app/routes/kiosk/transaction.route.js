
module.exports = app => {
    const transactionController = require('../../controllers/kiosk/transaction.controller')
    let jwtkiosk = require('../../middleware/kiosk/jwtkiosk')
    const transactionMiddleware = require('../../middleware/kiosk/transaction.middleware')
    var router = require('express').Router()
  
router.post(
    '/payment',
    jwtkiosk.checkToken,
    jwtkiosk.isKiosk,
    transactionMiddleware.payment(),
    transactionController.payment
  )
  app.use('/api/kiosk', router)

}