const yup = require('yup')
const schemacreate = yup.object({
  /* firstname  lastname   email  address  telephone   password   enable   roles */
  body: yup.object({
    firstname: yup
      .string()
      .min(3)
      .max(32)
      .required('firstname is a required field in body'),
    lastname: yup
      .string()
      .max(32),
      // .required('lastname is a required field in body'),
    email: yup
      .string()
      .email('Field should contain a valid e-mail')
      .min(3)
      .max(255),
      // .required('email is a required field in body'),
    address: yup
      .string()
      .max(255),
      // .required('address is a required field in body'),
    username: yup
      .string()
      .max(15),
      // .required('username is a required field in body'),
    telephone: yup
      .string()
      .min(8)
      .max(15)
      .required('telephone is a required field in body')
      .matches(/^(\+?0*216)?\d{8}$/i, 'It must only be a phone number'),
    password: yup
      .string()
      .min(6)
      .max(30)
      .required('password is a required field in body'),
    enable: yup
      .number()
      .oneOf([0, 1])
      .required('enable is a required field in body'),
    roles: yup
      .array()
      .required('roles is a required field in body')
      .of(
        yup
          .string()
          .oneOf(['admin', 'responsible', 'financial', 'user'])
          .required('status is a required field in body')
      )
  })
})

const schemaenable = yup.object({
  body: yup.object({
    enable: yup
      .number()
      .oneOf([0, 1])
      .required('enable is a required field in body')
  }),
  params: yup.object({
    id: yup
      .string()
      .required('id is a required field in params url')
      .matches(
        /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
        'id} should only be UUID v4 '
      )
  })
})

const schemafind = yup.object({
  params: yup.object({
    id: yup
      .string()
      .required('id is a required field in params url')
      .matches(
        /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
        'id should only be UUID v4 '
      )
  })
})
const schemaeditpwt = yup.object({
  body: yup.object({
    oldpassword: yup
      .string()
      .min(6)
      .max(30)
      .required(' oldpassword is a required field in body'),
    newpassword: yup
      .string()
      .min(6)
      .max(30)
      .required('newpassword is a required field in body')
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
    console.log('create-user-validation\n' + err.message)
    return res.status(400).json({ type: err.name, message: err.message })
  }
}

exports.enable = () => async (req, res, next) => {
  try {
    await schemaenable.validate({
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
exports.editpwt = () => async (req, res, next) => {
  try {
    await schemaeditpwt.validate({
      body: req.body,
      query: req.query,
      params: req.params
    })
    return next()
  } catch (err) {
    console.log('schemaeditpwt\n' + err.message)
    return res.status(400).json({ type: err.name, message: err.message })
  }
}
