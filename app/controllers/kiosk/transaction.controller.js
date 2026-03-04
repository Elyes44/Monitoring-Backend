const log4j = require("../../config/configLog4js.js");
const transactionModel = require("../../models/transaction.model.js");
const transactionrepository = require("../../repositories/transaction.repository");

exports.payment = async (req, res) => {
  try {
    log4j.loggerdebug.debug(
      `payment topnet body=` +
        JSON.stringify(req.body) +
        "; query= " +
        JSON.stringify(req.query) +
        "; params=" +
        JSON.stringify(req.params) +
        "; decoded=" +
        JSON.stringify(req.decoded)
    );
    log4j.loggerinfo.info("Start payment kioskid=" + req.decoded.decoded.id);
    data = req.body;
    const var_transaction = {
      codetransactionkiosk: data.codetransactionkiosk || "0000",
      codeclient: data.codeclient,
      status: data.status || "success",
      comment: data.comment || "-",
      kioskId: req.decoded.decoded.id,
      amount: parseFloat(data.montant) || 0,
    };
    const tr = await transactionrepository.create(var_transaction);
    if (tr && tr !== undefined && tr !== null) {
      log4j.loggerinfo.info(
        "codeclient=" +
          data.codeclient +
          "  idtransaction=" +
          data.idtransaction +
          "  montant=" +
          data.montant
      );
      return res.status(200).send({
        data: tr,
        code: 0,
      });
    } else {
      log4j.loggerinfo.error("exception in transaction creation.");

      return res.status(400).send({
        message: "exception in transaction creation.",
        code: -2,
      });
    }
  } catch (error) {
    log4j.loggerinfo.error(error.message);
    return res.status(500).send({
      message: error.message,
      code: -1,
    });
  }
};
