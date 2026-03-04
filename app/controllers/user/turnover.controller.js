const turnoverrepository = require("../../repositories/turnover.repository");
const accessresponsible = require("../../service/accessresponsible");
const log4j = require("../../config/configLog4js.js");

// Retrieve all Turnovers from the database.
exports.findAll = async (req, res) => {
  try {
    log4j.loggerinfo.info("find all Turnovers");
    const nts = await turnoverrepository.findAll();
    if (nts != null && nts != undefined) {
      log4j.loggerinfo.info("Successfully found all Turnovers");
      return res.status(200).send({
        data: nts,
        code: 0,
      });
    } else {
      log4j.loggerinfo.warn("Some error occurred while retrieving Turnovers");
      return res.status(200).send({
        message: "Some error occurred while retrieving Turnovers",
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
exports.findLots = async (req, res) => {
  try {
    log4j.loggerinfo.info("find Lots Turnovers");
    const nts = await turnoverrepository.findLots(req);
    console.log(nts);

    if (nts != null && nts != undefined) {
      log4j.loggerinfo.info("Successfully found Lots Turnovers");
      return res.status(200).send({
        data: nts,
        code: 0,
      });
    } else {
      log4j.loggerinfo.warn(
        "Some error occurred while retrieving Lots Turnovers"
      );
      return res.status(200).send({
        message: "Some error occurred while retrieving Lots Turnovers",
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
// Find a single Turnover with an id
exports.findOne = async (req, res) => {
  try {
    log4j.loggerinfo.info(
      "Find a single Turnover with id=${ " + req.params.id + " }"
    );
    const nt = await turnoverrepository.findOne(req.params.id);
    if (nt != null && nt != undefined) {
      log4j.loggerinfo.info("Successfully found Turnover");
      return res.status(200).send({
        data: nt,
        code: 0,
      });
    } else {
      log4j.loggerinfo.warn(
        "Cannot find Turnover with id=${ " + req.params.id + " }"
      );
      return res.status(200).send({
        message: "Cannot find Turnover with id=${ " + req.params.id + " }",
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

// Find a single Turnover with an id
exports.turnoverinperiod = async (req, res) => {
  try {
    const accss = await accessresponsible.accessresponsible(
      req.decoded.decoded.id,
      req.query.kioskid
    );

    if (accss == true) {
      const period = req.query.period;
      const kioskId = req.query.kioskid;
      log4j.loggerinfo.info(
        "turnoverinperiod Turnover with idksk=${ " +
          kioskId +
          " } period=${ " +
          period +
          " }"
      );
      var turnover = 0;
      const date = new Date();
      var firstDay;
      var lastDay;
      const year = date.getFullYear();
      let month = date.getMonth() + 1;

      switch (period) {
        case "day":
          let day = date.getDate();
          day = day < 10 ? "0" + day : day;
          month = month < 10 ? "0" + month : month;
          firstDay = new Date(year, month - 1, day, 0, 0, 0, 0);
          lastDay = new Date(year, month - 1, day, 23, 59, 59, 999);
          turnover = await turnoverrepository.turnoverinperiod(
            firstDay,
            lastDay,
            kioskId
          );
          break;
        case "month":
          let f = new Date(year, month - 1, 1).getDate();
          let l = new Date(year, month - 1, 0).getDate();

          f = f < 10 ? "0" + f : f;
          l = l < 10 ? "0" + l : l;
          month = month < 10 ? "0" + month : month;
          firstDay = new Date(year, month - 1, f, 0, 0, 0, 0);
          lastDay = new Date(year, month - 1, l, 23, 59, 59, 999);
          turnover = await turnoverrepository.turnoverinperiod(
            firstDay,
            lastDay,
            kioskId
          );
          break;
        case "year":
          firstDay = new Date(year, 0, 1, 0, 0, 0, 0);
          lastDay = new Date(year, 11, 31, 23, 59, 59, 999);
          turnover = await turnoverrepository.turnoverinperiod(
            firstDay,
            lastDay,
            kioskId
          );
          break;
        default:
          turnover = await turnoverrepository.turnoverinperiod(
            null,
            null,
            kioskId
          );
          break;
      }
      if (turnover == null || turnover == undefined) {
        turnover = 0;
      }
      return res.status(200).send({
        turnover: turnover,
        code: 0,
      });
    } else {
      log4j.loggerinfo.warn("This kiosk is not for this responsible!");
      return res.status(200).send({
        message: "This kiosk is not for this responsible!",
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
