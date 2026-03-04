const db = require("../models");
const Feedings = db.feedings;

const sequelize = require("sequelize");
const Op = sequelize.Op;
const log4j = require("../config/configLog4js.js");

const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};
const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: feedings } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, feedings, totalPages, currentPage };
};
// Create and Save a new feedings
exports.create = async (var_feeding) => {
  console.log(var_feeding);
  const data = await Feedings.create(var_feeding).catch((err) => {
    log4j.loggerinfo.error(
      err.errors[0].message + " ==> " + err.errors[0].instance
    );
    return null;
  });
  return data;
};

// Retrieve all feedings from the database.
exports.findAll = async () => {
  const data = await Feedings.findAndCountAll({
    where: {},
    order: [["createdAt", "DESC"]],
  }).catch((err) => {
    log4j.loggerinfo.error(err.message + " ==> " + err.parent.detail);
    return null;
  });
  return data;
};

// Retrieve all with pagination and/or filtre feedings from the database.
exports.findLots = async (req) => {
  const { page, size, kioskid, type, status, startdate, enddate } = req.query;
  var conditionkioskid = kioskid ? { createdBy: `${kioskid}` } : null;
  var conditiontype = type ? { type: `${type}` } : null;
  var conditionstatus = status ? { status: `${status}` } : null;
  var conditionstartdate = startdate
    ? { createdAt: { [Op.gte]: `${startdate}` } }
    : null;
  var conditionenddate = enddate
    ? { createdAt: { [Op.lte]: `${enddate}` } }
    : null;
  const { limit, offset } = getPagination(page, size);

  const data = await Feedings.findAndCountAll({
    where: {
      [Op.and]: [
        conditionkioskid,
        conditiontype,
        conditionstatus,
        conditionstartdate,
        conditionenddate,
      ],
    },
    offset: offset,
    limit: limit,
    order: [["createdAt", "DESC"]],
  }).catch((err) => {
    log4j.loggerinfo.error(err.message + " ==> " + err.parent.detail);
    return null;
  });
  const response = getPagingData(data, page, limit);
  return response;
};

// Find a single feedings with an id
exports.findOne = async (id) => {
  const data = await Feedings.findByPk(id).catch((err) => {
    log4j.loggerinfo.error(err.message + " ==> " + err.parent.detail);
    return null;
  });
  return data;
};

// Update a feedings by the id in the request
exports.update = async (var_feeding, id) => {
  /*  const id = req.params.id
  const var_feeding = {
    ftype: req.body.ftype,
    amount: req.body.amount,
    datekiosk: req.body.datekiosk,
    cashboxId: req.body.cashboxid,
    updatedBy: req.decoded.decoded.id,
    updatedAt: Date.now
  } */
  const num = await Feedings.update(var_feeding, {
    where: { id: id },
  }).catch((err) => {
    log4j.loggerinfo.error(err.message + " ==> " + err.parent.detail);
    return 0;
  });
  return num;
};

// Delete a feedings with the specified id in the request
exports.delete = async (req) => {
  const id = req.params.id;
  const num = await Feedings.destroy({
    where: { id: id },
  }).catch((err) => {
    log4j.loggerinfo.error(err.message + " ==> " + err.parent.detail);
    return 0;
  });
  return num;
};

// Delete all feedings from the database.
exports.deleteAll = async (req) => {
  const num = await Feedings.destroy({
    where: {},
    truncate: false,
  }).catch((err) => {
    log4j.loggerinfo.error(err.message + " ==> " + err.parent.detail);
    return null;
  });
  return num;
};
exports.setstatus = async (status, id) => {
  if (status == "failed" || status == "success") {
    const num = await Feedings.update(
      {
        status: status,
      },
      {
        where: { id: id },
      }
    ).catch((err) => {
      log4j.loggerinfo.error(err.message + " ==> " + err.parent.detail);
      return 0;
    });
    return num;
  } else {
    return 0;
  }
};

// Retrieve all with pagination and/or filtre Hitoryfeeding from the database.
exports.finddetailsfeeding = async (feedingid) => {
  const data = await db.sequelize
    .query(
      "SELECT DISTINCT  hf.money,hf.id, (hf.newnumber-hf.oldnumber) As number,hf.diffrenceserver, fd.diffrencekiosk, hf.status  " +
        "  FROM public.hitoryfeedings hf, public.feedingdetails fd  " +
        '  WHERE fd."feedingId"=hf."feedingId" AND hf.money=fd.money  AND fd."feedingId"=?' /*  +
        'GROUP By  hf.money' */,
      { replacements: [feedingid], type: sequelize.QueryTypes.SELECT }
    )
    .catch((err) => {
      log4j.loggerinfo.error(err);
      return null;
    });
  return data;
};
