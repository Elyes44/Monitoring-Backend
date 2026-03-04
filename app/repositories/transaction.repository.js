const db = require("../models");
const Transactions = db.transactions;
const sequelize = require("sequelize");
const Op = sequelize.Op;
const log4j = require("../config/configLog4js.js");

const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};
const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: transactions } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, transactions, totalPages, currentPage };
};
// Create and Save a new Transaction
exports.create = async (var_transaction) => {
  const data = await Transactions.create(var_transaction).catch((err) => {
    log4j.loggerinfo.error(
      err.errors[0].message + " ==> " + err.errors[0].instance
    );
    return null;
  });
  return data;
};
// get number Transactions in period
exports.getnbtransaction = async (firstDay, lastDay, kioskId) => {
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
  const data = await Transactions.count({
    where: {
      [Op.and]: [conditionperiod, conditionkioskid],
    },
  }).catch((err) => {
    log4j.loggerinfo.error(
      err.errors[0].message + " ==> " + err.errors[0].instance
    );
    return null;
  });
  return data;
};
// Retrieve all Transactions from the database.
exports.findAll = async () => {
  const data = await Transactions.findAndCountAll({
    where: {},
    order: [["createdAt", "DESC"]],
  }).catch((err) => {
    log4j.loggerinfo.error(err.message);
    return null;
  });
  return data;
};

// Retrieve all with pagination and/or filtre Transactions from the database.
exports.findLots = async (req) => {
  console.log("\n*************************************\n" + req.query);

  const { page, size, kioskid, status, startdate, enddate } = req.query;

  var conditionstatus = status ? { status: `${status}` } : null;
  var conditionkioskid = kioskid ? { kioskId: `${kioskid}` } : null;

  var conditionstartdate = startdate
    ? { createdAt: { [Op.gte]: `${startdate}` } }
    : null;
  var conditionenddate = enddate
    ? { createdAt: { [Op.lte]: `${enddate}` } }
    : null;
  const { limit, offset } = getPagination(page, size);

  const data = await Transactions.findAndCountAll({
    where: {
      [Op.and]: [
        conditionstatus,
        conditionkioskid,
        conditionstartdate,
        conditionenddate,
      ],
    },
    offset: offset,
    limit: limit,
    order: [["createdAt", "DESC"]],
  }).catch((err) => {
    log4j.loggerinfo.error(err.message);
    return null;
  });
  console.log(data);

  const response = getPagingData(data, page, limit);
  return response;
};

// Find a single Transaction with an id
exports.findOne = async (req) => {
  const id = req.params.id;
  const data = await Transactions.findByPk(id).catch((err) => {
    log4j.loggerinfo.error(err.message);
    return null;
  });
  return data;
};

// Update a Transaction by the id in the request
exports.update = async (var_transaction, id) => {
  const num = await Transactions.update(var_transaction, {
    where: { id: id },
  }).catch((err) => {
    log4j.loggerinfo.error(err.message);
    return 0;
  });
  return num;
};

// Delete a Transaction with the specified id in the request
exports.delete = async (req) => {
  const id = req.params.id;
  const num = await Transactions.destroy({
    where: { id: id },
  }).catch((err) => {
    log4j.loggerinfo.error(err.message);
    return 0;
  });
  return num;
};

// Delete all Transactions from the database.
exports.deleteAll = async (req) => {
  const num = await Transactions.destroy({
    where: {},
    truncate: false,
  }).catch((err) => {
    log4j.loggerinfo.error(err.message);
    return null;
  });
  return num;
};

exports.countLots = async (req) => {
  const { status, kioskid, startdate, enddate } = req.query;
  var conditionstatus = status ? { status: `${status}` } : null;
  var conditionkioskid = kioskid ? { kioskId: `${kioskid}` } : null;
  var conditionstartdate = startdate
    ? { createdAt: { [Op.gte]: `${startdate}` } }
    : null;
  var conditionenddate = enddate
    ? { createdAt: { [Op.lte]: `${enddate}` } }
    : null;

  const data = await Transactions.count({
    where: {
      [Op.and]: [
        conditionstatus,
        conditionkioskid,
        conditionstartdate,
        conditionenddate,
      ],
    },
  }).catch((err) => {
    log4j.loggerinfo.error(err.message);
    return null;
  });
  return data;
};
