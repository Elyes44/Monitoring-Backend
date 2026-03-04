const pannerepository = require('../../repositories/panne.repository')
const devicerepository = require('../../repositories/device.repository')
const log4j = require('../../config/configLog4js.js')

// Retrieve all Pannes from the database.
exports.findAll = async (req, res) => {
  try {
    log4j.loggerinfo.info('find all Pannes')
    const nts = await pannerepository.findAll()
    if (nts != null && nts != undefined) {
      log4j.loggerinfo.info('Successfully found all Pannes')
      return res.status(200).send({
        data: nts,
        code: 0
      })
    } else {
      log4j.loggerinfo.warn('Some error occurred while retrieving Pannes')
      return res.status(200).send({
        message: 'Some error occurred while retrieving Pannes',
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
    log4j.loggerinfo.info('find Lots Pannes')
    const nts = await pannerepository.findLots(req)
    if (nts != null && nts != undefined) {
      log4j.loggerinfo.info('Successfully found Lots Pannes')
      return res.status(200).send({
        data: nts,
        code: 0
      })
    } else {
      log4j.loggerinfo.warn('Some error occurred while retrieving Lots Pannes')
      return res.status(200).send({
        message: 'Some error occurred while retrieving Lots Pannes',
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
// Find a single Kiosk with an id
exports.findOne = async (req, res) => {
  try {
    log4j.loggerinfo.info(
      'Find a single Kiosk with id=${ ' + req.params.id + ' }'
    )
    const nt = await pannerepository.findOne(req.params.id)
    if (nt != null && nt != undefined) {
      log4j.loggerinfo.info('Successfully found Kiosk')
      return res.status(200).send({
        data: nt,
        code: 0
      })
    } else {
      log4j.loggerinfo.warn(
        'Cannot find Kiosk with id=${ ' + req.params.id + ' }'
      )
      return res.status(200).send({
        message: 'Cannot find Kiosk with id=${ ' + req.params.id + ' }',
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

exports.getinfopannes = async (req, res) => {
  try {
    log4j.loggerinfo.info('Find info pannes')
    const nts = await pannerepository.getinfopannes(req)
    if (nts != null && nts != undefined) {
      log4j.loggerinfo.info('Successfully find info pannes')
      return res.status(200).send({
        data: nts,
        code: 0
      })
    } else {
      log4j.loggerinfo.warn('Some error occurred while retrieving Lots Pannes')
      return res.status(200).send({
        message: 'Some error occurred while retrieving Lots Pannes',
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
