const cashboxrepository = require("../../repositories/cashbox.repository");
const payoutchannelrepository = require("../../repositories/payoutchannel.repository");
const feedingrepository = require("../../repositories/feeding.repository");
const historycloserepository = require("../../repositories/historyclose.repository");
const feedingsservice = require("../../service/feeding.service");
const stocksservice = require("../../service/stock.service");

const log4j = require("../../config/configLog4js.js");
const { cashboxs } = require("../../models/index.js");

// Create and Save a new Cashbox
exports.create = async (req, res) => {
  try {
    log4j.loggerdebug.debug(
      `create Cashbox body=` +
        JSON.stringify(req.body) +
        "; query= " +
        JSON.stringify(req.query) +
        "; params=" +
        JSON.stringify(req.params) +
        "; decoded=" +
        JSON.stringify(req.decoded)
    );

    var flag = false;
    log4j.loggerinfo.info("Start create Cashbox kioskid=");

    const existingCashbox = await cashboxrepository.findByKiosk(
      req.decoded.decoded.id
    );
    console.log(existingCashbox);
    stockm =Numner.parseFloat(
      Number.parseFloat(req.body.stockh) + Number.parseFloat(req.body.stockn));
    let result = null;
    let cashbox = {
      stockh: req.body.stockh,
      stockm,
      stockn: req.body.stockn,
      kioskId: req.decoded.decoded.id,
    };
    if (existingCashbox) {
      cashbox = existingCashbox;
      cashbox.stockh = req.body.stockh;
      cashbox.stockm = stockm;
      cashbox.stockn = req.body.stockn;
      cashbox.updatedAt = Date.now();
      result = await cashboxrepository.update(cashbox);
    } else {
      result = await cashboxrepository.create(cashbox);
    }
    console.log(result);

    if (result !== undefined && result !== null) {
      flag = true;
      log4j.loggerinfo.error("error payout channel creation");
    }

    if (flag == true) {
      return res.status(201).send({
        data: result,
        code: 0,
      });
    } else {
      return res.status(200).send({
        data: "Something went wrong.",
        code: -4,
      });
    }
  } catch (error) {
    log4j.loggerinfo.error(error.message);
    return res.status(200).send({
      message: error.message,
      code: -1,
    });
  }
};

exports.feeding = async (req, res) => {
  try {
    log4j.loggerdebug.debug(
      `feeding Cashbox body=` +
        JSON.stringify(req.body) +
        "; query= " +
        JSON.stringify(req.query) +
        "; params=" +
        JSON.stringify(req.params) +
        "; decoded=" +
        JSON.stringify(req.decoded)
    );
    log4j.loggerinfo.info(
      "Start feeding Cashbox kioskid=" + req.decoded.decoded.id
    );

    const cashbox = await cashboxrepository.findOne(req.body.cashboxid);
    if (cashbox != null && cashbox != undefined) {
      if (cashbox.kioskId == req.decoded.decoded.id) {
        const feeding = await feedingrepository.create(req);
        if (feeding != null && feeding != undefined) {
          log4j.loggerinfo.info(feeding);
          return res.status(201).send({
            data: feeding,
            code: 0,
          });
        } else {
          log4j.loggerinfo.warn("Some error occurred while creating feeding");
          return res.status(200).send({
            data: "Some error occurred while creating feeding",
            code: -4,
          });
        }
      } else {
        log4j.loggerinfo.warn(
          "The token is not affiliated to this kiosk=${ " +
            req.body.kioskid +
            " }"
        );
        return res.status(200).send({
          data:
            "The token is not affiliated to this kiosk=${ " +
            req.body.kioskid +
            " }",
          code: -3,
        });
      }
    } else {
      log4j.loggerinfo.warn(
        "Cannot find cashbox with id=${req.body.cashboxid}."
      );
      return res.status(200).send({
        data: "Cannot find cashbox with id=${req.body.cashboxid}.",
        code: -2,
      });
    }
  } catch (error) {
    log4j.loggerinfo.error(error.message);
    return res.status(200).send({
      message: error.message,
      code: -1,
    });
  }
};

