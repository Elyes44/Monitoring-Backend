const db = require('../models')
const Notifications = db.notifications
const sequelize = require('sequelize')
const Op = sequelize.Op
const log4j = require('../config/configLog4js.js')

const getPagination = (page, size) => {
  const limit = size ? +size : 3
  const offset = page ? page * limit : 0
  return { limit, offset }
}
const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: notifications } = data
  const currentPage = page ? +page : 0
  const totalPages = Math.ceil(totalItems / limit)

  return { totalItems, notifications, totalPages, currentPage }
}
// Create and Save a new panne
exports.create = async req => {
  const var_notifications = {
    title: req.body.title,
    description: req.body.description,
    details: req.body.details,
    ntype: req.body.ntype,
    kioskId: req.body.kioskid,
    enable: req.body.enable,
    createdBy: req.decoded.decoded.id
  }
  const data = await Notifications.create(var_notifications).catch(err => {
    log4j.loggerinfo.error(
      err.errors[0].message + ' ==> ' + err.errors[0].instance
    )
    return null
  })
  return data
}

// Retrieve all notifications from the database.
exports.findAll = async () => {
  const data = await Notifications.findAndCountAll({
    where: {},
    order: [['createdAt']]
  }).catch(err => {
    log4j.loggerinfo.error(err.message)
    return null
  })
  return data
}

// Retrieve all with pagination and/or filtre notifications from the database.
exports.findLots = async req => {
  const { page, size, type, startdate, enddate, kioskid } = req.query
  var conditiontype = type ? { ntype: { [Op.like]: `%${type}%` } } : null
  var conditionstartdate = startdate
    ? { createdAt: { [Op.gte]: `${startdate}` } }
    : null
  var conditionenddate = enddate
    ? { createdAt: { [Op.lte]: `${enddate}` } }
    : null
  var conditioncreatedby = kioskid ? { createdBy: `${kioskid}` } : null
  const { limit, offset } = getPagination(page, size)

  const data = await Notifications.findAndCountAll({
    where: {
      [Op.and]: [
        conditiontype,
        conditioncreatedby,
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

// Find a single notification with an id
exports.findOne = async id => {
  const data = await Notifications.findByPk(id).catch(err => {
    log4j.loggerinfo.error(err.message)
    return null
  })
  return data
}

// Update a notification by the id in the request
exports.update = async req => {
  const id = req.params.id
  const var_notifications = {
    title: req.body.title,
    description: req.body.description,
    details: req.body.details,
    ntype: req.body.ntype,
    kioskId: req.body.kioskid,
    enable: req.body.enable,
    updatedBy: req.decoded.decoded.id,
    updatedAt: Date.now
  }
  const num = await Notifications.update(var_notifications, {
    where: { id: id }
  }).catch(err => {
    log4j.loggerinfo.error(err.message)
    return 0
  })
  return num
}

// Delete a notification with the specified id in the request
exports.delete = async req => {
  const id = req.params.id
  const num = await Notifications.destroy({
    where: { id: id }
  }).catch(err => {
    log4j.loggerinfo.error(err.message)
    return 0
  })
  return num
}

// Delete all notifications from the database.
exports.deleteAll = async req => {
  const num = await Notifications.destroy({
    where: {},
    truncate: false
  }).catch(err => {
    log4j.loggerinfo.error(err.message)
    return null
  })
  return num
}

exports.countLots = async req => {
  const { startdate, enddate } = req.query
  var conditiontype = type ? { ntype: { [Op.like]: `%${type}%` } } : null
  var conditionstartdate = startdate
    ? { createdAt: { [Op.gte]: `${startdate}` } }
    : null
  var conditionenddate = enddate
    ? { createdAt: { [Op.lte]: `${enddate}` } }
    : null

  const { limit, offset } = getPagination(page, size)
  const data = await Notifications.count({
    where: { [Op.and]: [conditiontype, conditionstartdate, conditionenddate] }
  }).catch(err => {
    log4j.loggerinfo.error(err.message)
    return null
  })
  return data
}

exports.getinfonotifications = async req => {
  const { kioskid } = req.query
  var conditioncreatedby = kioskid ? { createdBy: `${kioskid}` } : null
  const TODAY_START = new Date().setHours(0, 0, 0, 0)
  const NOW = new Date()
  var conditiondate = {
    createdAt: {
      [Op.gt]: TODAY_START,
      [Op.lt]: NOW
    }
  }

  const data = await Notifications.findAndCountAll({
    where: { [Op.and]: [conditioncreatedby, conditiondate] },
    limit: 5,
    order: [['createdAt']]
  }).catch(err => {
    log4j.loggerinfo.error(err.message)
    return null
  })
  return data
}
