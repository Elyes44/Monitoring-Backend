const db = require('../models')
const Pannes = db.pannes
const sequelize = require('sequelize')
const Op = sequelize.Op
const log4j = require('../config/configLog4js.js')

const getPagination = (page, size) => {
  const limit = size ? +size : 3
  const offset = page ? page * limit : 0
  return { limit, offset }
}
const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: pannes } = data
  const currentPage = page ? +page : 0
  const totalPages = Math.ceil(totalItems / limit)

  return { totalItems, pannes, totalPages, currentPage }
}
// Create and Save a new panne
exports.create = async req => {
  const var_panne = {
    title: req.body.title,
    code: req.body.code,
    description: req.body.description,
    details: req.body.details,
    status: 'inprogress',
    deviceId: req.body.deviceid,
    createdBy: req.decoded.decoded.id
  }
  console.log(var_panne)
  const data = await Pannes.create(var_panne).catch(err => {
    console.log('\n***************************************\n')
    log4j.loggerinfo.error(err)
    console.log('\n***************************************\n')
    return null
  })
  return data
}

// Retrieve all pannes from the database.
exports.findAll = async () => {
  const data = await Pannes.findAndCountAll({
    where: {},
    order: [['createdAt']]
  }).catch(err => {
    log4j.loggerinfo.error(err.message)
    return null
  })
  return data
}

// Retrieve all with pagination and/or filtre pannes from the database.
exports.findLots = async req => {
  const { page, size, status, startdate, enddate, kioskid } = req.query
  var conditionstatus = status ? { status: { [Op.like]: `%${status}%` } } : null
  var conditionstartdate = startdate
    ? { createdAt: { [Op.gte]: `${startdate}` } }
    : null
  var conditionenddate = enddate
    ? { createdAt: { [Op.lte]: `${enddate}` } }
    : null

  var conditioncreatedby = kioskid ? { createdBy: `${kioskid}` } : null
  const { limit, offset } = getPagination(page, size)

  const data = await Pannes.findAndCountAll({
    where: {
      [Op.and]: [
        conditioncreatedby,
        conditionstatus,
        conditionstartdate,
        conditionenddate
      ]
    },
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

// Retrieve all with pagination and/or filtre pannes from the database.
exports.findby = async code => {
  var conditioncode = code ? { code: { [Op.like]: `%${code}%` } } : null

  const data = await Pannes.findAndCountAll({
    where: { [Op.and]: [conditioncode] },
    order: [['createdAt']]
  }).catch(err => {
    log4j.loggerinfo.error(err.message)
    return null
  })
  return data
}
// Find a single panne with an id
exports.findOne = async id => {
  const data = await Pannes.findByPk(id).catch(err => {
    log4j.loggerinfo.error(err.message)
    return null
  })
  return data
}

// Update a panne by the id in the request
exports.update = async (var_panne, id) => {
  /* const id = req.params.id
  const var_panne = {
    title: req.body.title,
    description: req.body.description,
    details: req.body.details,
    status: req.body.status,
    deviceId: req.body.deviceid,
    updatedBy: req.decoded.decoded.id,
    updatedAt: Date.now
  } */
  const num = await Pannes.update(var_panne, {
    where: { id: id }
  }).catch(err => {
    log4j.loggerinfo.error(err.message)
    return 0
  })
  return num
}

// Delete a panne with the specified id in the request
exports.delete = async req => {
  const id = req.params.id
  const num = await Pannes.destroy({
    where: { id: id }
  }).catch(err => {
    log4j.loggerinfo.error(err.message)
    return 0
  })
  return num
}

// Delete all pannes from the database.
exports.deleteAll = async req => {
  const num = await Pannes.destroy({
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

  const data = await Pannes.count({
    where: { [Op.and]: [conditionstatus] }
  }).catch(err => {
    log4j.loggerinfo.error(err.message)
    return null
  })
  return data
}

exports.getinfopannes = async req => {
  const { kioskid } = req.query
  var conditioncreatedby = kioskid ? { createdBy: `${kioskid}` } : null
  var conditionstatus = { status: { [Op.like]: `inprogress` } }
  const data = await Pannes.findAndCountAll({
    where: { [Op.and]: [conditioncreatedby, conditionstatus] },
    limit: 5,
    order: [['createdAt']]
  }).catch(err => {
    log4j.loggerinfo.error(err.message)
    return null
  })
  return data
}
