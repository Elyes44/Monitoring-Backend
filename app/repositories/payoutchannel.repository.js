const db = require('../models')
const Payoutchannels = db.payoutchannels
const sequelize = require('sequelize')
const Op = sequelize.Op
const log4j = require('../config/configLog4js.js')

const getPagination = (page, size) => {
  const limit = size ? +size : 3
  const offset = page ? page * limit : 0
  return { limit, offset }
}
const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: payoutchannel } = data
  const currentPage = page ? +page : 0
  const totalPages = Math.ceil(totalItems / limit)

  return { totalItems, payoutchannel, totalPages, currentPage }
}
// Create and Save a new payoutchannel
exports.create = async var_payoutchannel => {
  const data = await Payoutchannels.create(var_payoutchannel).catch(err => {
    log4j.loggerinfo.error(
      err.errors[0].message + ' ==> ' + err.errors[0].instance
    )
    return null
  })
  return data
}

// Retrieve all payoutchannel from the database.
exports.findAll = async cashboxid => {
  var conditioncashboxid = cashboxid ? { cashboxId: `${cashboxid}` } : null
  const data = await Payoutchannels.findAndCountAll({
    where: { [Op.and]: [conditioncashboxid] },
    order: [['createdAt']]
  }).catch(err => {
    log4j.loggerinfo.error(err.errors[0])
    return null
  })
  return data
}

// Retrieve all with pagination and/or filtre payoutchannel from the database.
exports.findLots = async req => {
  const { page, size, cashboxid } = req.query
  var conditioncashboxid = cashboxid ? { cashboxId: `${cashboxid}` } : null
  const { limit, offset } = getPagination(page, size)
  const data = await Payoutchannels.findAndCountAll({
    where: { [Op.and]: [conditioncashboxid] },
    offset: offset,
    limit: limit,
    order: [['createdAt']]
  }).catch(err => {
    log4j.loggerinfo.error(err)
    return null
  })
  const response = getPagingData(data, page, limit)
  return response
}

// Find a single payoutchannel with an id
exports.findOne = async id => {
  const data = await Payoutchannels.findByPk(id).catch(err => {
    log4j.loggerinfo.error(err)
    return null
  })
  return data
}

// Update a payoutchannel by the id in the request
exports.update = async (paychennel, updatedbyid) => {
  const var_payoutchannel = {
    /*   diffrencekiosk diffrenceserver  money newnumber oldnumber feedingid*/
    money: paychennel.money,
    currency: paychennel.currency,
    number: paychennel.number,
    alert: paychennel.alert,
    cashboxId: paychennel.cashboxid,
    updatedBy: updatedbyid,
    updatedAt: Date.now
  }
  const num = await Payoutchannels.update(var_payoutchannel, {
    where: { id: id }
  }).catch(err => {
    log4j.loggerinfo.error(err)
    return 0
  })
  return num
}

// Delete a payoutchannel with the specified id in the request
exports.delete = async id => {
  const num = await Payoutchannels.destroy({
    where: { id: id }
  }).catch(err => {
    log4j.loggerinfo.error(err)
    return 0
  })
  return num
}

// Delete all payoutchannel from the database.
exports.deleteAll = async cashboxid => {
  var conditioncashboxid = cashboxid ? { cashboxId: `${cashboxid}` } : null
  const num = await Payoutchannels.destroy({
    where: { [Op.and]: [conditioncashboxid] },
    truncate: false
  }).catch(err => {
    log4j.loggerinfo.error(err)
    return null
  })
  return num
}

// Retrieve all with pagination and/or filtre payoutchannel from the database.
exports.find = async (cashboxid, money) => {
  var conditioncashboxid = cashboxid ? { cashboxId: `${cashboxid}` } : null
  var conditionmoney = money ? { money: `${money}` } : null
  const data = await Payoutchannels.findAndCountAll({
    where: { [Op.and]: [conditioncashboxid, conditionmoney] },
    order: [['createdAt']]
  }).catch(err => {
    log4j.loggerinfo.error(err)
    return null
  })
  return data
}
// Update a payoutchannel by the id in the request
exports.updatenumber = async (number, id, updatedbyid) => {
  const var_payoutchannel = {
    number: number,
    updatedBy: updatedbyid,
    updatedAt: Date.now
  }
  const num = await Payoutchannels.update(var_payoutchannel, {
    where: { id: id }
  }).catch(err => {
    log4j.loggerinfo.error(err)
    return 0
  })
  return num
}
