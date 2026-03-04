const turnoverrepository = require('../repositories/turnover.repository')
const log4j = require('../config/configLog4js.js')

exports.create = async (amount, kioskid) => {
  const res = await turnoverrepository.findtoday(kioskid)

  /*   {"count":0,"rows":[]} */
  if (res.count == 0) {
    const vat_turnover = {
      createdBy: kioskid,
      kioskId: kioskid,
      value: amount
    }
    const trn = await turnoverrepository.create(vat_turnover)
  } else if (res.count == 1) {
    const vat_turnover = {
      updatedBy: kioskid,
      kioskId: kioskid,
      value: res.rows[0].value + amount
    }
    const trnv = await turnoverrepository.update(vat_turnover, res.rows[0].id)
  } else {
     log4j.loggerinfo.error('errur')
  }
}
