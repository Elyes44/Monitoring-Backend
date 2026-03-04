const DataTypes = require('sequelize')
module.exports = (sequelize, Sequelize) => {
  const Feeding = sequelize.define('feeding', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    type: {
      type: Sequelize.STRING,
      in:["feeding","close"]
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
  return Feeding
}
