const cashboxrepository = require('../repositories/cashbox.repository')
const payoutchannelrepository = require('../repositories/payoutchannel.repository')
const hitorystockpository = require('../repositories/hitorystock.repository')
const log4j = require('../config/configLog4js.js')


exports.stock = async (req, res) => {
  try {
    const cashbox = await cashboxrepository.findOne(req.body.cashboxid)
    if (cashbox != null && cashbox != undefined) {
      if (cashbox.kioskId == req.decoded.decoded.id) {
        if (req.body.source == cashbox.ctype) {
          if (req.body.stype == 'responsable') {
            const payouts = await payoutchannelrepository.find(
              req.body.cashboxid
            )
            console.log(payouts) 
            if (payouts != null && payouts != undefined) {
              const stockmodel = {
                amount: 0,
                stype: req.body.stype,
                source: req.body.source,
                oldstock: 0,
                status: 'success',
                cashboxId: req.body.cashboxid,
                createdBy: req.decoded.decoded.id
              }
              var stock = 0
              payouts.rows.forEach(async element => {
                stock = stock + element.number * element.money
                var n = await payoutchannelrepository.updatenumber(
                  0,
                  element.id,
                  req.decoded.decoded.id
                )
                if (n != 1) {
                  stockmodel.status = 'failed'
                }
              })

              stockmodel.amount = stock
              if (req.body.source == 'banknotes') {
                stockmodel.oldstock = cashbox.stockn
                var_cashbox = {
                  stockn: cashbox.stockn + stock,
                  stockg: cashbox.stockg + stock
                }
                var res1 = cashboxrepository.updatefield(
                  var_cashbox,
                  req.body.cashboxid
                )
              } else {
                stockmodel.oldstock = cashbox.stockh
                var_cashbox = {
                  stockh: cashbox.stockh + stock,
                  stockg: cashbox.stockg + stock
                }
                var res1 = cashboxrepository.updatefield(
                  var_cashbox,
                  req.body.cashboxid
                )
              }
              console.log(
                '\n*************************************************\n'
              )
              console.log(stockmodel)
              console.log(
                '\n*************************************************\n'
              )
              const st = await hitorystockpository.create(stockmodel)
              if (st != null && st != undefined) {
                 log4j.loggerinfo.info(st)
                return res.status(201).send({
                  message: st,
                  code: 0
                })
              } else {
                 log4j.loggerinfo.error(
                  'An error occurred while creating the hitory stock for cashbox id=' +
                    req.body.cashboxid
                )
                return res.status(200).send({
                  message: error.message,
                  code: -7
                })
              }
            } else {
               log4j.loggerinfo.error(
                'An error occurred while creating the payout channel(undefined or null) for cashbox id=' +
                  req.body.cashboxid
              )
              return res.status(200).send({
                message: error.message,
                code: -6
              })
            }
          } else {
            const stockmodel = {
              amount: req.body.amount,
              stype: req.body.stype,
              source: req.body.source,
              oldstock: 0,
              status: 'success',
              cashboxId: req.body.cashboxid,
              createdBy: req.decoded.decoded.id
            }
            if (req.body.source == 'banknotes') {
              stockmodel.oldstock = cashbox.stockn
              var_cashbox = {
                stockn: cashbox.stockn + req.body.amount,
                stockg: cashbox.stockg + req.body.amount
              }
              var res1 = cashboxrepository.updatefield(
                var_cashbox,
                req.body.cashboxid
              )
            } else {
              stockmodel.oldstock = cashbox.stockh
              var_cashbox = {
                stockm: cashbox.stockm + req.body.amount,
                stockg: cashbox.stockg + req.body.amount
              }
              var res1 = await cashboxrepository.updatefield(
                var_cashbox,
                req.body.cashboxid
              )
            }

            const st = await hitorystockpository.create(stockmodel)
            if (st != null && st != undefined) {
               log4j.loggerinfo.info(st)
              return res.status(201).send({
                message: st,
                code: 0
              })
            } else {
               log4j.loggerinfo.error(
                'An error occurred while creating the hitory stock for cashbox id=' +
                  req.body.cashboxid
              )
              return res.status(200).send({
                message:
                  'An error occurred while creating the hitory stock for cashbox id=' +
                  req.body.cashboxid,
                code: -5
              })
            }
          }
        } else {
           log4j.loggerinfo.warn('the cashbox type is not=${ ' + req.body.source + ' }')
          return res.status(200).send({
            data: 'the cashbox type is not=${ ' + req.body.source + ' }',
            code: -4
          })
        }
      } else {
         log4j.loggerinfo.warn(
          'The token is not affiliated to this kiosk=${ ' +
            cashbox.kioskid +
            ' }'
        )
        return res.status(200).send({
          data:
            'The token is not affiliated to this kiosk=${ ' +
            cashbox.kioskid +
            ' }',
          code: -3
        })
      }
    } else {
       log4j.loggerinfo.warn('Cannot find cashbox with id=${' + req.body.cashboxid + '}.')
      return res.status(200).send({
        data: 'Cannot find cashbox with id=${' + req.body.cashboxid + '}.',
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
