const db = require("../models");
const Turnover = db.turnovers;
const transaction = db.transactions;
const sequelize = require("sequelize");
const Op = sequelize.Op;
const log4j = require("../config/configLog4js.js");
const { groupBy } = require("rxjs");
const { date } = require("yup");

const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};
const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: turnovers } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, turnovers, totalPages, currentPage, data };
};
// Create and Save a new Turnover
exports.create = async (var_turnover) => {
  const data = await Turnover.create(var_turnover).catch((err) => {
    log4j.loggerinfo.error("++" + err.message);
    return null;
  });

  return data;
};
// Retrieve all Turnovers from the database.
exports.findtoday = async (kioskid) => {
  const TODAY_START = new Date().setHours(0, 0, 0, 0);
  const NOW = new Date();
  console.log(TODAY_START);
  console.log(NOW);
  const data = await Turnover.findAndCountAll({
    where: {
      kioskId: kioskid,
      createdAt: {
        [Op.gt]: TODAY_START,
        [Op.lt]: NOW,
      },
    },
    order: [["createdAt", "DESC"]],
  }).catch((err) => {
    log4j.loggerinfo.error("\n  --" + err.message);
    return null;
  });
  return data;
};
// Retrieve all Turnovers from the database.
exports.turnoverinperiod = async (firstDay, lastDay, kioskId) => {
  var conditionperiod =
    firstDay && lastDay
      ? {
          createdAt: {
            [Op.between]: [`${firstDay}`, `${lastDay}`],
          },
        }
      : null;
  var conditionkioskid = kioskId ? { kioskId: `${kioskId}` } : null;
  console.log(conditionkioskid);
  const data = await transaction.sum("amount", {
    where: {
      [Op.and]: [conditionperiod, conditionkioskid],
    },
  }).catch((err) => {
    log4j.loggerinfo.error("\n  --" + err.message);
    return null;
  });
  console.log(data);
  
  return data;
};
// Retrieve all Turnovers from the database.
exports.findAll = async () => {
  const data = await Turnover.findAndCountAll({
    where: {},
    order: [["createdAt", "DESC"]],
  }).catch((err) => {
    log4j.loggerinfo.error(err.message);
    return null;
  });
  return data;
};

// Retrieve all with pagination and/or filtre Turnovers from the database.
exports.findLots = async (req) => {
  // console.log('\n*************************************\n' + req.query)

  const { page, size, kioskid, startdate, enddate } = req.query;
  var conditionkioskid = kioskid ? { kioskId: `${kioskid}` } : null;
  var conditionstartdate = startdate
    ? { createdAt: { [Op.gte]: `${startdate}` } }
    : null;
  var conditionenddate = enddate
    ? { createdAt: { [Op.lte]: `${enddate}` } }
    : null;
  const { limit, offset } = getPagination(page, size);

  const data = await transaction
    .findAll({
      attributes: [
        [sequelize.fn("DATE", sequelize.col("createdAt")), "date"],
        [sequelize.fn("SUM", sequelize.col("amount")), "total"],
        "kioskId",
      ],
      where: {
        [Op.and]: [conditionkioskid, conditionstartdate, conditionenddate],
      },
      offset: offset,
      limit: limit,
      // order: [["date", "DESC"]],
      group: ["date", "kioskId"],
    })
    .catch((err) => {
      log4j.loggerinfo.error(err.message);
      return null;
    });
  const rows = await transaction
    .count({
      where: {
        [Op.and]: [conditionkioskid, conditionstartdate, conditionenddate],
      },
      offset: offset,
      limit: limit,
      // order: [["date", "DESC"]],
    })
    .catch((err) => {
      log4j.loggerinfo.error(err.message);
      return null;
    });

  console.log(rows);
  const interData =  data
  interData.count = data.length;
  interData.rows = rows;
  const response = getPagingData(interData, page, limit);
  return response;
};

// Find a single Turnover with an id
exports.findOne = async (id) => {
  const data = await Turnover.findByPk(id).catch((err) => {
    log4j.loggerinfo.error(err.message);
    return null;
  });
  return data;
};

// Update a Turnover by the id in the request
exports.update = async (var_turnover, id) => {
  const num = await Turnover.update(var_turnover, {
    where: { id: id },
  }).catch((err) => {
    log4j.loggerinfo.error(err.message);
    return 0;
  });
  return num;
};

// Delete a Turnover with the specified id in the request
exports.delete = async (req) => {
  const id = req.params.id;
  const num = await Turnover.destroy({
    where: { id: id },
  }).catch((err) => {
    log4j.loggerinfo.error(err.message);
    return 0;
  });
  return num;
};

// Delete all Turnovers from the database.
exports.deleteAll = async (req) => {
  const num = await Turnover.destroy({
    where: {},
    truncate: false,
  }).catch((err) => {
    log4j.loggerinfo.error(err.message);
    return null;
  });
  return num;
};

exports.countLots = async (req) => {
  const { kioskid, startdate, enddate } = req.query;
  var conditionkioskid = kioskid ? { kioskId: `${kioskid}` } : null;
  var conditionstartdate = startdate
    ? { createdAt: { [Op.gte]: `${startdate}` } }
    : null;
  var conditionenddate = enddate
    ? { createdAt: { [Op.lte]: `${enddate}` } }
    : null;

  const data = await Turnover.count({
    where: {
      [Op.and]: [conditionkioskid, conditionstartdate, conditionenddate],
    },
  }).catch((err) => {
    log4j.loggerinfo.error(err.message);
    return null;
  });
  return data;
};
