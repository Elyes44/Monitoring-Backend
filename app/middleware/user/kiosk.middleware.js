const yup = require('yup')
const schemacreate = yup.object({
  body: yup.object({
    /* label status address  username password  position enable createdAt   */
    label: yup
      .string()
      .min(4)
      .max(32)
      .required(),
    status: yup
      .string()
      .oneOf(['works', 'broken'])
      .required(),
    address: yup
      .string()
      .min(4)
      .max(32)
      .required(),
    username: yup
      .string()
      .min(5)
      .max(15)
      .required(),
    password: yup
      .string()
      .min(6)
      .max(10)
      .required(),
    userid: yup
      .string()
      .required('userid is a required field')
      .matches(
        /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
        'userid should only be UUID v4 '
      ),
    enable: yup
      .number()
      .oneOf([0, 1])
      .required()
  })
})

const schemapower = yup.object({
  body: yup.object({
    enable: yup.number().required()
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
exports.power = () => async (req, res, next) => {
  try {
    await schemapower.validate({
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
