const yup = require('yup')
const schemagetfactures = yup.object({
  query: yup.object({
    libellecontrat: yup
      .string()
      .min(8)
      .max(13)
      .required('libelle_contrat is a required field in params')
  })
})
const schemapayment = yup.object({
  body: yup.object({
    codeclient: yup
      .string()
      .min(5)
      .max(13)
      .required('codeclient is a required field in body'),
    idtransaction: yup
      .string()
      .min(4)
      .max(255)
      .required('idtransaction is a required field in body'),
    montant: yup
      .string()
      .min(4)
      .max(255)
      .required('montant is a required field in body'),
    kioskid: yup
      .string()
      .required('kioskid is a required field in params url')
      .matches(
        /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
        'kioskid should only be UUID v4 '
      )
  })
})
exports.getfactures = () => async (req, res, next) => {
  try {
    await schemagetfactures.validate({
      body: req.body,
      query: req.query,
      params: req.params
    })
    return next()
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message })
  }
}

exports.payment = () => async (req, res, next) => {
  try {
    await schemapayment.validate({
      body: req.body,
      query: req.query,
      params: req.params
    })
    return next()
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message })
  }
}
