const feedingrepository = require("../../repositories/feeding.repository.js");
const log4j = require("../../config/configLog4js.js");

exports.create = async (req, res) => {
  try {
    log4j.loggerdebug.debug(
      `create feed body=` +
        JSON.stringify(req.body) +
        "; query= " +
        JSON.stringify(req.query) +
        "; params=" +
        JSON.stringify(req.params) +
        "; decoded=" +
        JSON.stringify(req.decoded)
    );
    var flag = false;
    log4j.loggerinfo.info("Start create feed kioskid=");
    stockm = parseFloat(req.body.stockh) + parseFloat(req.body.stockn);
    let result = null;
    let feed = {
      stockh: req.body.stockh,
      stockm,
      stockn: req.body.stockn,
      kioskId: req.decoded.decoded.id,
      type: req.body.type,
    };

    result = await feedingrepository.create(feed);

    console.log(result);

    if (result !== undefined && result !== null) {
      flag = true;
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
