const payoutchannelrepository = require('../../repositories/payoutchannel.repository')
const cashboxrepository = require('../../repositories/cashbox.repository')
const accessresponsible = require('../../service/accessresponsible')
const log4j = require('../../config/configLog4js.js')

// Retrieve all Payouts from the database.
exports.findAll = async (req, res) => {
  try {
    log4j.loggerinfo.info('Start find all Payouts')
    log4j.loggerinfo.info('req.decoded.decoded.id=' + req.decoded.decoded.id)
    log4j.loggerinfo.info('req.query.kioskid=' + req.query.kioskid)
    console.log('req.decoded.decoded.id=' + req.decoded.decoded.id)
    console.log('req.query.kioskid=' + req.query.kioskid)
    const accss = await accessresponsible.accessresponsible(
      req.decoded.decoded.id,
      req.query.kioskid
    )

    if (accss == true) {
      const { cashboxid } = req.query
      const payout = await payoutchannelrepository.findAll(cashboxid)
      if (payout != null && payout != undefined) {
        log4j.loggerinfo.info('Successfully found all Payouts')
        return res.status(200).send({
          data: payout,
          code: 0
        })
      } else {
        log4j.loggerinfo.warn('Some error occurred while retrieving Payouts')
        return res.status(200).send({
          message: 'Some error occurred while retrieving Payouts',
          code: -3
        })
      }
    } else {
      log4j.loggerinfo.warn('This kiosk is not for this responsible!')
      return res.status(200).send({
        message: 'This kiosk is not for this responsible!',
        code: -2
      })
    }
  } catch (error) {
    log4j.loggerinfo.error(error.message)
    return res.status(200).send({
      message: error.message,
      code: -1
    })
  }
}

// delete all Payouts from the database.
exports.deleteAll = async (req, res) => {
  try {
    log4j.loggerinfo.info('Start delete all Payouts')

    const { cashboxid } = req.query
    const payout = await payoutchannelrepository.deleteAll(cashboxid)
    if (payout != null && payout != undefined) {
      log4j.loggerinfo.info('Successfully delete all Payouts')
      return res.status(200).send({
        data: payout,
        code: 0
      })
    } else {
      log4j.loggerinfo.warn('Some error occurred while retrieving Payouts')
      return res.status(200).send({
        message: 'Some error occurred while retrieving Payouts',
        code: -3
      })
    }
  } catch (error) {
    log4j.loggerinfo.error(error.message)
    return res.status(200).send({
      message: error.message,
      code: -1
    })
  }
}
