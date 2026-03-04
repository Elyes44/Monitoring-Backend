const cashboxrepository = require('../../repositories/cashbox.repository')
const feedingrepository = require('../../repositories/feeding.repository')
const closerepository = require('../../repositories/historyclose.repository')
const accessresponsible = require('../../service/accessresponsible')
const log4j = require('../../config/configLog4js.js')

exports.findLots = async (req, res) => {
  try {
    log4j.loggerinfo.info('Start find Lots Cashboxs')
    const accss = await accessresponsible.accessresponsible(
      req.decoded.decoded.id,
      req.query.kioskid
    )

    if (accss == true) {
      const cash = await cashboxrepository.findLots(req)
      if (cash != null && cash != undefined) {
        log4j.loggerinfo.info('Successfully found Lots Cashboxs')
        return res.status(200).send({
          data: cash,
          code: 0
        })
      } else {
        log4j.loggerinfo.warn(
          'Some error occurred while retrieving Lots Cashboxs'
        )
        return res.status(200).send({
          message: 'Some error occurred while retrieving Lots Cashboxs',
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

exports.findCash = async (req, res) => {
  try {
    log4j.loggerinfo.info('Start find Lots Cashboxs')

     const accss = true; 
     
    if (accss == true) {
      const cash = await cashboxrepository.findLots(req)
      if (cash != null && cash != undefined) {
        log4j.loggerinfo.info('Successfully found Lots Cashboxs')
        return res.status(200).send({
          data: cash,
          code: 0
        })
      } else {
        log4j.loggerinfo.warn(
          'Some error occurred while retrieving Lots Cashboxs'
        )
        return res.status(200).send({
          message: 'Some error occurred while retrieving Lots Cashboxs',
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

// Retrieve all Cashboxs from the database.
exports.findAll = async (req, res) => {
  try {
    log4j.loggerinfo.info('Start find all Cashboxs')
    const accss = await accessresponsible.accessresponsible(
      req.decoded.decoded.id,
      req.query.kioskid
    )

    if (accss == true) {
      const dvs = await cashboxrepository.findAll()
      if (dvs != null && dvs != undefined) {
        log4j.loggerinfo.info('Successfully found all Cashboxs')
        return res.status(200).send({
          data: {
            count: dvs.length,
            rows: dvs
          },
          code: 0
        })
      } else {
        log4j.loggerinfo.warn('Some error occurred while retrieving Cashboxs')
        return res.status(200).send({
          message: 'Some error occurred while retrieving Cashboxs',
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
// Find a single Cashbox with an id
exports.findOne = async (req, res) => {
  try {
    log4j.loggerinfo.info(
      'Start Find a single Cashbox with id=${ ' + req.params.id + ' }'
    )
    const dv = await cashboxrepository.findOne(req.params.id)
    if (dv != null && dv != undefined) {
      log4j.loggerinfo.info('Successfully found Cashbox')
      return res.status(200).send({
        data: dv,
        code: 0
      })
    } else {
      log4j.loggerinfo.warn(
        'Cannot find Cashbox with id=${ ' + req.params.id + ' }'
      )
      return res.status(200).send({
        message: 'Cannot find Cashbox with id=${ ' + req.params.id + ' }',
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

exports.findfeeding = async (req, res) => {
  try {
    log4j.loggerinfo.info('Start find Feeding')
    const accss = await accessresponsible.accessresponsible(
      req.decoded.decoded.id,
      req.query.kioskid
    )

    if (accss == true) {
      const feeding = await feedingrepository.findLots(req)
      if (feeding != null && feeding != undefined) {
        log4j.loggerinfo.info('Successfully found Feeding')
        return res.status(200).send({
          data: feeding,
          code: 0
        })
      } else {
        log4j.loggerinfo.warn('Some error occurred while retrieving Feeding')
        return res.status(200).send({
          message: 'Some error occurred while retrieving Feeding',
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
exports.findfeedingdetails = async (req, res) => {
  try {
    log4j.loggerinfo.info(
      'Start find detailsfeeding ********with idfeeding=${ ' +
        req.params.id +
        ' }'
    )
    const accss = await accessresponsible.accessresponsible(
      req.decoded.decoded.id,
      req.query.kioskid
    )
    log4j.loggerinfo.info('166 accss=' + accss)

    if (accss == true) {
      const hitoryfeeding = await feedingrepository.finddetailsfeeding(
        req.params.id
      )
      if (hitoryfeeding != null && hitoryfeeding != undefined) {
        log4j.loggerinfo.info('Successfully found detailsfeeding')
        return res.status(200).send({
          data: hitoryfeeding,
          code: 0
        })
      } else {
        log4j.loggerinfo.warn(
          'Some error occurred while retrieving detailsfeeding'
        )
        return res.status(200).send({
          message: 'Some error occurred while retrieving detailsfeeding',
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

exports.findclose = async (req, res) => {
  try {
    log4j.loggerinfo.info('Start find Close')
    const accss = await accessresponsible.accessresponsible(
      req.decoded.decoded.id,
      req.query.kioskid
    )

    if (accss == true) {
      const close = await closerepository.findLots(req)
      if (close != null && close != undefined) {
        log4j.loggerinfo.info('Successfully found Close')
        return res.status(200).send({
          data: close,
          code: 0
        })
      } else {
        log4j.loggerinfo.warn('Some error occurred while retrieving Close')
        return res.status(200).send({
          message: 'Some error occurred while retrieving Close',
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
// delete all Cashboxs from the database.
exports.deleteAll = async (req, res) => {
  try {
    log4j.loggerinfo.info('Start delete all Cashboxs')
    const { kioskid } = req.query
    const dvs = await cashboxrepository.deleteAll(kioskid)
    if (dvs != null && dvs != undefined) {
      log4j.loggerinfo.info('Successfully delete all Cashboxs')
      return res.status(200).send({
        data: dvs,
        code: 0
      })
    } else {
      log4j.loggerinfo.warn('Some error occurred while retrieving Cashboxs')
      return res.status(200).send({
        message: 'Some error occurred while retrieving Cashboxs',
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
