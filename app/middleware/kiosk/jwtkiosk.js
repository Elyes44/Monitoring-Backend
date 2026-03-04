let jwt = require('jsonwebtoken')
const config = require('../../config/auth.config')
const db = require('../../models')
const Kiosks = db.kiosks
let checkToken = async (req, res, next) => {
  try {
    let token = req.headers['x-access-token'] || req.headers['authorization'] // Express headers are auto converted to lowercase
    if (token.startsWith('Bearer ')) {
      // Remove Bearer from string
      token = token.slice(7, token.length)
    }

    if (token) {
       try {
        const decoded = jwt.verify(token, config.secretkiosk)

        req.decoded = { decoded }
        next()
        return
      } catch (error) {
        console.log(error)
        return res.status(401).send({
          message: `Token is not valid`
        })
      }
    } else {
      return res.status(401).send({
        message: `Auth token is not supplied`
      })
    }
  } catch (error) {
    return res.status(401).send({
      message: `either not authenticated at all or authenticated incorrectly `
    })
  }
}
let isKiosk = (req, res, next) => {
  Kiosks.findByPk(req.decoded.decoded.id).then(kiosk => {
    if (kiosk) {
      next()
      return
    } else {
      return res.status(401).send({
        message: `Token is not valid`
      })
    }
  })
}
module.exports = {
  checkToken: checkToken,
  isKiosk: isKiosk
}
