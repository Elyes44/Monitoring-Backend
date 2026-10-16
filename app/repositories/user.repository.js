const log4j = require('../config/configLog4js.js')
const db = require('../models')
const bcrypt = require('bcryptjs')
const Users = db.users
const sequelize = require('sequelize')
const Op = sequelize.Op

const getPagination = (page, size) => {
  const limit = size ? +size : 3
  const offset = page ? page * limit : 0
  return { limit, offset }
}
const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: users } = data
  const currentPage = page ? +page : 0
  const totalPages = Math.ceil(totalItems / limit)

  return { totalItems, users, totalPages, currentPage }
}
// Create and Save a new User
exports.create = async req => {
  try {
    const var_user = {
      /* firstname lastname email address username  telephone password enable: */
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      address: req.body.address,
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 8),
      telephone: req.body.telephone,
      enable: req.body.enable,
      roles: req.body.roles,
      createdBy: req.decoded.decoded.id
    }
    const data = await Users.create(var_user).catch(err => {
      log4j.loggerinfo.error(
        err.errors[0].message + ' ==> ' + err.errors[0].instance
      )
    })
    if (data) return data
    else return null
  } catch (error) {
    log4j.loggerinfo.error('2' + error.message)
    return null
  }
}

// Retrieve all Users from the database.
exports.findAll = async () => {
  const data = await Users.findAndCountAll({
    where: {},
    order: [['createdAt']]
  }).catch(err => {
    log4j.loggerinfo.error(err.message + ' ==> ' + err.parent.detail)

    return null
  })
  return data
}
// Retrieve all Users(id,firstname,lastname) from the database.
exports.findAllwithspecificattributes = async req => {
  const { enable, role } = req.query
  const conditionenable = enable ? { enable: `${enable}` } : null
  const conditionroles = role
    ? sequelize.literal("CAST(roles AS text) LIKE  '%" + role + "%'")
    : null
  console.log(JSON.stringify(conditionroles))
  const data = await Users.findAndCountAll({
    attributes: ['id', 'firstname', 'lastname'],
    where: { [Op.and]: [conditionenable, conditionroles] },
    order: [['createdAt']]
  }).catch(err => {
    log4j.loggerinfo.error(err.message + ' ==> ' + err.parent.detail)

    return null
  })
  return data
}
// Retrieve all with pagination and/or filtre Users from the database.
exports.findLots = async req => {
  const { page, size, enable } = req.query
  const conditionenable = enable ? { enable: `${enable}` } : null
  const { limit, offset } = getPagination(page, size)
  console.log('125-----' + JSON.stringify(conditionenable))
  const data = await Users.findAndCountAll({
    where: { [Op.and]: [conditionenable] },
    offset: offset,
    limit: limit,
    order: [['createdAt']]
  }).catch(err => {
    log4j.loggerinfo.error(err.message + ' ==> ' + err.parent.detail)

    return null
  })
  const response = getPagingData(data, page, limit)
  return response
}

// Find a single User with an id
exports.findOne = async id => {
  const data = await Users.findByPk(id).catch(err => {
    log4j.loggerinfo.error(err.message + ' ==> ' + err.parent.detail)

    return null
  })
  return data
}

// Update a User by the id in the request
exports.update = async (var_user, id, oldpassword) => {
  console.log(id)
  const data = await Users.findByPk(id).catch(err => {
    log4j.loggerinfo.error(err.message + ' ==> ' + err.parent.detail)

    return null
  })
  if (data && data !== undefined && data !== null) {
    var passwordIsValid = bcrypt.compareSync(oldpassword, data.password)
    if (passwordIsValid == true) {
      const num = await Users.update(var_user, {
        where: { id: id }
      }).catch(err => {
        log4j.loggerinfo.error(err.message + ' ==> ' + err.parent.detail)

        return 0
      })
      console.log(num)
      return num
    } else {
      return 0
    }
  } else {
    return 0
  }
}

// Delete a User with the specified id in the request
exports.delete = async req => {
  const id = req.params.id
  const num = await Users.destroy({
    where: { id: id }
  }).catch(err => {
    log4j.loggerinfo.error(err.message + ' ==> ' + err.parent.detail)

    return 0
  })
  return num
}

// Delete all Users from the database.
exports.deleteAll = async req => {
  const num = await Users.destroy({
    where: {},
    truncate: false
  }).catch(err => {
    log4j.loggerinfo.error(err.message + ' ==> ' + err.parent.detail)

    return null
  })
  return num
}

exports.countLots = async req => {
  const { enable } = req.query
  var conditionenable = enable ? { enable: `${enable}` } : null

  const data = await Users.count({
    where: { conditionenable }
  }).catch(err => {
    log4j.loggerinfo.error(err.message + ' ==> ' + err.parent.detail)

    return null
  })
  return data
}

exports.changerstatus = async req => {
  try {
    const var_user = {
      enable: req.body.enable,
      updatedBy: req.decoded.decoded.id,
      updatedAt: Date.now
    }
    const data = await Users.update(var_user, {
      where: { id: req.params.id }
    })

    return data
  } catch (error) {
    console.log(
      '-' + (error.message || 'Some error occurred while retrieving user.')
    )
    return error.message || 'Some error occurred while retrieving user.'
  }
}

exports.getnbuserenable = async () => {
  try {
    const data = await Users.count({
      where: { enable: 1 }
    }).catch(err => {
      console.log(err.message || 'Some error occurred while retrieving user.')
      return 0
    })
    if (data) {
      return data
    } else {
      return 0
    }
  } catch (error) {
    console.log(
      '-' + (error.message || 'Some error occurred while retrieving user.')
    )
    return 0
  }
}
exports.getnballusers = async () => {
  try {
    const data = await Users.count({}).catch(err => {
      console.log(err.message || 'Some error occurred while retrieving user.')
      return 0
    })
    if (data) {
      return data
    } else {
      return 0
    }
  } catch (error) {
    console.log(
      '-' + (error.message || 'Some error occurred while retrieving user.')
    )
    return 0
  }
}
