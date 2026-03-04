const db = require('../models')
const Hitorystocks = db.hitorystocks
const sequelize = require('sequelize')
const Op = sequelize.Op
const log4j = require('../config/configLog4js.js')


const getPagination = (page, size) => {
  const limit = size ? +size : 3
  const offset = page ? page * limit : 0
  return { limit, offset }
}
const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: hitorystock } = data
  const currentPage = page ? +page : 0
  const totalPages = Math.ceil(totalItems / limit)

  return { totalItems, hitorystock, totalPages, currentPage }
}
// Create and Save a new hitorystock
exports.create = async var_hitorystock => {
  const data = await Hitorystocks.create(var_hitorystock).catch(err => {
     log4j.loggerinfo.error(err)
    return null
  })
  return data
}

// Retrieve all hitorystock from the database.
exports.findAll = async () => {
  const data = await Hitorystocks.findAndCountAll({
    where: {},
    order: [['createdAt']]
  }).catch(err => {
     log4j.loggerinfo.error(err.message + ' ==> ' + err.parent.detail)
    return null
  })
  return data
}

// Retrieve all with pagination and/or filtre hitorystock from the database.
exports.findLots = async req => {
  const { page, size, feedingid } = req.query
  var conditionfeedingid = feedingid ? { feedingId: `${feedingid}` } : null
  const { limit, offset } = getPagination(page, size)

  const data = await Hitorystocks.findAndCountAll({
    where: { [Op.and]: [conditionfeedingid] },
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

// Find a single hitorystock with an id
exports.findOne = async id => {
  const data = await Hitorystocks.findByPk(id).catch(err => {
     log4j.loggerinfo.error(err.message + ' ==> ' + err.parent.detail)
    return null
  })
  return data
}

// Update a hitorystock by the id in the request
exports.update = async (var_hitorystock, updatedbyid) => {
  const num = await Hitorystocks.update(var_hitorystock, {
    where: { id: id }
  }).catch(err => {
     log4j.loggerinfo.error(err.message + ' ==> ' + err.parent.detail)
    return 0
  })
  return num
}

// Delete a hitorystock with the specified id in the request
exports.delete = async id => {
  const num = await Hitorystocks.destroy({
    where: { id: id }
  }).catch(err => {
     log4j.loggerinfo.error(err.message + ' ==> ' + err.parent.detail)
    return 0
  })
  return num
}

// Delete all hitorystock from the database.
exports.deleteAll = async () => {
  const num = await Hitorystocks.destroy({
    where: {},
    truncate: false
  }).catch(err => {
     log4j.loggerinfo.error(err.message + ' ==> ' + err.parent.detail)
    return null
  })
  return num
}

// Retrieve all with pagination and/or filtre payoutchannel from the database.
exports.find = async (feedingid, money) => {
  var conditionfeedingid = feedingid ? { feedingId: `${feedingid}` } : null
  var conditionmoney = money ? { money: `${money}` } : null
  const data = await Hitorystocks.findAndCountAll({
    where: { [Op.and]: [conditionfeedingid, conditionmoney] },
    order: [['createdAt']]
  }).catch(err => {
     log4j.loggerinfo.error(err.message + ' ==> ' + err.parent.detail)
    return null
  })
  return data
}
