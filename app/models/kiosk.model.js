const DataTypes = require('sequelize')
module.exports = (sequelize, Sequelize) => {
  const Kiosk = sequelize.define('kiosk', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    label: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter label'
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
    address: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter address'
        }
      }
    },
    username: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter username'
        }
      }
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter password'
        }
      }
    },
    position: {
      type: DataTypes.ARRAY(DataTypes.FLOAT),
      unique: true,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter position'
        }
      }
    },

    enable: {
      type: DataTypes.INTEGER
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
  return Kiosk
}
