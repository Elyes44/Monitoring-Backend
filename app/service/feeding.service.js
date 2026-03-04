const cashboxrepository = require('../repositories/cashbox.repository')
const payoutchannelrepository = require('../repositories/payoutchannel.repository')
const feedingrepository = require('../repositories/feeding.repository')
const feedingdetailrepository = require('../repositories/feedingdetail.repository')
const hitoryfeedingrepository = require('../repositories/hitoryfeeding.repository')
const log4j = require('../config/configLog4js.js')

verifyamount = async feedingid => {
  var sum = 0
  const test = await feedingdetailrepository.find(feedingid)
  if (test != null && test != undefined) {
    if (test.count != 0) {
      test.rows.forEach(element => {
        sum += (element.newnumber - element.oldnumber) * element.money
      })
    }
  }
  return sum
}
exports.feedingdetails = async (req, res) => {
  try {
    log4j.loggerinfo.info(
      'Start update feeding (add detail) Cashbox kioskid=' +
        req.decoded.decoded.id
    )
    const feeding = await feedingrepository.findOne(req.body.feedingid)
    log4j.loggerinfo.info('27')

    if (feeding != null && feeding != undefined) {
      log4j.loggerinfo.info('30-->       ' + JSON.stringify(feeding))
      const test = await feedingdetailrepository.find(
        req.body.feedingid,
        req.body.money
      )
      log4j.loggerinfo.info('35-->       ' + JSON.stringify(test))
      if (feeding.status == 'inprogress') {
        if (test.count == 0) {
          const cashbox = await cashboxrepository.findOne(feeding.cashboxId)
          if (cashbox != null && cashbox != undefined) {
            if (cashbox.kioskId == req.decoded.decoded.id) {
              const pay = await payoutchannelrepository.find(
                feeding.cashboxId,
                req.body.money
              ) //{ count: 0, rows: [] }
              if (pay.count == 1) {
                const feedingdetail = await feedingdetailrepository.create(req)
                var n =
                  pay.rows[0].number + (req.body.newnumber - req.body.oldnumber)
                if (feeding != null && feeding != undefined) {
                  const pay2 = await payoutchannelrepository.updatenumber(
                    n,
                    pay.rows[0].id,
                    req.decoded.decoded.id
                  )
                  if (pay2 != null && pay2 != undefined) {
                    var historyf = {
                      diffrenceserver: pay.rows[0].number - req.body.oldnumber,
                      money: req.body.money,
                      newnumber: n,
                      oldnumber: pay.rows[0].number,
                      status: 'success',
                      feedingId: req.body.feedingid,
                      createdBy: req.decoded.decoded.id
                    }
                    historyf = await hitoryfeedingrepository.create(historyf)
                    const valamount = await verifyamount(req.body.feedingid)
                    if (feeding.amount == valamount) {
                      var_feeding = {
                        status: 'success',
                        updatedBy: req.decoded.decoded.id,
                        updatedAt: Date.now
                      }
                      const tst = await feedingrepository.update(
                        var_feeding,
                        req.body.feedingid
                      )
                    } else if (feeding.amount < valamount) {
                      var_feeding = {
                        status: 'completed',
                        updatedBy: req.decoded.decoded.id,
                        updatedAt: Date.now
                      }
                      const tst = await feedingrepository.update(
                        var_feeding,
                        req.body.feedingid
                      )
                    }
                    return res.status(201).send({
                      data: feedingdetail,
                      code: 0
                    })
                  } else {
                    var historyf = {
                      diffrenceserver: pay.rows[0].number - req.body.oldnumber,
                      money: req.body.money,
                      newnumber: n,
                      oldnumber: pay.rows[0].number,
                      status: 'failed',
                      feedingId: req.body.feedingid,
                      createdBy: req.decoded.decoded.id
                    }
                    historyf = await hitoryfeedingrepository.create(historyf)
                    log4j.loggerinfo.warn(
                      'Create details successfully but payout channel update failed'
                    )
                    return res.status(200).send({
                      data:
                        'Create details successfully but payout channel update failed',
                      code: -9
                    })
                  }
                } else {
                  log4j.loggerinfo.warn(
                    'Some error occurred while creating the feeding detail'
                  )
                  return res.status(200).send({
                    data:
                      'Some error occurred while creating the feeding detail',
                    code: -8
                  })
                }
              } else {
                log4j.loggerinfo.warn(
                  'An error occurred while creating the payout channel or feed details'
                )
                return res.status(200).send({
                  data:
                    'An error occurred while creating the payout channel or feed details',
                  code: -7
                })
              }
            } else {
              log4j.loggerinfo.warn(
                'The token is not affiliated to this kiosk=${ ' +
                  req.body.kioskid +
                  ' }'
              )
              return res.status(200).send({
                data:
                  'The token is not affiliated to this kiosk=${ ' +
                  req.body.kioskid +
                  ' }',
                code: -6
              })
            }
          } else {
            log4j.loggerinfo.warn(
              'Cannot find cashbox with id=${' + feeding.cashboxid + '}.'
            )
            return res.status(200).send({
              data: 'Cannot find cashbox with id=${' + feeding.cashboxid + '}.',
              code: -5
            })
          }
        } else {
          log4j.loggerinfo.warn('This money was entered into this transaction')
          return res.status(200).send({
            data: 'This money was entered into this transaction',
            code: -3
          })
        }
      } else {
        log4j.loggerinfo.warn('This feeding has completed')
        return res.status(200).send({
          data: 'This feeding has completed',
          code: -2
        })
      }
    } else {
      log4j.loggerinfo.warn(
        'Cannot find feeding with id=${' + req.body.feedingid + '}.'
      )
      return res.status(200).send({
        data: 'Cannot find feeding with id=${' + req.body.feedingid + '}.',
        code: -4
      })
    }
  } catch (error) {
    log4j.loggerinfo.error(error.message)
    return res.status(200).send({
      data: error.message,
      code: -1
    })
  }
}
