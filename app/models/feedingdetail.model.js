const DataTypes = require('sequelize')
module.exports = (sequelize, Sequelize) => {
  const Feedingdetail = sequelize.define('feedingdetail', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    diffrencekiosk: {
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
  return Feedingdetail
}
