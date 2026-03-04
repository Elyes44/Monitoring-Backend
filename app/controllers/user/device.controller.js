const devicerepository = require('../../repositories/device.repository')
const kioskrepository = require('../../repositories/kiosk.repository')
const log4j = require('../../config/configLog4js.js')



// Create and Save a new Device
exports.create = async (req, res) => {
  try {
     log4j.loggerinfo.info('Start create Device')
    const ksk = await kioskrepository.findOne(req.body.kioskid)
    if (ksk != null && ksk != undefined) {
      const dv = await devicerepository.create(req)
      if (dv != null && dv != undefined) {
         log4j.loggerinfo.info('Success create device')
        return res.status(201).send({
          data: dv,
          code: 0
        })
      } else {
         log4j.loggerinfo.warn('Some error occurred while creating the Device')
        return res.status(200).send({
          message: 'Some error occurred while creating the Device',
          code: -3
        })
      }
    } else {
       log4j.loggerinfo.warn('Cannot find Kiosk with id=${ ' + req.body.kioskid + ' }')
      return res.status(200).send({
        message: 'Cannot find Kiosk with id=${ ' + req.body.kioskid + ' }',
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

// Retrieve all Devices from the database.
exports.findAll = async (req, res) => {
  try {
     log4j.loggerinfo.info('Start find all Devices')
    const dvs = await devicerepository.findAll()
    if (dvs != null && dvs != undefined) {
       log4j.loggerinfo.info('Successfully found all Devices')
      return res.status(200).send({
        data: dvs,
        code: 0
      })
    } else {
       log4j.loggerinfo.warn('Some error occurred while retrieving Devices')
      return res.status(200).send({
        message: 'Some error occurred while retrieving Devices',
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
     log4j.loggerinfo.info('Start find Lots Devices')
    const dvs = await devicerepository.findLots(req)
    if (dvs != null && dvs != undefined) {
       log4j.loggerinfo.info('Successfully found Lots Devices')
      return res.status(200).send({
        data: dvs,
        code: 0
      })
    } else {
       log4j.loggerinfo.warn('Some error occurred while retrieving Lots Devices')
      return res.status(200).send({
        message: 'Some error occurred while retrieving Lots Devices',
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
// Find a single Device with an id
exports.findOne = async (req, res) => {
  try {
     log4j.loggerinfo.info('Start Find a single Device with id=${ ' + req.params.id + ' }')
    const dv = await devicerepository.findOne(req.params.id)
    if (dv != null && dv != undefined) {
       log4j.loggerinfo.info('Successfully found Device')
      return res.status(200).send({
        data: dv,
        code: 0
      })
    } else {
       log4j.loggerinfo.warn('Cannot find Device with id=${ ' + req.params.id + ' }')
      return res.status(200).send({
        message: 'Cannot find Device with id=${ ' + req.params.id + ' }',
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
// Update a Device by the id in the request
exports.update = async (req, res) => {
  try {
     log4j.loggerinfo.info('Start update a Device with id=${ ' + req.params.id + ' }')
    const num = await devicerepository.update(req)
    if (num != null && num != undefined) {
      if (num == 1) {
         log4j.loggerinfo.info('${' + num + '} Devices were updated successfully!')
        return res.status(200).send({
          data: '${' + num + '} Devices were updated successfully!',
          code: 0
        })
      } else {
         log4j.loggerinfo.info(
          'Cannot update Device with id=${' +
            req.params.id +
            '}. Maybe Device was not found or req.body is empty!'
        )
        return res.status(200).send({
          data:
            'Cannot update Device with id=${' +
            req.params.id +
            '}. Maybe Device was not found or req.body is empty!',
          code: -3
        })
      }
    } else {
       log4j.loggerinfo.warn('Error updating Device')
      return res.status(200).send({
        message: 'Error updating Device',
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
// Delete all Devices from the database.
exports.deleteAll = async (req, res) => {
  try {
     log4j.loggerinfo.info('Start delete all Devices')
    const num = await devicerepository.deleteAll(req)
    if (num != null && num != undefined) {
      if (num != 0) {
         log4j.loggerinfo.info('${' + num + '} Devices were deleted successfully!')
        return res.status(200).send({
          data: '${' + num + '} Devices were deleted successfully!',
          code: 0
        })
      } else {
         log4j.loggerinfo.info(
          'Cannot deleted any Device . Maybe the Devices table is empty!'
        )
        return res.status(200).send({
          data: 'Cannot deleted any Device . Maybe the Devices table is empty!',
          code: -3
        })
      }
    } else {
       log4j.loggerinfo.warn('Error occurred while removing all Devices')
      return res.status(200).send({
        message: 'Error occurred while removing all Devices',
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
// Delete a Device with the specified id in the request
exports.delete = async (req, res) => {
  try {
     log4j.loggerinfo.info('Start delete a Device with id=${ ' + req.params.id + ' }')
    const num = await devicerepository.delete(req)
    if (num != null && num != undefined) {
      if (num == 1) {
         log4j.loggerinfo.info('Kiosk was deleted successfully')
        return res.status(200).send({
          data: '${' + num + '} Devices were deleted successfully!',
          code: 0
        })
      } else {
         log4j.loggerinfo.info(
          'Cannot delete Device with id=${' +
            req.params.id +
            '}. Maybe Device was not found !'
        )
        return res.status(200).send({
          data:
            'Cannot delete Device with id=${' +
            req.params.id +
            '}. Maybe Device was not found o!',
          code: -3
        })
      }
    } else {
       log4j.loggerinfo.warn('Error deleting Device')
      return res.status(200).send({
        message: 'Error deleting Device',
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
