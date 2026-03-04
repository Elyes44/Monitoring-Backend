const dbConfig = require('../config/db.config.js')
const Sequelize = require('sequelize')
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  // disable logging; default: console.log,
  query: { raw: true },
  logging: false,
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
})
const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize
db.users = require('./user.model')(sequelize, Sequelize)
db.kiosks = require('./kiosk.model')(sequelize, Sequelize)
db.devices = require('./device.model')(sequelize, Sequelize)
db.transactions = require('./transaction.model')(sequelize, Sequelize)
db.turnovers = require('./turnover.model')(sequelize, Sequelize)
db.cashboxs = require('./cashbox.model')(sequelize, Sequelize)
db.payoutchannels = require('./payoutchannel.model')(sequelize, Sequelize)
db.feedings = require('./feeding.model')(sequelize, Sequelize)
db.feedingdetails = require('./feedingdetail.model')(sequelize, Sequelize)
db.hitoryfeedings = require('./hitoryfeeding.model')(sequelize, Sequelize)
db.pannes = require('./panne.model')(sequelize, Sequelize)

db.hitorystocks = require('./hitorystock.model')(sequelize, Sequelize)
db.historyclose = require('./historyclose.model')(sequelize, Sequelize)

db.notifications = require('./notification.model')(sequelize, Sequelize)
db.kiosks.hasMany(db.devices, {
  as: 'devices'
})
db.kiosks.belongsTo(db.users, {
  foreignKey: {
    name: 'userId',
    allowNull: false,
    validate: {
      notNull: {
        msg: 'foreignKey userId is not null in kiosk'
      }
    }
  }
})
db.users.hasMany(db.kiosks, {
  as: 'kiosks'
})

db.transactions.belongsTo(db.kiosks, {
  foreignKey: {
    name: 'kioskId',
    allowNull: false,
    validate: {
      notNull: {
        msg: 'foreignKey kioskId is not null in transaction'
      }
    }
  }
})

db.kiosks.hasMany(db.transactions, {
  as: 'transactions'
})



db.turnovers.belongsTo(db.kiosks, {
  foreignKey: {
    name: 'kioskId',
    allowNull: false,
    validate: {
      notNull: {
        msg: 'foreignKey kioskId is not null in turnover'
      }
    }
  }
})
db.kiosks.hasMany(db.turnovers, {
  as: 'turnovers'
})

db.cashboxs.belongsTo(db.kiosks, {
  foreignKey: {
    name: 'kioskId',
    allowNull: false,
    validate: {
      notNull: {
        msg: 'foreignKey kioskId is not null in cashbox'
      }
    }
  }
})
db.kiosks.hasMany(db.cashboxs, {
  as: 'cashboxs'
})

db.payoutchannels.belongsTo(db.cashboxs, {
  foreignKey: {
    name: 'cashboxId',
    allowNull: false,
    validate: {
      notNull: {
        msg: 'foreignKey cashboxId is not null in payoutchannels'
      }
    }
  }
})
db.cashboxs.hasMany(db.payoutchannels, {
  as: 'payoutchannels'
})

db.feedings.belongsTo(db.kiosks, {
  foreignKey: {
    name: 'kioskId',
    allowNull: false,
    validate: {
      notNull: {
        msg: 'foreignKey kioskId is not null in cashbox'
      }
    }
  }
})
db.kiosks.hasMany(db.feedings, {
  as: 'fedding'
})

db.pannes.belongsTo(db.devices, {
  foreignKey: {
    name: 'deviceId',
    allowNull: false,
    validate: {
      notNull: {
        msg: 'foreignKey deviceId is not null in pannes'
      }
    }
  }
})
db.devices.hasMany(db.pannes, {
  as: 'pannes'
})
db.notifications.belongsTo(db.kiosks, {
  foreignKey: {
    name: 'kioskId',
    allowNull: false,
    validate: {
      notNull: {
        msg: 'foreignKey kioskId is not null in kiosks'
      }
    }
  }
})
db.kiosks.hasMany(db.notifications, {
  as: 'kiosks'
})
module.exports = db
