const db = require('../models')
const Kiosks = db.kiosks
const Users = db.users
const log4j = require('../config/configLog4js.js')

let accessresponsible = async (userid, kioskid) => {
   log4j.loggerinfo.info('userid'+ userid+' kioskid'+ kioskid)
  const user = await Users.findByPk(userid)
  if (user && user != undefined && user != null) {
     log4j.loggerinfo.info('user.id'+user)
    for (let i = 0; i < user.roles.length; i++) {
      if (user.roles[i] === 'responsible') {
        const kiosk = await Kiosks.findByPk(kioskid).catch(err => {
          return null
        })
        if (kiosk && kiosk != undefined && kiosk != null) {
          if (kiosk.userId == userid) {
            log4j.loggerinfo.info('18')
            return true
          } else {
            log4j.loggerinfo.info('21l')
            return false
          }
        } else {
          log4j.loggerinfo.info('24')
          return false
        }
      }
    }
    log4j.loggerinfo.info('30')
    return true
  } else {
     log4j.loggerinfo.info('user is null')
    return false
  }
}
module.exports = {
  accessresponsible: accessresponsible
}
