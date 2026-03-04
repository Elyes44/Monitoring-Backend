const DataTypes = require('sequelize')
module.exports = (sequelize, Sequelize) => {
  const Payoutchannel = sequelize.define('payoutchannel', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    money: {
      type: Sequelize.DOUBLE
    },
    currency: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter currency'
        }
      }
    },
    number: {
      type: Sequelize.INTEGER
    },
    alert: {
      type: Sequelize.INTEGER
    },
    createdAt: {
      type: Sequelize.DATE,
      default: Date.now
    },
    createdBy: {
      type: Sequelize.STRING
    },
    updatedAt: {
      type: Sequelize.DATE
    },
    updatedBy: {
      type: Sequelize.STRING
    }
  })
  return Payoutchannel
}
