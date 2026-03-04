module.exports = (sequelize, Sequelize) => {
  const Turnover = sequelize.define('turnover', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    value: {
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
  return Turnover
}
