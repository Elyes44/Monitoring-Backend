const notificationrepository = require('../../repositories/notification.repository')
const log4j = require('../../config/configLog4js.js')


// Retrieve all Notifications from the database.
exports.findAll = async (req, res) => {
  try {
     log4j.loggerinfo.info('find all Notifications')
    const nts = await notificationrepository.findAll()
    if (nts != null && nts != undefined) {
       log4j.loggerinfo.info('Successfully found all Notifications')
      return res.status(200).send({
        data: nts,
        code: 0
      })
    } else {
       log4j.loggerinfo.warn('Some error occurred while retrieving Notifications')
      return res.status(200).send({
        message: 'Some error occurred while retrieving Notifications',
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
     log4j.loggerinfo.info('find Lots Notifications')
    const nts = await notificationrepository.findLots(req)
    if (nts != null && nts != undefined) {
       log4j.loggerinfo.info('Successfully found Lots Notifications')
      return res.status(200).send({
        data: nts,
        code: 0
      })
    } else {
       log4j.loggerinfo.warn('Some error occurred while retrieving Lots Notifications')
      return res.status(200).send({
        message: 'Some error occurred while retrieving Lots Notifications',
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
     log4j.loggerinfo.info('Find a single Kiosk with id=${ ' + req.params.id + ' }')
    const nt = await notificationrepository.findOne(req.params.id)
    if (nt != null && nt != undefined) {
       log4j.loggerinfo.info('Successfully found Kiosk')
      return res.status(200).send({
        data: nt,
        code: 0
      })
    } else {
       log4j.loggerinfo.warn('Cannot find Kiosk with id=${ ' + req.params.id + ' }')
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
exports.getinfonotifications = async (req, res) => {
  try {
     log4j.loggerinfo.info('Find info notifications')
    const nts = await notificationrepository.getinfonotifications(req)
    if (nts != null && nts != undefined) {
       log4j.loggerinfo.info('Successfully find info notifications')
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