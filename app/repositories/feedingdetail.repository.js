const db = require('../models')
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
  const { count: totalItems, rows: feedingdetail } = data
  const currentPage = page ? +page : 0
  const totalPages = Math.ceil(totalItems / limit)

  return { totalItems, feedingdetail, totalPages, currentPage }
}
// Create and Save a new feedingdetail
exports.create = async req => {
  const var_feedingdetail = {
    /*   diffrencekiosk diffrenceserver  money newnumber oldnumber feedingid*/
    diffrencekiosk: req.body.diffrencekiosk,
    diffrenceserver: req.body.diffrenceserver,
    money: req.body.money,
    newnumber: req.body.newnumber,
    oldnumber: req.body.oldnumber,
    feedingId: req.body.feedingid,
    createdBy: req.decoded.decoded.id
  }
  const data = await Feedingdetails.create(var_feedingdetail).catch(err => {
     log4j.loggerinfo.error(err.errors[0].message + ' ==> ' + err.errors[0].instance)
    return null
  })
  return data
}

// Retrieve all feedingdetail from the database.
exports.findAll = async () => {
  const data = await Feedingdetails.findAndCountAll({
    where: {},
    order: [['createdAt']]
  }).catch(err => {
     log4j.loggerinfo.error(err.message + ' ==> ' + err.parent.detail)
    return null
  })
  return data
}

// Retrieve all with pagination and/or filtre feedingdetail from the database.
exports.findLots = async req => {
  const { page, size, feedingid } = req.query
  var conditionfeedingid = feedingid ? { feedingId: `${feedingid}` } : null
  const { limit, offset } = getPagination(page, size)

  const data = await Feedingdetails.findAndCountAll({
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

// Find a single feedingdetail with an id
exports.findOne = async id => {
  const data = await Feedingdetails.findByPk(id).catch(err => {
     log4j.loggerinfo.error(err.message + ' ==> ' + err.parent.detail)
    return null
  })
  return data
}

// Update a feedingdetail by the id in the request
exports.update = async (var_feedingdetail, id) => {
  const num = await Feedingdetails.update(var_feedingdetail, {
    where: { id: id }
  }).catch(err => {
     log4j.loggerinfo.error(err.message + ' ==> ' + err.parent.detail)
    return 0
  })
  return num
}

// Delete a feedingdetail with the specified id in the request
exports.delete = async id => {
  const num = await Feedingdetails.destroy({
    where: { id: id }
  }).catch(err => {
     log4j.loggerinfo.error(err.message + ' ==> ' + err.parent.detail)
    return 0
  })
  return num
}

// Delete all feedingdetail from the database.
exports.deleteAll = async () => {
  const num = await Feedingdetails.destroy({
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
  const data = await Feedingdetails.findAndCountAll({
    where: { [Op.and]: [conditionfeedingid, conditionmoney] },
    order: [['createdAt']]
  }).catch(err => {
     log4j.loggerinfo.error(err.message + ' ==> ' + err.parent.detail)
    return null
  })
  return data
}
