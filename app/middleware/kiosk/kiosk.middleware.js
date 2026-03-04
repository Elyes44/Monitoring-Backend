const yup = require('yup')

const schemastatus = yup.object({
  body: yup.object({
    status: yup
      .string()
      .oneOf(['works', 'broken'])
      .required()
  }),
  params: yup.object({
    id: yup
      .string()
      .required('id is a required field')
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
      .required('id is a required field')
      .matches(
        /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
        'id should only be UUID v4 '
      )
  })
})

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
