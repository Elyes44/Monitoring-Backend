const DataTypes = require('sequelize')
module.exports = (sequelize, Sequelize) => {
  const Hitoryfeeding = sequelize.define('hitoryfeeding', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    diffrenceserver: {
      type: Sequelize.DOUBLE
    },
    money: {
      type: Sequelize.DOUBLE
    },
    newnumber: {
      type: Sequelize.DOUBLE
    },
    oldnumber: {
      type: Sequelize.DOUBLE
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Please enter status'
          }
        }
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
  return Hitoryfeeding
}
