const yup = require("yup");

const schemapayment = yup.object({
  body: yup.object({
    codeclient: yup
      .string()
      .min(5)
      .max(13)
      .required("codeclient is a required field in body"),
    montant: yup
      .number()
      .min(1)
      .max(255)
      .required("montant is a required field in body"),
    status: yup.string().matches("(success|failed|in-progress)"),
  }),
});

exports.payment = () => async (req, res, next) => {
  try {
    await schemapayment.validate({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    return next();
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};