exports.feedingdetails = async (req, res) => {
  log4j.loggerdebug.debug(
    `feeding details Cashbox body=` +
      JSON.stringify(req.body) +
      "; query= " +
      req.query +
      "; params=" +
      req.params
  );
  return await feedingsservice.feedingdetails(req, res);
};

exports.stock = async (req, res) => {
  log4j.loggerdebug.debug(
    `stock Cashbox body=` +
      JSON.stringify(req.body) +
      "; query= " +
      JSON.stringify(req.query) +
      "; params=" +
      JSON.stringify(req.params) +
      "; decoded=" +
      JSON.stringify(req.decoded)
  );
  return await stocksservice.stock(req, res);
};

exports.close = async (req, res) => {
  try {
    log4j.loggerdebug.debug(
      `close Cashbox body=` +
        JSON.stringify(req.body) +
        "; query= " +
        JSON.stringify(req.query) +
        "; params=" +
        JSON.stringify(req.params) +
        "; decoded=" +
        JSON.stringify(req.decoded)
    );

    const cashbox = await cashboxrepository.findOne(req.body.cashboxid);
    if (cashbox != null && cashbox != undefined) {
      if (cashbox.kioskId == req.decoded.decoded.id) {
        if (
          (cashbox.ctype == "coins" &&
            (req.body.cltype == "monnayeur" || req.body.cltype == "hopper")) ||
          cashbox.ctype == req.body.cltype
        ) {
          var_close = {
            cltype: req.body.cltype,
            stockserver: 0,
            stockkiosk: req.body.stockkiosk,
            stockphysique: req.body.stockphysique,
            datekiosk: req.body.datekiosk,
            status: "inprogress",
            cashboxId: cashbox.id,
            createdBy: req.decoded.decoded.id,
          };
          var n = 0;
          switch (req.body.cltype) {
            case "monnayeur":
              var_close.stockserver = cashbox.stockm;
              const stockg01 = cashbox.stockg - cashbox.stockm;
              n = await cashboxrepository.updatefield(
                {
                  stockm: 0,
                  stockg: stockg01,
                  updatedBy: req.decoded.decoded.id,
                },
                cashbox.id
              );
              break;
            case "hopper":
              var_close.stockserver = cashbox.stockh;
              const stockg02 = cashbox.stockg - cashbox.stockh;
              n = await cashboxrepository.updatefield(
                {
                  stockh: 0,
                  stockg: stockg02,
                  updatedBy: req.decoded.decoded.id,
                },
                cashbox.id
              );
              break;
            case "banknotes":
              var_close.stockserver = cashbox.stockn;
              n = await cashboxrepository.updatefield(
                { stockn: 0, stockg: 0, updatedBy: req.decoded.decoded.id },
                cashbox.id
              );
              break;
          }
          console.log(n);
          if (n == 1) {
            var_close.status = "success";
          } else {
            var_close.status = "failed";
          }
          const cl = await historycloserepository.create(var_close);
          if (cl != null && cl != undefined) {
            log4j.loggerinfo.info(cl);
            return res.status(201).send({
              data: cl,
              code: 0,
            });
          } else {
            log4j.loggerinfo.warn("Some error occurred while creating close");
            return res.status(200).send({
              data: "Some error occurred while creating close",
              code: -3,
            });
          }
        } else {
          log4j.loggerinfo.warn("the type is invalid");
          return res.status(200).send({
            data: "the type is invalid",
            code: -3,
          });
        }
      } else {
        log4j.loggerinfo.warn(
          "The token is not affiliated to this kiosk=${ " +
            cashbox.kioskid +
            " }"
        );
        return res.status(200).send({
          data:
            "The token is not affiliated to this kiosk=${ " +
            cashbox.kioskid +
            " }",
          code: -3,
        });
      }
    } else {
      log4j.loggerinfo.warn(
        "Cannot find cashbox with id=${" + req.body.cashboxid + "}."
      );
      return res.status(200).send({
        data: "Cannot find cashbox with id=${" + req.body.cashboxid + "}.",
        code: -2,
      });
    }
  } catch (error) {
    log4j.loggerinfo.error(error.message);
    return res.status(200).send({
      message: error.message,
      code: -1,
    });
  }
};
