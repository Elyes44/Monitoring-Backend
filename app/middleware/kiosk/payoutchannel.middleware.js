const yup = require('yup')
const schemacreate = yup.object({
  /*  money currency  number  alert  */
  body: yup.object({
    money: yup.number().required('${money} is a required field in body'),
    currency: yup
      .string()
      .min(2)
      .max(6)
      .required('${currency} is a required field in body'),
    number: yup.number().required('${number} is a required field in body'),
    alert: yup.number().required('${alert} is a required field in body'),
    cashboxid: yup
      .string()
      .required('${cashboxid} is a required field in body')
      .matches(
        /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
        '${cashboxid} should only be UUID v4 '
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
