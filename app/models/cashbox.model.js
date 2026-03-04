const DataTypes = require('sequelize')
module.exports = (sequelize, Sequelize) => {
  const Cashbox = sequelize.define('cashbox', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    stockh: {
      type: Sequelize.DOUBLE
    },
    stockm: {
      type: Sequelize.DOUBLE
    },
    stockn: {
      type: Sequelize.DOUBLE
    },
    createdAt: {
      type: Sequelize.DATE,
      default: Date.now
    },
    kioskId: {
      type: Sequelize.UUID
    },
    updatedAt: {
      type: Sequelize.DATE
    },
    updatedBy: {
      type: Sequelize.STRING
    }
  })
  return Cashbox
}
