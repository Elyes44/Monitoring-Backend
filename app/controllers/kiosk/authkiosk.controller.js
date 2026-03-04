const db = require('../../models')
const config = require('../../config/auth.config')
const Kiosks = db.kiosks
var bcrypt = require('bcryptjs')
var uuid = require('uuid')
var jwt = require('jsonwebtoken')
const log4j = require('../../config/configLog4js.js')
exports.signin = (req, res) => {
  console.log(req.body)
  log4j.loggerdebug.debug(
    `signin kiosk body=` +
      JSON.stringify(req.body) +
      '; query= ' +
      req.query +
      '; params=' +
      req.params
  )
  Kiosks.findOne({
    where: {
      username: req.body.username,
      enable: 1
    }
  })
    .then(async kiosk => {
      if (!kiosk) {
        return res.status(400).send({ message: 'Kiosk Not found.' })
      }
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        kiosk.password
      )
      console.log('\n---\n' + passwordIsValid + '\n---\n')
      if (passwordIsValid == false) {
        return res.status(400).send({
          message: 'Invalid Password!'
        })
      } else {
        var token = jwt.sign(
          {
            jti: uuid.v1(),
            id: kiosk.id,
            name: kiosk.label
          },
          config.secretkiosk,
          {
            expiresIn: 86400 // 24 hours
          }
        )
        var authorities = []

        authorities.push('ROLE_KIOSK')

        return res.status(200).send({
          id: kiosk.id,
          label: kiosk.label,
          status: kiosk.status,
          roles: authorities,
          accessToken: token
        })
      }
    })
    .catch(err => {
      console.log(err.message)
      return res.status(200).send({ message: err.message })
    })
}
exports.signout = async (req, res) => {
  try {
    log4j.loggerdebug.debug(
      `signout kiosk body=` +
        JSON.stringify(req.body) +
        '; query= ' +
        JSON.stringify(req.query) +
        '; params=' +
        JSON.stringify(req.params) +
        '; decoded=' +
        JSON.stringify(req.decoded)
    )

    const testlogout = jwt.destroy(req.decoded.decoded.jti, config.secretuser)
    return res.status(200).send({ message: testlogout })
  } catch (error) {
    console.log(error)
    return res.status(400).send({ message: error })
  }
}
