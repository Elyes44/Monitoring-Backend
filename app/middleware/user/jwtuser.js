let jwt = require('jsonwebtoken')
const config = require('../../config/auth.config')
const db = require('../../models')
const Users = db.users

let checkToken = async (req, res, next) => {
  try {
    let token = req.headers['x-access-token'] || req.headers['authorization'] // Express headers are auto converted to lowercase
    if (token.startsWith('Bearer ')) {
      // Remove Bearer from string
      token = token.slice(7, token.length)
    }

    if (token) {
      try {
        const decoded =jwt.verify(token, config.secretuser)

        req.decoded = { decoded }
        next()
        return
      } catch (error) {
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
let isAdmin = (req, res, next) => {
  Users.findByPk(req.decoded.decoded.id).then(user => {
    if (user) {
      for (let i = 0; i < user.roles.length; i++) {
        if (user.roles[i] === 'admin') {
          next()
          return
        }
      }
      return res.status(401).send({
        message: 'Require Admin Role!'
      })
    } else {
      return res.status(401).send({
        message: `Token is not valid`
      })
    }
  })
}
let isFinancial = (req, res, next) => {
  Users.findByPk(req.decoded.decoded.id).then(user => {
    if (user) {
      for (let i = 0; i < user.roles.length; i++) {
        if (user.roles[i] === 'financial') {
          next()
          return
        }
      }
      return res.status(401).send({
        message: 'Require Kiosk Role!'
      })
    } else {
      return res.status(401).send({
        message: `Token is not valid`
      })
    }
  })
}
let isResponsible = (req, res, next) => {
  Users.findByPk(req.decoded.decoded.id).then(user => {
    if (user) {
      for (let i = 0; i < user.roles.length; i++) {
        if (user.roles[i] === 'responsible') {
          next()
          return
        }
      }
      return res.status(401).send({
        message: 'Require Kiosk Role!'
      })
    } else {
      return res.status(401).send({
        message: `Token is not valid`
      })
    }
  })
}

let isUser = (req, res, next) => {
  Users.findByPk(req.decoded.decoded.id).then(user => {
    if (user) {
      for (let i = 0; i < user.roles.length; i++) {
        if (user.roles[i] === 'user') {
          next()
          return
        }
      }
      return res.status(401).send({
        message: 'Require User Role!'
      })
    } else {
      return res.status(401).send({
        message: `Token is not valid`
      })
    }
  })
}
let isAdminAndFinancial = (req, res, next) => {
  Users.findByPk(req.decoded.decoded.id).then(user => {
    if (user) {
      for (let i = 0; i < user.roles.length; i++) {
        if (user.roles[i] === 'admin' || user.roles[i] === 'financial') {
          next()
          return
        }
      }
      return res.status(401).send({
        message: 'Require Admin Role!'
      })
    } else {
      return res.status(401).send({
        message: `Token is not valid`
      })
    }
  })
}
let isAdminAndResponsible = (req, res, next) => {
  Users.findByPk(req.decoded.decoded.id).then(user => {
    if (user) {
      for (let i = 0; i < user.roles.length; i++) {
        if (user.roles[i] === 'admin' || user.roles[i] === 'responsible') {
          next()
          return
        }
      }
      return res.status(401).send({
        message: 'Require Admin oàu repsponsable Role!'
      })
    } else {
      return res.status(401).send({
        message: `Token is not valid`
      })
    }
  })
}
let forAll = (req, res, next) => {
  console.log(JSON.stringify(req.decoded.decoded))
  Users.findByPk(req.decoded.decoded.id).then(user => {
    if (user) {
      for (let i = 0; i < user.roles.length; i++) {
        if (
          user.roles[i] === 'admin' ||
          user.roles[i] === 'responsible' ||
          user.roles[i] === 'financial'
        ) {
          next()
          return
        }
      }
      return res.status(401).send({
        message: 'Require Admin Role!'
      })
    } else {
      return res.status(401).send({
        message: `Token is not valid`
      })
    }
  })
}
module.exports = {
  checkToken: checkToken,
  isAdmin: isAdmin,
  isFinancial: isFinancial,
  isResponsible: isResponsible,
  isAdminAndFinancial: isAdminAndFinancial,
  isAdminAndResponsible: isAdminAndResponsible,
  forAll: forAll,
  isUser: isUser
}
