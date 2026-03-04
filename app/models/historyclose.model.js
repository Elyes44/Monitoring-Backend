const DataTypes = require('sequelize')
module.exports = (sequelize, Sequelize) => {
  const Hitoryclose = sequelize.define('hitoryclose', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    stockserver: {
      type: Sequelize.DOUBLE
    },
    stockkiosk: {
      type: Sequelize.DOUBLE
    },
    stockphysique: {
      type: Sequelize.DOUBLE
    },
    cltype: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter stype'
        }
      }
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
  return Hitoryclose
}
