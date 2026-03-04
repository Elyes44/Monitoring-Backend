const db = require('../models')
const Hitorycloses = db.historyclose
const sequelize = require('sequelize')
const Op = sequelize.Op
const log4j = require('../config/configLog4js.js')


const getPagination = (page, size) => {
  const limit = size ? +size : 3
  const offset = page ? page * limit : 0
  return { limit, offset }
}
const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: hitoryclose } = data
  const currentPage = page ? +page : 0
  const totalPages = Math.ceil(totalItems / limit)

  return { totalItems, hitoryclose, totalPages, currentPage }
}
// Create and Save a new Hitoryclose
exports.create = async var_hitoryclose => {
  const data = await Hitorycloses.create(var_hitoryclose).catch(err => {
     log4j.loggerinfo.error(err.errors[0].message + ' ==> ' + err.errors[0].instance)
    return null
  })
  return data
}

// Retrieve all Hitoryclose from the database.
exports.findAll = async () => {
  const data = await Hitorycloses.findAndCountAll({
    where: {},
    order: [['createdAt']]
  }).catch(err => {
     log4j.loggerinfo.error(err.message + ' ==> ' + err.parent.detail)
    return null
  })
  return data
}

// Retrieve all with pagination and/or filtre Hitoryclose from the database.
exports.findLots = async req => {
  const {
    page,
    size,
    closeid,
    kioskid,
    type,
    status,
    startdate,
    enddate
  } = req.query
  var conditioncloseid = closeid ? { closeId: `${closeid}` } : null
  var conditioncreatedby = kioskid ? { createdBy: `${kioskid}` } : null
  var conditiontype = type ? { cltype: `${type}` } : null
  var conditionstatus = status ? { status: `${status}` } : null
  var conditionstartdate = startdate
    ? { createdAt: { [Op.gte]: `${startdate}` } }
    : null
  var conditionenddate = enddate
    ? { createdAt: { [Op.lte]: `${enddate}` } }
    : null
  const { limit, offset } = getPagination(page, size)

  const data = await Hitorycloses.findAndCountAll({
    where: {
      [Op.and]: [
        conditioncloseid,
        conditiontype,
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
     log4j.loggerinfo.error(err.message + ' ==> ' + err.parent.detail)
    return null
  })
  const response = getPagingData(data, page, limit)
  return response
}

// Find a single Hitoryclose with an id
exports.findOne = async id => {
  const data = await Hitorycloses.findByPk(id).catch(err => {
     log4j.loggerinfo.error(err.message + ' ==> ' + err.parent.detail)
    return null
  })
  return data
}

// Update a Hitoryclose by the id in the request
exports.update = async (var_hitoryclose, updatedbyid) => {
  const num = await Hitorycloses.update(var_hitoryclose, {
    where: { id: id }
  }).catch(err => {
     log4j.loggerinfo.error(err.message + ' ==> ' + err.parent.detail)
    return 0
  })
  return num
}

// Delete a Hitoryclose with the specified id in the request
exports.delete = async id => {
  const num = await Hitorycloses.destroy({
    where: { id: id }
  }).catch(err => {
     log4j.loggerinfo.error(err.message + ' ==> ' + err.parent.detail)
    return 0
  })
  return num
}

// Delete all Hitoryclose from the database.
exports.deleteAll = async () => {
  const num = await Hitorycloses.destroy({
    where: {},
    truncate: false
  }).catch(err => {
     log4j.loggerinfo.error(err.message + ' ==> ' + err.parent.detail)
    return null
  })
  return num
}
