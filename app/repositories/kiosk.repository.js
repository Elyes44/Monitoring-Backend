const db = require('../models')
const Kiosks = db.kiosks
const sequelize = require('sequelize')
const Op = sequelize.Op
const log4j = require('../config/configLog4js.js')
const bcrypt = require('bcryptjs')


const getPagination = (page, size) => {
  const limit = size ? +size : 3
  const offset = page ? page * limit : 0
  return { limit, offset }
}
const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: kiosks } = data
  const currentPage = page ? +page : 0
  const totalPages = Math.ceil(totalItems / limit)

  return { totalItems, kiosks, totalPages, currentPage }
}
// Create and Save a new kiosk
exports.create = async req => {
  const var_kiosk = {
    label: req.body.label,
    status: req.body.status,
    address: req.body.address,
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 8),
    position: req.body.position,
    userId: req.body.userid,
    enable: req.body.enable,
    createdBy: req.decoded.decoded.id
  }
  const data = await Kiosks.create(var_kiosk).catch(err => {
     log4j.loggerinfo.error(err.errors[0].message + ' ==> ' + err.errors[0].instance)
    return null
  })
  return data
}

// Retrieve all Kiosks from the database.
exports.findAll = async () => {
  const data = await Kiosks.findAndCountAll({
    where: {},
    order: [['createdAt']]
  }).catch(err => {
     log4j.loggerinfo.error(err.message)
    return null
  })
  return data
}
// Retrieve all Kiosks(id,label,adr) from the database.
exports.findAllwithspecificattributes = async req => {
  const { status, enable } = req.query
  var conditionstatus = status ? { status: { [Op.like]: `%${status}%` } } : null
  var conditionenable = enable ? { enable: `${enable}` } : null
  const data = await Kiosks.findAndCountAll({
    attributes: ['id', 'label', 'address'],
    where: { [Op.and]: [conditionstatus, conditionenable] },
    order: [['createdAt']]
  }).catch(err => {
     log4j.loggerinfo.error(err.message)
    return null
  })
  return data
}
// Retrieve all with pagination and/or filtre Kiosks from the database.
exports.findLots = async req => {
  const { page, size, status, enable } = req.query
  var conditionstatus = status ? { status: { [Op.like]: `%${status}%` } } : null
  var conditionenable = enable ? { enable: `${enable}` } : null
  const { limit, offset } = getPagination(page, size)

  const data = await Kiosks.findAndCountAll({
    where: { [Op.and]: [conditionstatus, conditionenable] },
    offset: offset,
    limit: limit,
    order: [['createdAt']]
  }).catch(err => {
     log4j.loggerinfo.error(err.message)
    return null
  })
  const response = getPagingData(data, page, limit)
  return response
}
// Retrieve  Kiosks by responsable from the database.
exports.findbyrsp = async idresponsible => {
  const data = await Kiosks.findAndCountAll({
    where: {
      userId: idresponsible
    },
    order: [['createdAt']]
  }).catch(err => {
     log4j.loggerinfo.error(err.message)
    return null
  })
  return data
}
// Find a single kiosk with an id
exports.findOne = async id => {
  const data = await Kiosks.findByPk(id).catch(err => {
     log4j.loggerinfo.error(err.message)
    return null
  })
  return data
}

// Update a kiosk by the id in the request
exports.update = async req => {
  const id = req.params.id
  const var_kiosk = {
    label: req.body.label,
    status: req.body.status,
    address: req.body.address,
    token: req.body.token,
    position: req.body.position,
    responsible: req.body.responsible,
    enable: req.body.enable,
    updatedBy: req.decoded.decoded.id,
    updatedAt: Date.now
  }
  const num = await Kiosks.update(var_kiosk, {
    where: { id: id }
  }).catch(err => {
     log4j.loggerinfo.error(err.message)
    return 0
  })
  return num
}

// Delete a kiosk with the specified id in the request
exports.delete = async req => {
  const id = req.params.id
  const num = await Kiosks.destroy({
    where: { id: id }
  }).catch(err => {
     log4j.loggerinfo.error(err.message)
    return 0
  })
  return num
}

// Delete all Kiosks from the database.
exports.deleteAll = async req => {
  const num = await Kiosks.destroy({
    where: {},
    truncate: false
  }).catch(err => {
     log4j.loggerinfo.error(err.message)
    return null
  })
  return num
}

exports.countLots = async req => {
  const { status, enable } = req.query
  var conditionstatus = status ? { status: { [Op.like]: `%${status}%` } } : null
  var conditionenable = enable ? { enable: `${enable}` } : null

  const data = await Kiosks.count({
    where: { [Op.and]: [conditionstatus, conditionenable] }
  }).catch(err => {
     log4j.loggerinfo.error(err.message)
    return null
  })
  return data
}
exports.changerpower = async req => {
  try {
    const var_kiosk = {
      enable: req.body.enable,
      updatedBy: req.decoded.decoded.id,
      updatedAt: Date.now
    }
    const data = await Kiosks.update(var_kiosk, {
      where: { id: req.params.id }
    })

    return data
  } catch (error) {
    console.log(
      '-' + (error.message || 'Some error occurred while retrieving kiosk.')
    )
    return error.message || 'Some error occurred while retrieving kiosk.'
  }
}
exports.updatestatus = async req => {
  try {
    const var_kiosk = {
      status: req.body.status,
      updatedBy: req.decoded.decoded.id,
      updatedAt: Date.now
    }
    const data = await Kiosks.update(var_kiosk, {
      where: { id: req.params.id }
    })

    return data
  } catch (error) {
    console.log(
      '-' + (error.message || 'Some error occurred while retrieving kiosk.')
    )
    return error.message || 'Some error occurred while retrieving kiosk.'
  }
}
exports.getnbkioskenable = async () => {
  try {
    const data = await Kiosks.count({
      where: { status: 'works' }
    }).catch(err => {
      console.log(err.message || 'Some error occurred while retrieving kiosk.')
      return 0
    })
    if (data) {
      return data
    } else {
      return 0
    }
  } catch (error) {
    console.log(
      '-' + (error.message || 'Some error occurred while retrieving kiosk.')
    )
    return 0
  }
}
exports.getnballkiosks = async () => {
  try {
    const data = await Kiosks.count({}).catch(err => {
      console.log(err.message || 'Some error occurred while retrieving kiosk.')
      return 0
    })
    if (data) {
      return data
    } else {
      return 0
    }
  } catch (error) {
    console.log(
      '-' + (error.message || 'Some error occurred while retrieving kiosk.')
    )
    return 0
  }
}
