const pannerepository = require('../../repositories/panne.repository')
const devicerepository = require('../../repositories/device.repository')
const log4j = require('../../config/configLog4js.js')



// Create and Save a new Transaction
exports.create = async (req, res) => {
  try {
    log4j.loggerdebug.debug(
      `Create Panne body=` +
        JSON.stringify(req.body) +
        '; query= ' +
        JSON.stringify(req.query) +
        '; params=' +
        JSON.stringify(req.params) +
        '; decoded=' +
        JSON.stringify(req.decoded)
    )
     log4j.loggerinfo.info('Start create Panne kioskid=' + req.decoded.decoded.id)

    const dv = await devicerepository.findOne(req.body.deviceid)
    if (dv != undefined && dv != null) {
      console.log(dv)
      if (dv.kioskId == req.decoded.decoded.id) {
        const resfind = await pannerepository.findby(req.body.code, undefined)
        const pn = await pannerepository.create(req)
        if (pn != undefined && pn != null) {
          return res.status(201).send({
            message: pn,
            code: 0
          })
        } else {
          return res.status(200).send({
            message: 'Some error occurred while creating the Panne',
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
        message: 'Device not found with id=${' + req.body.deviceid + '}.',
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

// Correction Panne
exports.correction = async (req, res) => {
  try {
    log4j.loggerdebug.debug(
      `Correction Panne body=` +
        JSON.stringify(req.body) +
        '; query= ' +
        JSON.stringify(req.query) +
        '; params=' +
        JSON.stringify(req.params) +
        '; decoded=' +
        JSON.stringify(req.decoded)
    )
    const result = await pannerepository.findOne(req.params.id)
    if (result != undefined && result != null) {
      if (result.status !== 'done') {
        const var_panne = {
          status: 'done',
          updatedBy: req.decoded.decoded.id
        }
        const result2 = await pannerepository.update(var_panne, req.params.id)
        if (result2 != undefined && result2 != null) {
          if (result2 == 1) {
             log4j.loggerinfo.info('${' + result2 + '} Pannes were updated successfully!')
            return res.status(200).send({
              data: '${' + result2 + '} Pannes were updated successfully!',
              code: 0
            })
          } else {
             log4j.loggerinfo.info(
              'Cannot update Panne with id=${' +
                req.params.id +
                '}. Maybe Panne was not found or Table is empty!'
            )
            return res.status(200).send({
              data:
                'Cannot update Panne with id=${' +
                req.params.id +
                '}. Maybe Panne was not found or Table is empty!',
              code: 5
            })
          }
        } else {
          return res.status(200).send({
            message: 'Panne update failed',
            code: -4
          })
        }
      } else {
        return res.status(200).send({
          message: 'This panne has been fixed',
          code: -3
        })
      }
    } else {
      return res.status(200).send({
        message: 'Panne not found with id=${' + req.params.id + '}.',
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
