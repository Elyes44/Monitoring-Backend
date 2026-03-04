const transactionrepository = require('../../repositories/transaction.repository')
const kioskrepository = require('../../repositories/kiosk.repository')
const accessresponsible = require('../../service/accessresponsible')
const log4j = require('../../config/configLog4js.js')


// Retrieve all Transactions from the database.
exports.findAll = async (req, res) => {
  try {
     log4j.loggerinfo.info('Start find all Transactions')
    const trs = await transactionrepository.findAll()
    if (trs != null && trs != undefined) {
       log4j.loggerinfo.info('Successfully found all Transactions')
      return res.status(200).send({
        data: trs,
        code: 0
      })
    } else {
       log4j.loggerinfo.warn('Some error occurred while retrieving Transactions')
      return res.status(200).send({
        message: 'Some error occurred while retrieving Transactions',
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
exports.findLots = async (req, res) => {
  try {
     log4j.loggerinfo.info('Start find Lots Transactions')
    const trs = await transactionrepository.findLots(req)
    if (trs != null && trs != undefined) {
       log4j.loggerinfo.info('Successfully found Lots Transactions')
      return res.status(200).send({
        data: trs,
        code: 0
      })
    } else {
       log4j.loggerinfo.warn('Some error occurred while retrieving Lots Transactions')
      return res.status(200).send({
        message: 'Some error occurred while retrieving Lots Transactions',
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
exports.getnbtransaction = async (req, res) => {
  try {
    const period = req.query.period
    const kioskId = req.query.kioskid
     log4j.loggerinfo.info(
      'get number transactions with idksk=${ ' +
        req.decoded.decoded.id +
        ' } period=${ ' +
        period +
        ' }'
    )
    var nbtransaction = 0
    const date = new Date()
    var firstDay
    var lastDay
    const year = date.getFullYear()
    let month = date.getMonth() + 1

    switch (period) {
      case 'day':
        let day = date.getDate()
        day = day < 10 ? '0' + day : day
        month = month < 10 ? '0' + month : month
        firstDay = new Date(year, month - 1, day, 0, 0, 0, 0)
        lastDay = new Date(year, month - 1, day, 23, 59, 59, 999)
        nbtransaction = await transactionrepository.getnbtransaction(
          firstDay,
          lastDay,
          kioskId
        )
        break
      case 'month':
        let f = new Date(year, month - 1, 1).getDate()
        let l = new Date(year, month - 1, 0).getDate()

        f = f < 10 ? '0' + f : f
        l = l < 10 ? '0' + l : l
        month = month < 10 ? '0' + month : month
        firstDay = new Date(year, month - 1, f, 0, 0, 0, 0)
        lastDay = new Date(year, month - 1, l, 23, 59, 59, 999)
        nbtransaction = await transactionrepository.getnbtransaction(
          firstDay,
          lastDay,
          kioskId
        )
        break
      case 'year':
        firstDay = new Date(year, 0, 1, 0, 0, 0, 0)
        lastDay = new Date(year, 11, 31, 23, 59, 59, 999)
        nbtransaction = await transactionrepository.getnbtransaction(
          firstDay,
          lastDay,
          kioskId
        )
        break
      default:
        console.log('  default')
        nbtransaction = await transactionrepository.getnbtransaction(
          null,
          null,
          kioskId
        )
        break
    }
    if (nbtransaction == null || nbtransaction == undefined) {
      nbtransaction = 0
    }
    return res.status(200).send({
      nbtransaction: nbtransaction,
      code: 0
    })
  } catch (error) {
     log4j.loggerinfo.error(error.message)
    return res.status(200).send({
      message: error.message,
      code: -1
    })
  }
}
// Find a single Transaction with an id
exports.findOne = async (req, res) => {
  try {
     log4j.loggerinfo.info(
      'Start Find a single Transaction with id=${ ' + req.params.id + ' }'
    )
    const tr = await transactionrepository.findOne(req)
    if (tr != null && tr != undefined) {
       log4j.loggerinfo.info('Successfully found Transaction')
      return res.status(200).send({
        data: tr,
        code: 0
      })
    } else {
       log4j.loggerinfo.warn('Cannot find Transaction with id=${ ' + req.params.id + ' }')
      return res.status(200).send({
        message: 'Cannot find Transaction with id=${ ' + req.params.id + ' }',
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
// Update a Transaction by the id in the request
exports.update = async (req, res) => {
  try {
     log4j.loggerinfo.info('Start update a Transaction with id=${ ' + req.params.id + ' }')
    const num = await transactionrepository.update(req)
    if (num != null && num != undefined) {
      if (num == 1) {
         log4j.loggerinfo.info('${' + num + '} Transactions were updated successfully!')
        return res.status(200).send({
          data: '${' + num + '} Transactions were updated successfully!',
          code: 0
        })
      } else {
         log4j.loggerinfo.info(
          'Cannot update Transaction with id=${' +
            req.params.id +
            '}. Maybe Transaction was not found or req.body is empty!'
        )
        return res.status(200).send({
          data:
            'Cannot update Transaction with id=${' +
            req.params.id +
            '}. Maybe Transaction was not found or req.body is empty!',
          code: -3
        })
      }
    } else {
       log4j.loggerinfo.warn('Error updating Transaction')
      return res.status(200).send({
        message: 'Error updating Transaction',
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
// Delete all Transactions from the database.
exports.deleteAll = async (req, res) => {
  try {
     log4j.loggerinfo.info('Start delete all Transactions')
    const num = await transactionrepository.deleteAll(req)
    if (num != null && num != undefined) {
      if (num != 0) {
         log4j.loggerinfo.info('${' + num + '} Transactions were deleted successfully!')
        return res.status(200).send({
          data: '${' + num + '} Transactions were deleted successfully!',
          code: 0
        })
      } else {
         log4j.loggerinfo.info(
          'Cannot deleted any Transaction . Maybe the Transactions table is empty!'
        )
        return res.status(200).send({
          data:
            'Cannot deleted any Transaction . Maybe the Transactions table is empty!',
          code: -3
        })
      }
    } else {
       log4j.loggerinfo.warn('Error occurred while removing all Transactions')
      return res.status(200).send({
        message: 'Error occurred while removing all Transactions',
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
// Delete a Transaction with the specified id in the request
exports.delete = async (req, res) => {
  try {
     log4j.loggerinfo.info('Start delete a Transaction with id=${ ' + req.params.id + ' }')
    const num = await transactionrepository.delete(req)
    if (num != null && num != undefined) {
      if (num == 1) {
         log4j.loggerinfo.info('Kiosk was deleted successfully')
        return res.status(200).send({
          data: '${' + num + '} Transactions were deleted successfully!',
          code: 0
        })
      } else {
         log4j.loggerinfo.info(
          'Cannot delete Transaction with id=${' +
            req.params.id +
            '}. Maybe Transaction was not found !'
        )
        return res.status(200).send({
          data:
            'Cannot delete Transaction with id=${' +
            req.params.id +
            '}. Maybe Transaction was not found o!',
          code: -3
        })
      }
    } else {
       log4j.loggerinfo.warn('Error deleting Transaction')
      return res.status(200).send({
        message: 'Error deleting Transaction',
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
