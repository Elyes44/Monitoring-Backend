const yup = require('yup')
const schemacreate = yup.object({
  body: yup.object({
    code: yup.string().required('code is a required field'),
    title: yup.string().required('title is a required field'),
    description: yup.string().required('description is a required field'),
    details: yup.string().required('details is a required field'),
    ntype: yup
      .string()
      .oneOf(['critical', 'major', 'minor', 'info'])
      .required('ntype is a required field'),
    kioskid: yup
      .string()
      .required('kioskid is a required field')
      .matches(
        /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
        '${kioskid} should only be UUID v4 '
      )
      .required()
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
