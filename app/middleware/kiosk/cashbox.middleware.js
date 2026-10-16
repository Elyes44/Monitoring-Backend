const yup = require('yup')
const schemacreate = yup.object({
  body: yup.object({
    stockn: yup.number().required('{stockn} is a required field in body'),
    stockh: yup.number().required('{stockh} is a required field in body'),

  })
})

const schemastock = yup.object({
  body: yup.object({
    money: yup.number().required('{money} is a required field in body9'),
    source: yup
      .string()
      .min(4)
      .max(32)
      .required('{source} is a required field in body10')
  }),
  params: yup.object({
    id: yup
      .string()
      .required('{id} is a required field')
      .matches(
        /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
        'id should only be UUID v4 '
      )
  })
})
const schemafind = yup.object({
  params: yup.object({
    id: yup
      .string()
      .required('{id} is a required field')
      .matches(
        /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
        '{id} should only be UUID v4 '
      )
  })
})

exports.create = () => async (req, res, next) => {
  try {
    
    await schemacreate.validate({
      body: req.body,
      query: req.query,
      params: req.params
    })
    return next()
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message })
  }
}
exports.stock = () => async (req, res, next) => {
  try {
    await schemastock.validate({
      body: req.body,
      query: req.query,
      params: req.params,
    })
    return next()
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message })
  }
}
exports.find = () => async (req, res, next) => {
  try {
    await schemafind.validate({
      body: req.body,
      query: req.query,
      params: req.params
    })
    return next()
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message })
  }
}
