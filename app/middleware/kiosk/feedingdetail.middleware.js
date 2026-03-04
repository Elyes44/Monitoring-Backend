const yup = require('yup')
const schemacreate = yup.object({
  body: yup.object({
    diffrencekiosk: yup
      .number()
      .required('${diffrencekiosk} is a required field in body'),
    money: yup.number().required('${money} is a required field in body'),
    oldnumber: yup.number().required('${money} is a required field in body'),
    newnumber: yup.number().required('${number} is a required field in body'),
    feedingid: yup
      .string()
      .required('${feedingid} is a required field in body')
      .matches(
        /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
        '${feedingid} should only be UUID v4 '
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
