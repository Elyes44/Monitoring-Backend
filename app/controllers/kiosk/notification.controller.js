const notificationrepository = require('../../repositories/notification.repository')
const kioskrepository = require('../../repositories/kiosk.repository')
const log4j = require('../../config/configLog4js.js')

exports.create = async (req, res) => {
  try {
    log4j.loggerdebug.debug(
      `Create Notification body=` +
        JSON.stringify(req.body) +
        '; query= ' +
        JSON.stringify(req.query) +
        '; params=' +
        JSON.stringify(req.params) +
        '; decoded=' +
        JSON.stringify(req.decoded)
    )

    console.log(req.body.kioskid)
    const kiosk = await kioskrepository.findOne(req.body.kioskid)
    if (kiosk != undefined && kiosk != null) {
      console.log(kiosk)
      console.log(req.decoded.decoded.id)
      if (kiosk.id == req.decoded.decoded.id) {
        const nt = await notificationrepository.create(req)
        if (nt != undefined && nt != null) {
          return res.status(201).send({
            message: nt,
            code: 0
          })
        } else {
          return res.status(200).send({
            message: 'Some error occurred while creating the Notification',
            code: -4
          })
        }
      } else {
        return res.status(200).send({
          message:
            'The token is not affiliated to this kiosk=${ ' +
            req.body.kioskid +
            ' }',
          code: -3
        })
      }
    } else {
      return res.status(200).send({
        message: 'kiosk not found with id=${' + req.body.kioskid + '}.',
        code: -2
      })
    }
  } catch (error) {
    log4j.loggerinfo.error(error.message)
    return res.status(200).send({
      message: error.message,
      code: -1
    })
  }
}
