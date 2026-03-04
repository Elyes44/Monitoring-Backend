const kioskrepository = require('../../repositories/kiosk.repository')
const userrepository = require('../../repositories/user.repository')
const accessresponsible = require('../../service/accessresponsible')
const log4j = require('../../config/configLog4js.js')

// Create and Save a new Kiosk
exports.create = async (req, res) => {
  try {
    log4j.loggerinfo.info('Start create Kiosk')
    const usr = await userrepository.findOne(req.body.userid)
    if (usr != null && usr != undefined) {
      let i = 0
      while (i < usr.roles.length && usr.roles[i] !== 'responsible') {
        i++
      }
      if (i < usr.roles.length) {
        const ksk = await kioskrepository.create(req)
        if (ksk != null && ksk != undefined) {
          log4j.loggerinfo.info('Success  create Kiosk')
          return res.status(201).send({
            data: ksk,
            code: 0
          })
        } else {
          log4j.loggerinfo.warn('Some error occurred while creating the Kiosk')
          return res.status(200).send({
            message: 'Some error occurred while creating the Kiosk',
            code: -3
          })
        }
      } else {
        log4j.loggerinfo.warn(
          'Cannot find Responsible with id=${ ' + req.body.userid + ' }'
        )
        return res.status(200).send({
          message:
            'Cannot find Responsible with id=${ ' + req.body.userid + ' }',
          code: -3
        })
      }
    } else {
      log4j.loggerinfo.warn(
        'Cannot find User with id=${ ' + req.body.userid + ' }'
      )
      return res.status(200).send({
        message: 'Cannot find User with id=${ ' + req.body.userid + ' }',
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

// Retrieve all Kiosks from the database.
exports.findAll = async (req, res) => {
  try {
    log4j.loggerinfo.info('find all Kiosks')
    const ksks = await kioskrepository.findAll()
    if (ksks != null && ksks != undefined) {
      log4j.loggerinfo.info('Successfully found all Kiosks')
      return res.status(200).send({
        data: ksks,
        code: 0
      })
    } else {
      log4j.loggerinfo.warn('Some error occurred while retrieving Kiosks')
      return res.status(200).send({
        message: 'Some error occurred while retrieving Kiosks',
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
// Retrieve all Kiosks(id,label,adr) from the database.
exports.findAllwithspecificattributes = async (req, res) => {
  try {
    const { status, enable } = req.query
    log4j.loggerinfo.info(
      'find All with specific attributes Kiosks status=' +
        status +
        '   enable=' +
        enable
    )
    const ksks = await kioskrepository.findAllwithspecificattributes(req)
    if (ksks != null && ksks != undefined) {
      log4j.loggerinfo.info(
        'Successfully found All with specific attributes Kiosks'
      )
      return res.status(200).send({
        data: ksks,
        code: 0
      })
    } else {
      log4j.loggerinfo.warn('Some error occurred while retrieving Kiosks')
      return res.status(200).send({
        message: 'Some error occurred while retrieving Kiosks',
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
    log4j.loggerinfo.info('find Lots Kiosks')
    const ksks = await kioskrepository.findLots(req)
    if (ksks != null && ksks != undefined) {
      log4j.loggerinfo.info('Successfully found Lots Kiosks')
      return res.status(200).send({
        data: ksks,
        code: 0
      })
    } else {
      log4j.loggerinfo.warn('Some error occurred while retrieving Lots Kiosks')
      return res.status(200).send({
        message: 'Some error occurred while retrieving Lots Kiosks',
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
    const accss = await accessresponsible.accessresponsible(
      req.decoded.decoded.id,
      req.params.id
    )

    if (accss == true) {
      const ksk = await kioskrepository.findOne(req.params.id)
      if (ksk != null && ksk != undefined) {
        log4j.loggerinfo.info('Successfully found Kiosk')
        return res.status(200).send({
          data: ksk,
          code: 0
        })
      } else {
        log4j.loggerinfo.warn(
          'Cannot find Kiosk with id=${ ' + req.params.id + ' }'
        )
        return res.status(200).send({
          message: 'Cannot find Kiosk with id=${ ' + req.params.id + ' }',
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
// Find a single Kiosk with an id
exports.findbyrsp = async (req, res) => {
  try {
    log4j.loggerinfo.info(
      'Find a single Kiosk with idresponsable=${ ' +
        req.decoded.decoded.id +
        ' }'
    )
    const ksk = await kioskrepository.findbyrsp(req.decoded.decoded.id)
    if (ksk != null && ksk != undefined) {
      log4j.loggerinfo.info('Successfully found Kiosk')
      if (ksk.count == 1) {
        return res.status(200).send({
          data: ksk.rows[0].id,
          code: 0
        })
      } else {
        log4j.loggerinfo.warn(
          ksk.count +
            ' kiosks were found with idresponsable=${ ' +
            req.decoded.decoded.id +
            ' }'
        )
        return res.status(200).send({
          message:
            ksk.count +
            ' kiosks were found with idresponsable=${ ' +
            req.decoded.decoded.id +
            ' }',
          code: -3
        })
      }
    } else {
      log4j.loggerinfo.warn(
        'Cannot find Kiosk with idresponsable=${ ' +
          req.decoded.decoded.id +
          ' }'
      )
      return res.status(200).send({
        message:
          'Cannot find Kiosk with idresponsable=${ ' +
          req.decoded.decoded.id +
          ' }',
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
// Update a Kiosk by the id in the request
exports.update = async (req, res) => {
  try {
    log4j.loggerinfo.info('Update a Kiosk with id=${ ' + req.params.id + ' }')
    const num = await kioskrepository.update(req)
    if (num != null && num != undefined) {
      if (num == 1) {
        log4j.loggerinfo.info(
          '${' + num + '} Kiosks were updated successfully!'
        )
        return res.status(200).send({
          data: '${' + num + '} Kiosks were updated successfully!',
          code: 0
        })
      } else {
        log4j.loggerinfo.info(
          'Cannot update Kiosk with id=${' +
            id +
            '}. Maybe Kiosk was not found or req.body is empty!'
        )
        return res.status(200).send({
          data:
            'Cannot update Kiosk with id=${' +
            id +
            '}. Maybe Kiosk was not found or req.body is empty!',
          code: -3
        })
      }
    } else {
      log4j.loggerinfo.warn('Error updating Kiosk')
      return res.status(200).send({
        message: 'Error updating Kiosk',
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
// Delete all Kiosks from the database.
exports.deleteAll = async (req, res) => {
  try {
    log4j.loggerinfo.info('Delete all Kiosks')
    const num = await kioskrepository.update(req)
    if (num != null && num != undefined) {
      if (num != 0) {
        log4j.loggerinfo.info(
          '${' + num + '} Kiosks were deleted successfully!'
        )
        return res.status(200).send({
          data: '${' + num + '} Kiosks were deleted successfully!',
          code: 0
        })
      } else {
        log4j.loggerinfo.info(
          'Cannot deleted any Kiosk . Maybe the Kiosks table is empty!'
        )
        return res.status(200).send({
          data: 'Cannot deleted any Kiosk . Maybe the Kiosks table is empty!',
          code: -3
        })
      }
    } else {
      log4j.loggerinfo.warn('Error occurred while removing all Kiosks')
      return res.status(200).send({
        message: 'Error occurred while removing all Kiosks',
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
// Delete a Kiosk with the specified id in the request
exports.delete = async (req, res) => {
  try {
    log4j.loggerinfo.info('Delete a Kiosk with id=${ ' + req.params.id + ' }')
    const num = await kioskrepository.delete(req)
    if (num != null && num != undefined) {
      if (num == 1) {
        log4j.loggerinfo.info(
          '${' + num + '} Kiosks were deleted successfully!'
        )
        return res.status(200).send({
          data: '${' + num + '} Kiosks were deleted successfully!',
          code: 0
        })
      } else {
        log4j.loggerinfo.info(
          'Cannot delete Kiosk with id=${' +
            id +
            '}. Maybe Kiosk was not found !'
        )
        return res.status(200).send({
          data:
            'Cannot delete Kiosk with id=${' +
            id +
            '}. Maybe Kiosk was not found o!',
          code: -3
        })
      }
    } else {
      log4j.loggerinfo.warn('Error deleting Kiosk')
      return res.status(200).send({
        message: 'Error deleting Kiosk',
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

exports.changerpower = async (req, res) => {
  try {
    log4j.loggerinfo.info('changer power  kioskid={' + req.params.id + '}')
    const id = req.params.id
    var data = await kioskrepository.changerpower(req)
    log4j.loggerinfo.info(data)
    if (data == 1) {
      log4j.loggerinfo.info('${' + data + '} Kiosks were updated successfully!')
      return res.status(200).send({
        message: data,
        code: 0
      })
    } else {
      return res.status(200).send({
        message: data,
        code: -2
      })
    }
  } catch (error) {
    return res.status(200).send({
      message: error.message,
      code: -1
    })
  }
}
exports.getnbkiosk = async (req, res) => {
  try {
    var ksk = await kioskrepository.getnbkioskenable()
    var allksk = await kioskrepository.getnballkiosks()
    res.status(200).send({
      works: ksk + '',
      all: allksk + '',
      code: 0
    })
  } catch (error) {
    return res.status(200).send({
      message: error.message,
      code: -1
    })
  }
}
