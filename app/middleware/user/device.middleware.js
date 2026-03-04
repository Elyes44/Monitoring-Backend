const yup = require('yup')
const schemacreate = yup.object({
  body: yup.object({
    /*  reference  status    */
    reference: yup
      .string()
      .min(4)
      .max(32)
      .required('reference is a required field in body'),
    dtype: yup
      .string()
      .oneOf([
        'coinsacceptor',
        'banknotesacceptor',
        'printer',
        'sorter',
        'hopper'
      ])
      .required('dtype is a required field in body'),
    name: yup
      .string()
      .min(4)
      .max(32)
      .required('name is a required field in body'),
    status: yup
      .string()
      .oneOf(['works', 'broken'])
      .required('status is a required field in body'),
    kioskid: yup
      .string()
      .required('kioskid is a required field in body')
      .matches(
        /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
        'kioskid should only be UUID v4 '
      )
  })
})

const schemastatus = yup.object({
  body: yup.object({
    status: yup
      .string()
      .oneOf(['works', 'broken'])
      .required('${status} is a required field in body')
  }),
  params: yup.object({
    id: yup
      .string()
      .required('${id} is a required field in params url')
      .matches(
        /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
        '${id} should only be UUID v4 '
      )
  })
})
const schemafind = yup.object({
  params: yup.object({
    id: yup
      .string()
      .required('${id} is a required field in params url')
      .matches(
        /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
        'id should only be UUID v4 '
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
exports.status = () => async (req, res, next) => {
  try {
    await schemastatus.validate({
      body: req.body,
      query: req.query,
      params: req.params
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
