const kioskrepository = require('../../repositories/kiosk.repository')
const db = require('../../models')
const Kiosks = db.kiosks
const Users = db.users
const Devices = db.devices
const log4j = require('../../config/configLog4js.js')
exports.init = async (req, res) => {
  try {
    log4j.loggerdebug.debug(
      `init kiosk body=` +
        JSON.stringify(req.body) +
        '; query= ' +
        req.query +
        '; params=' +
        req.params +
        '; decoded=' +
        req.decoded
    )
    const kiosk = await Kiosks.findOne({ 
      include: {
        model: Devices,
        as: 'devices' // specifies how we want to be able to access our joined rows on the returned data
      },
      raw: false,
      where: {
        id: req.decoded.decoded.id,
        enable: 1
      }
    }).catch(err => {
      console.log('/******************/' + err.message)
      return res.status(400).send({ message: err.message })
    })
    const responsable = await Users.findByPk(kiosk.userId).catch(err => {
      console.log('/******************/' + err.message)
      return res.status(400).send({ message: err.message })
    })
    if (
      kiosk &&
      kiosk !== undefined &&
      kiosk !== null &&
      responsable &&
      responsable !== undefined &&
      responsable !== null
    ) {
      return res.status(200).send({
        data: { kiosk: kiosk, responsable: responsable },
        code: 0
      })
    } else {
      return res.status(400).send({ message: 'Kiosk Not found.' })
    }
  } catch (error) {
    return res.status(200).send({
      message: error.message,
      code: -1
    })
  }
}
exports.updatestatus = async (req, res) => {
  try {
    log4j.loggerdebug.debug(
      `update status kiosk body=` +
        JSON.stringify(req.body) +
        '; query= ' +
        JSON.stringify(req.query) +
        '; params=' +
        JSON.stringify(req.params) +
        '; decoded=' +
        JSON.stringify(req.decoded)
    )
    const id = req.params.id
    var data = await kioskrepository.updatestatus(req)
    if (data == 1) {
      return res.status(200).send({
        message: data,
        code: 0
      })
    } else {
      return res.status(200).send({
        message: data,
        code: -2
      })
    }
  } catch (error) {
    return res.status(200).send({
      message: error.message,
      code: -1
    })
  }
}
