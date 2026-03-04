const DataTypes = require('sequelize')
module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('user', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    firstname: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter firstname'
        }
      }
    },
    lastname: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter lastname'
        }
      }
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter email'
        },
        isEmail: {
          msg: 'Must be a valid email'
        }
      }
    },
    address: {
      type: Sequelize.STRING
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
    telephone: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
      validate: {
        is: /^(\+?0*216)?\d{8}$/i,
        notNull: {
          msg: 'Please enter the phone number telephone'
        },
        isNumeric: {
          msg: 'The phone number{telephone} only contains digits'
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
    enable: {
      type: DataTypes.INTEGER
    },
    roles: {
      type: DataTypes.ARRAY(Sequelize.STRING),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Please enter roles'
        },
        isSpecificLength (value) {
          if (value.length < 1) {
            throw new Error('Roles must have at least one item')
          } else {
            const lstroles = ['admin', 'user', 'responsible', 'financial']
            for (let i = 0; i < value.length; i++) {
              if (!lstroles.includes(value[i])) {
                throw new Error('Role ' + value[i] + ' is invalid')
              }
            }
          }
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
  return User
}
