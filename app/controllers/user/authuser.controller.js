const db = require('../../models')
const config = require('../../config/auth.config')
const Users = db.users
const Role = db.role
const Op = db.Sequelize.Op
var uuid = require('uuid')
var bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')

exports.signin = async (req, res) => {
  Users.findOne({
    where: {
      username: req.body.username,
      enable: 1
    }
  })
    .then(async user => {
      if (!user) {
        return res.status(400).send({ message: 'User Not found.' })
      }
      var passwordIsValid = bcrypt.compareSync(req.body.password, user.password)
      console.log('\n---\n' + passwordIsValid + '\n---\n')
      if (passwordIsValid == false) {
        return res.status(400).send({
          message: 'Invalid Password!'
        })
      } else {
        var token = jwt.sign(
          {
            jti: uuid.v1(),
            id: user.id,
            name: user.firstname + ' ' + user.lastname
          },
          config.secretuser,
          {
            expiresIn: 86400 // 24 hours
          }
        )
        var authorities = []

        for (let i = 0; i < user.roles.length; i++) {
          authorities.push('ROLE_' + user.roles[i].toUpperCase())
        }
        return res.status(200).send({
          id: user.id,
          name: user.firstname + ' ' + user.lastname,
          email: user.email,
          roles: authorities,
          accessToken: token
        })
      }
    })
    .catch(err => {
      console.log(err.message)
      return res.status(400).send({ message: err.message })
    })
}
exports.signout = async (req, res) => {
  try {
    console.log('\n********************\n testlogout \n********************\n')
    //  const testlogout = jwt.destroy(req.decoded.decoded.jti, config.secretuser)
    console.log(
      '\n********************\n' + testlogout + '\n********************\n'
    )
    return res.status(200).send({ message: testlogout })
  } catch (error) {
    console.log(error)
    return res.status(400).send({ message: error })
  }
}
