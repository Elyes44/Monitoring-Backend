const yup = require('yup')
const schemacreate = yup.object({
  body: yup.object({
    stype: yup
      .string()
      .oneOf(['transaction', 'responsable'])
      .required('stype is a required field in body'),
    source: yup
      .string()
      .oneOf(['coins', 'banknotes'])
      .required('source is a required field in body'),
    amount: yup.number().required('amount is a required field in body'),
    datekiosk: yup.date().required('datekiosk is a required field in body'),
    cashboxid: yup
      .string()
      .required('cashboxid is a required field in body')
      .matches(
        /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
        'cashboxid should only be UUID v4 '
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
