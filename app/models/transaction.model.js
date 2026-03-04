const DataTypes = require('sequelize')
module.exports = (sequelize, Sequelize) => {
  const Transaction = sequelize.define('transaction', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    codeclient: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter codeclient'
        }
      }
    },
    codetransactionkiosk: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter codetransactionkiosk'
        }
      }
    },
    amount: {
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
    comment: {
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
  return Transaction
}
