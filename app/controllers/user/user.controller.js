const log4j = require('../../config/configLog4js.js')
const userrepository = require('../../repositories/user.repository')
const accessresponsible = require('../../service/accessresponsible')

// Create and Save a new User
exports.create = async (req, res) => {
  try {
    log4j.loggerinfo.info('create user')
    const usr = await userrepository.create(req)
    if (usr != null && usr != undefined) {
      log4j.loggerinfo.info('success create user')
      return res.status(201).send({
        data: usr,
        code: 0
      })
    } else {
      log4j.loggerinfo.warn('Some error occurred while creating the User')
      return res.status(200).send({
        message: 'Some error occurred while creating the User',
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

// Retrieve all Users from the database.
exports.findAll = async (req, res) => {
  try {
    log4j.loggerinfo.info('find all Users')
    const usrs = await userrepository.findAll()
    if (usrs != null && usrs != undefined) {
      log4j.loggerinfo.info('Successfully found all users')
      return res.status(200).send({
        data: usrs,
        code: 0
      })
    } else {
      log4j.loggerinfo.warn('Some error occurred while retrieving Users')
      return res.status(200).send({
        message: 'Some error occurred while retrieving Users',
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
// Retrieve all Users(id,firstname,lastname) from the database.
exports.findAllwithspecificattributes = async (req, res) => {
  try {
    const accss = await accessresponsible.accessresponsible(
      req.decoded.decoded.id,
      req.query.kioskid
    )

    if (accss == true) {
      const { enable } = req.query
      log4j.loggerinfo.info(
        'find All with specific attributes  Users  enable=' + enable
      )
      const usrs = await userrepository.findAllwithspecificattributes(req)
      if (usrs != null && usrs != undefined) {
        log4j.loggerinfo.info(
          'Successfully found All with specific attributes  users'
        )
        return res.status(200).send({
          data: usrs,
          code: 0
        })
      } else {
        log4j.loggerinfo.warn('Some error occurred while retrieving Users')
        return res.status(200).send({
          message: 'Some error occurred while retrieving Users',
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
exports.findLots = async (req, res) => {
  try {
    log4j.loggerinfo.info('find Lots Users')
    const usrs = await userrepository.findLots(req)
    if (usrs != null && usrs != undefined) {
      log4j.loggerinfo.info('Successfully found Lots users')
      return res.status(200).send({
        data: usrs,
        code: 0
      })
    } else {
      log4j.loggerinfo.warn('Some error occurred while retrieving Lots Users')
      return res.status(200).send({
        message: 'Some error occurred while retrieving Lots Users',
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
// Find a single User with an id
exports.findOne = async (req, res) => {
  try {
    log4j.loggerinfo.info(
      'Find a single User with id=${ ' + req.params.id + ' }'
    )

    const usr = await userrepository.findOne(req.params.id)
    if (usr != null && usr != undefined) {
      log4j.loggerinfo.info('Successfully found User')
      return res.status(200).send({
        data: usr,
        code: 0
      })
    } else {
      log4j.loggerinfo.warn(
        'Cannot find User with id=${ ' + req.params.id + ' }'
      )
      return res.status(200).send({
        message: 'Cannot find User with id=${ ' + req.params.id + ' }',
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
// Update a User by the id in the request
exports.update = async (req, res) => {
  try {
    log4j.loggerinfo.info('Update a User with id=${ ' + req.params.id + ' }')
    const num = await userrepository.update(req)
    if (num != null && num != undefined) {
      if (num == 1) {
        log4j.loggerinfo.info('${' + num + '} Users were updated successfully!')
        return res.status(200).send({
          data: '${' + num + '} Users were updated successfully!',
          code: 0
        })
      } else {
        log4j.loggerinfo.info(
          'Cannot update User with id=${' +
            req.params.id +
            '}. Maybe User was not found or req.body is empty!'
        )
        return res.status(200).send({
          data:
            'Cannot update User with id=${' +
            req.params.id +
            '}. Maybe User was not found or req.body is empty!',
          code: -3
        })
      }
    } else {
      log4j.loggerinfo.warn('Error updating User')
      return res.status(200).send({
        message: 'Error updating User',
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
// Delete all Users from the database.
exports.deleteAll = async (req, res) => {
  try {
    log4j.loggerinfo.info('Delete all Users')
    const num = await userrepository.deleteAll(req)
    if (num != null && num != undefined) {
      if (num != 0) {
        log4j.loggerinfo.info('${' + num + '} Users were deleted successfully!')
        return res.status(200).send({
          data: '${' + num + '} Users were deleted successfully!',
          code: 0
        })
      } else {
        log4j.loggerinfo.info(
          'Cannot deleted any User . Maybe the Users table is empty!'
        )
        return res.status(200).send({
          data: 'Cannot deleted any User . Maybe the Users table is empty!',
          code: -3
        })
      }
    } else {
      log4j.loggerinfo.warn('Error occurred while removing all Users')
      return res.status(200).send({
        message: 'Error occurred while removing all Users',
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
// Delete a User with the specified id in the request
exports.delete = async (req, res) => {
  try {
    log4j.loggerinfo.info('Delete a User with id=${ ' + req.params.id + ' }')
    const num = await userrepository.delete(req)
    if (num != null && num != undefined) {
      if (num == 1) {
        log4j.loggerinfo.info('User was deleted successfully')
        return res.status(200).send({
          data: '${' + num + '} Users were deleted successfully!',
          code: 0
        })
      } else {
        log4j.loggerinfo.info(
          'Cannot delete User with id=${' +
            req.params.id +
            '}. Maybe User was not found !'
        )
        return res.status(200).send({
          data:
            'Cannot delete User with id=${' +
            req.params.id +
            '}. Maybe User was not found o!',
          code: -3
        })
      }
    } else {
      log4j.loggerinfo.warn('Error deleting User')
      return res.status(200).send({
        message: 'Error deleting User',
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

exports.setstatus = async (req, res) => {
  try {
    var data = await userrepository.changerstatus(req)
    if (data) {
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
exports.getnbuser = async (req, res) => {
  try {
    var usr = await userrepository.getnbuserenable()
    var allusr = await userrepository.getnballusers()
    res.status(200).send({
      enable: usr + '',
      all: allusr + '',
      code: 0
    })
  } catch (error) {
    return res.status(200).send({
      message: error.message,
      code: -1
    })
  }
}

exports.updatepassword = async (req, res) => {
  try {
    log4j.loggerinfo.info('updatepassword')

    const var_user = {
      password: req.body.newpassword,
      updatedBy: req.decoded.decoded.id,
      updatedAt: Date.now
    }
    console.log(var_user)
    var num = await userrepository.update(
      var_user,
      req.decoded.decoded.id,
      req.body.oldpassword
    )
    if (num != null && num != undefined) {
      if (num != 0) {
        log4j.loggerinfo.info(
          '${' + num + '}  password was updated successfully!'
        )
        return res.status(200).send({
          data: '${' + num + '} password was updated successfully!',
          code: 0
        })
      } else {
        log4j.loggerinfo.info(
          'Password cannot be updated. Maybe the Users table is empty!'
        )
        return res.status(200).send({
          data: 'Password cannot be updated. Maybe the Users table is empty!',
          code: -4
        })
      }
    } else {
      log4j.loggerinfo.warn('An error occurred while updating the password')
      return res.status(200).send({
        message: 'An error occurred while updating the password',
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
