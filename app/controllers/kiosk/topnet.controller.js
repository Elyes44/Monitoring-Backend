const transactionrepository = require('../../repositories/transaction.repository')
const kioskrepository = require('../../repositories/kiosk.repository')
const turnoverservice = require('../../service/turnover.service')
const log4j = require('../../config/configLog4js.js')

var soap = require('soap')

exports.helloworld = async (req, res) => {
  try {
    log4j.loggerdebug.debug(
      `helloworld topnet body=` +
        JSON.stringify(req.body) +
        '; query= ' +
        JSON.stringify(req.query) +
        '; params=' +
        JSON.stringify(req.params) +
        '; decoded=' +
        JSON.stringify(req.decoded)
    )
    log4j.loggerinfo.info(
      'Start test api topnet kioskid=' + req.decoded.decoded.id
    )
    var url = 'http://41.231.5.252:9876/Service.asmx?WSDL'
    soap.createClient(url, { wsdl_options: { timeout: 8000 } }, async function (
      err,
      client
    ) {
      try {
        await client.HelloWorld(function (err, result) {
          return res.status(200).send({
            message: result,
            code: 0
          })
        })
      } catch (error) {
        log4j.loggerinfo.error(error.message)
        return res.status(200).send({
          message: 'the topnet service is not available ',
          code: -2
        })
      }
    })
  } catch (error) {
    log4j.loggerinfo.error(error.message)
    return res.status(200).send({
      message: error.message,
      code: -1
    })
  }
}

exports.getfactures = async (req, res) => {
  try {
    log4j.loggerdebug.debug(
      `get factures topnet body=` +
        JSON.stringify(req.body) +
        '; query= ' +
        JSON.stringify(req.query) +
        '; params=' +
        JSON.stringify(req.params) +
        '; decoded=' +
        JSON.stringify(req.decoded)
    )
    log4j.loggerinfo.info(
      'Start get factures kioskid=' + req.decoded.decoded.id
    )
    var url = 'http://41.231.5.252:9876/Service.asmx?WSDL'
    const { libellecontrat } = req.query
    log4j.loggerinfo.info('libellecontrat=' + libellecontrat)
    var args = {
      libelleContrat: libellecontrat,
      paramsCredential: {
        societe: 'payposborne',
        pwd: '3dXUwoqPEOBwQ85hEkMe'
      }
    }
    soap.createClient(url, { wsdl_options: { timeout: 8000 } }, async function (
      err,
      client
    ) {
      try {
        await client.GetFacturesClient(args, function (err, result) {
          if (result && result !== undefined && result !== null) {
            str = '['
            if (result.GetFacturesClientResult.nbreFactures > 0) {
              // console.log(JSON.stringify(result.GetFacturesClientResult.listeFactures.Facture))
              result.GetFacturesClientResult.listeFactures.Facture.forEach(
                element => {
                  str =
                    str +
                    ';  idTransaction=' +
                    element.idTransaction +
                    'numJurFacture=' +
                    element.numJurFacture
                }
              )
            }
            log4j.loggerinfo.info(
              'nbreFactures=' +
                result.GetFacturesClientResult.nbreFactures +
                'totalResteAPayerFactures=' +
                result.GetFacturesClientResult.totalResteAPayerFactures +
                str +
                ']'
            )
            return res.status(200).send({
              data: result,
              code: 0
            })
          } else {
            log4j.loggerinfo.error(
              'the topnet service is  available but the result is null '
            )
            return res.status(200).send({
              message:
                'the topnet service is  available but the result is null',
              code: -3
            })
          }
        })
      } catch (error) {
        log4j.loggerinfo.error(error.message)
        return res.status(200).send({
          message: 'the topnet service is not available ',
          code: -2
        })
      }
    })
  } catch (error) {
    log4j.loggerinfo.error(error.message)
    return res.status(200).send({
      message: error.message,
      code: -1
    })
  }
}

exports.payment = async (req, res) => {
  try {
    log4j.loggerdebug.debug(
      `payment topnet body=` +
        JSON.stringify(req.body) +
        '; query= ' +
        JSON.stringify(req.query) +
        '; params=' +
        JSON.stringify(req.params) +
        '; decoded=' +
        JSON.stringify(req.decoded)
    )
    log4j.loggerinfo.info('Start payment kioskid=' + req.decoded.decoded.id)

    const { codeclient, idtransaction, montant } = req.body

    const var_transaction = {
      codetransactiontopnet: idtransaction,
      codetransactionkiosk: '0000',
      codeclient: codeclient,
      status: 'inprogress',
      comment: '-',
      kioskId: req.body.kioskid,
      amount: montant,
      createdBy: req.decoded.decoded.id
    }
    const tr = await transactionrepository.create(var_transaction)
    if (tr && tr !== undefined && tr !== null) {
      var url = 'http://41.231.5.252:9876/Service.asmx?WSDL'
      log4j.loggerinfo.info(
        'codeclient=' +
          codeclient +
          '  idtransaction=' +
          idtransaction +
          '  montant=' +
          montant
      )

      var args = {
        idTransaction: idtransaction,
        codeTransactionValid: codeclient,
        montantTransaction: montant,
        paramsCredential: {
          societe: 'payposborne',
          pwd: '3dXUwoqPEOBwQ85hEkMe'
        }
      }
      const var_transaction2 = {
        status: '',
        comment: '-',
        updatedBy: req.decoded.decoded.id,
        updatedAt: null
      }

      soap.createClient(
        url,
        { wsdl_options: { timeout: 8000 } },
        async function (err, client) {
          try {
            client.SetTransaction(args, async function (err, result) {
              if (result && result !== undefined && result !== null) {
                await turnoverservice.create(tr.amount, req.decoded.decoded.id)
                log4j.loggerinfo.info(
                  '  idtransaction=' +
                    idtransaction +
                    'SetTransactionResult= ' +
                    result.SetTransactionResult
                )
                if (result.SetTransactionResult) {
                  var_transaction2.updatedAt = Date.now
                  var_transaction2.status = 'success'
                  var tr2 = await transactionrepository.update(
                    var_transaction2,
                    tr.id
                  )

                  return res.status(200).send({
                    data: result,
                    code: 0
                  })
                } else {
                  var_transaction2.updatedAt = Date.now
                  var_transaction2.status = 'failed'
                  var tr2 = await transactionrepository.update(
                    var_transaction2,
                    tr.id
                  )

                  console.log("result",result)
                  return res.status(200).send({
                    data: result,
                    code: -5
                  })
                }
              } else {
                log4j.loggerinfo.error(
                  'the topnet service is  available but the result is null '
                )
                var_transaction2.comment =
                  '(-4)the topnet service is  available but the result is null '
                var_transaction2.updatedAt = Date.now
                var_transaction2.status = 'echec'
                var tr2 = await transactionrepository.update(
                  var_transaction2,
                  tr.id
                )
                return res.status(200).send({
                  message:
                    'the topnet service is  available but the result is null',
                  code: -4
                })
              }
            })
          } catch (error) {
            log4j.loggerinfo.error('the topnet service is not available ')
            var_transaction2.comment =
              '(-3)the topnet service is not available '
            var_transaction2.updatedAt = Date.now
            var_transaction2.status = 'echec'
            var tr2 = await transactionrepository.update(
              var_transaction2,
              tr.id
            )
            return res.status(200).send({
              message: 'the topnet service is not available ',
              code: -3
            })
          }
        }
      )
    } else {
      log4j.loggerinfo.error('exception in transaction creation.')

      return res.status(200).send({
        message: 'exception in transaction creation.',
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
