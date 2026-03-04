const db = require('../models')
const Hitoryfeedings = db.hitoryfeedings
const Feedingdetails = db.feedingdetails
const sequelize = require('sequelize')
const Op = sequelize.Op
const log4j = require('../config/configLog4js.js')


const getPagination = (page, size) => {
  const limit = size ? +size : 3
  const offset = page ? page * limit : 0
  return { limit, offset }
}
const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: Hitoryfeeding } = data
  const currentPage = page ? +page : 0
  const totalPages = Math.ceil(totalItems / limit)

  return { totalItems, Hitoryfeeding, totalPages, currentPage }
}
// Create and Save a new Hitoryfeeding
exports.create = async var_hitoryfeeding => {
  const data = await Hitoryfeedings.create(var_hitoryfeeding).catch(err => {
     log4j.loggerinfo.error(err.errors[0].message + ' ==> ' + err.errors[0].instance)
    return null
  })
  return data
}

// Retrieve all Hitoryfeeding from the database.
exports.findAll = async () => {
  const data = await Hitoryfeedings.findAndCountAll({
    where: {},
    order: [['createdAt']]
  }).catch(err => {
     log4j.loggerinfo.error(err.message + ' ==> ' + err.parent.detail)
    return null
  })
  return data
}

// Retrieve all with pagination and/or filtre Hitoryfeeding from the database.
exports.findLots = async req => {
  const { page, size, feedingid } = req.query
  var conditionfeedingid = feedingid ? { feedingId: `${feedingid}` } : null
  const { limit, offset } = getPagination(page, size)

  const data = await Hitoryfeedings.findAndCountAll({
  
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

// Find a single Hitoryfeeding with an id
exports.findOne = async id => {
  const data = await Hitoryfeedings.findByPk(id).catch(err => {
     log4j.loggerinfo.error(err.message + ' ==> ' + err.parent.detail)
    return null
  })
  return data
}

// Update a Hitoryfeeding by the id in the request
exports.update = async (var_hitoryfeeding, updatedbyid) => {

  const num = await Hitoryfeedings.update(var_hitoryfeeding, {
    where: { id: id }
  }).catch(err => {
     log4j.loggerinfo.error(err.message + ' ==> ' + err.parent.detail)
    return 0
  })
  return num
}

// Delete a Hitoryfeeding with the specified id in the request
exports.delete = async id => {
  const num = await Hitoryfeedings.destroy({
    where: { id: id }
  }).catch(err => {
     log4j.loggerinfo.error(err.message + ' ==> ' + err.parent.detail)
    return 0
  })
  return num
}

// Delete all Hitoryfeeding from the database.
exports.deleteAll = async () => {
  const num = await Hitoryfeedings.destroy({
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
  const data = await Hitoryfeedings.findAndCountAll({
    where: { [Op.and]: [conditionfeedingid, conditionmoney] },
    order: [['createdAt']]
  }).catch(err => {
     log4j.loggerinfo.error(err.message + ' ==> ' + err.parent.detail)
    return null
  })
  return data
}
