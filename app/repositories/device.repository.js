const db = require('../models')
const Devices = db.devices
const sequelize = require('sequelize')
const Op = sequelize.Op
const log4j = require('../config/configLog4js.js')


const getPagination = (page, size) => {
  const limit = size ? +size : 3
  const offset = page ? page * limit : 0
  return { limit, offset }
}
const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: devices } = data
  const currentPage = page ? +page : 0
  const totalPages = Math.ceil(totalItems / limit)

  return { totalItems, devices, totalPages, currentPage }
}
// Create and Save a new Device
exports.create = async req => {
  const var_device = {
    /*  reference status */
    reference: req.body.reference,
    dtype: req.body.dtype,
    name: req.body.name,
    status: req.body.status,
    kioskId: req.body.kioskid,
    createdBy: req.decoded.decoded.id
  }
  const data = await Devices.create(var_device).catch(err => {
     log4j.loggerinfo.error(err.errors[0].message + ' ==> ' + err.errors[0].instance)
    return null
  })
  return data
}

// Retrieve all Devices from the database.
exports.findAll = async () => {
  const data = await Devices.findAndCountAll({
    where: {},
    order: [['createdAt']]
  }).catch(err => {
     log4j.loggerinfo.error(err.message + ' ==> ' + err.parent.detail)
    return null
  })
  return data
}

// Retrieve all with pagination and/or filtre Devices from the database.
exports.findLots = async req => {
  const { page, size, status, kioskid } = req.query
  var conditionstatus = status ? { status: `${status}` } : null
  var conditionkioskid = kioskid ? { kioskId: `${kioskid}` } : null
  const { limit, offset } = getPagination(page, size)

  const data = await Devices.findAndCountAll({
    where: { [Op.and]: [conditionstatus, conditionkioskid] },
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

// Find a single Device with an id
exports.findOne = async id => {
  const data = await Devices.findByPk(id).catch(err => {
     log4j.loggerinfo.error(err.message + ' ==> ' + err.parent.detail)
    return null
  })
  return data
}

// Update a Device by the id in the request
exports.update = async req => {
  const id = req.params.id
  const var_device = {
    reference: req.body.reference,
    status: req.body.status,
    updatedBy: req.decoded.decoded.id,
    updatedAt: Date.now
  }
  const num = await Devices.update(var_device, {
    where: { id: id }
  }).catch(err => {
     log4j.loggerinfo.error(err.message + ' ==> ' + err.parent.detail)
    return 0
  })
  return num
}

// Delete a Device with the specified id in the request
exports.delete = async req => {
  const id = req.params.id
  const num = await Devices.destroy({
    where: { id: id }
  }).catch(err => {
     log4j.loggerinfo.error(err.message + ' ==> ' + err.parent.detail)
    return 0
  })
  return num
}

// Delete all Devices from the database.
exports.deleteAll = async req => {
  const num = await Devices.destroy({
    where: {},
    truncate: false
  }).catch(err => {
     log4j.loggerinfo.error(err.message + ' ==> ' + err.parent.detail)
    return null
  })
  return num
}

exports.countLots = async req => {
  const { status } = req.query
  var conditionstatus = status ? { status: `${status}` } : null

  const data = await Devices.count({
    where: { conditionstatus }
  }).catch(err => {
     log4j.loggerinfo.error(err.message + ' ==> ' + err.parent.detail)
    return null
  })
  return data
}
