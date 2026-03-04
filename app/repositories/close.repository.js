const db = require('../models')
const feeding = db.feedings
const close = db.close
const sequelize = require('sequelize')
const Op = sequelize.Op
const log4j = require('../config/configLog4js.js')

const getPagination = (page, size) => {
  const limit = size ? +size : 3
  const offset = page ? page * limit : 0
  return { limit, offset }
}
const getPagingData = (data, page, limit, count) => {
  const totalItems = count
  const feeding = data
  const currentPage = page ? +page : 0
  const totalPages = Math.ceil(totalItems / limit)

  return { totalItems, feeding, totalPages, currentPage }
}
// Create and Save a new feeding
exports.create = async var_feeding => {
  const data = await feeding.create(var_feeding).catch(err => {
    log4j.loggerinfo.error(
      err.errors[0].message + ' ==> ' + err.errors[0].instance
    )
    return null
  })
  return data
}

// Retrieve all feeding from the database.
exports.findAll = async () => {
  const data = await feeding.findAll({
    include: {
      model: payoutchannel,
      attributes: [sequelize.literal('SUM(money*number)')],
      group: 'cashboxId',
      as: 'payoutchannels'
    },
    raw: true,
    where: {},
    order: [['createdAt']],
    group: 'cashbox.id'
  }).catch(err => {
    log4j.loggerinfo.error(err)
    return null
  })

  return data
}

// Retrieve all with pagination and/or filtre feeding from the database.
exports.findLots = async req => {
  const { page, size, kioskid, type } = req.query
  var conditionkioskid = kioskid ? { kioskId: `${kioskid}` } : null
  const { limit, offset } = getPagination(page, size)

  const data = await feeding.findAll({
    include: {
      model: payoutchannel,
      attributes: [sequelize.literal('SUM(money*number)')],
      group: ['cashboxId', 'payoutchannel.id'],
      as: 'payoutchannels'
    },
    raw: true,
    where: { [Op.and]: [conditionkioskid] },
    order: [['createdAt']],
    group: ['cashbox.id']
  }).catch(err => {
    log4j.loggerinfo.error(err)
    return null
  })
  const cnt = await this.countAll(req)
  const response = getPagingData(data, page, limit, cnt)
  return response
}
// Retrieve all with pagination and/or filtre feeding from the database.
exports.countAll = async req => {
  try {
    const { page, size, kioskid, type } = req.query
    var conditionkioskid = kioskid ? { kioskId: `${kioskid}` } : null
    var conditiontype = type ? { ctype: `${type}` } : null
    const { limit, offset } = getPagination(page, size)

    const data = await feeding.count({
      include: {
        model: payoutchannel,
        attributes: [[sequelize.literal('SUM(money*number)'), 'amount']],
        group: 'cashboxId',
        as: 'payoutchannels'
      },
      raw: true,
      where: { [Op.and]: [conditionkioskid, conditiontype] },
      offset: offset,
      limit: limit,
      order: [['createdAt']],
      group: 'cashbox.id'
    }).catch(err => {
      log4j.loggerinfo.error(err)
      return null
    })
    return data[0].count
  } catch (error) {
    log4j.loggerinfo.error(error.message)
    return 0
  }
}

// Find a single feeding with an id
exports.findOne = async id => {
  const data = await feeding.findByPk(id).catch(err => {
    log4j.loggerinfo.error(err)
    return null
  })
  return data
}

// Find a single feeding with an id
exports.findByKiosk = async id => {
  const data = await feeding.findOne({where:{kioskId:id}}).catch(err => {
    log4j.loggerinfo.error(err)
    return null
  })
  return data

}

// Update a feeding by the id in the request
exports.update = async var_feeding => {
  const res = await feeding.update(var_feeding, {
    where: { id: var_feeding.id }
  }).catch(err => {
    log4j.loggerinfo.error(err)
    return 0
  })
  return res
}
// Update a feeding by the id in the request
exports.updatefield = async (var_cashbox, id) => {
  const num = await feeding.update(var_cashbox, {
    where: { id: id }
  }).catch(err => {
    log4j.loggerinfo.error(err)
    return 0
  })
  return num
}
// Delete a feeding with the specified id in the request
exports.delete = async req => {
  const id = req.params.id
  const num = await feeding.destroy({
    where: { id: id }
  }).catch(err => {
    log4j.loggerinfo.error(err)
    return 0
  })
  return num
}

// Delete all feeding from the database.
exports.deleteAll = async kioskid => {
  var conditionkioskid = kioskid ? { kioskId: `${kioskid}` } : null
  const num = await feeding.destroy({
    where: { [Op.and]: [conditionkioskid] },
    truncate: false
  }).catch(err => {
    log4j.loggerinfo.error(err)
    return null
  })
  return num
}

// Retrieve all with pagination and/or filtre feeding from the database.
exports.checkcashbox = async (kioskid, type) => {
  var conditionkioskid = kioskid ? { kioskId: `${kioskid}` } : null
  var conditiontype = type ? { ctype: `${type}` } : null

  const data = await feeding.count({
    where: { [Op.and]: [conditionkioskid, conditiontype] },
    order: [['createdAt']]
  }).catch(err => {
    log4j.loggerinfo.error(err)
    return null
  })
  console.log(data)
  return data
}
