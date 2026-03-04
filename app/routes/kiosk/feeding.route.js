module.exports = (app) => {
  const feed = require("../../controllers/kiosk/feeding.controller");
  let jwtkiosk = require("../../middleware/kiosk/jwtkiosk");
  const feedMiddleware = require("../../middleware/kiosk/feeding.middleware");

  var router = require("express").Router();

  router.post(
    "/add",
    jwtkiosk.checkToken,
    jwtkiosk.isKiosk,
    feedMiddleware.create(),
    feed.create
  );

  app.use('/api/feeding', router)

};
