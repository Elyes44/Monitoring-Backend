const db = require("./app/models");
const Users = db.users;
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const app = express();
const log4j = require("./app/config/configLog4js.js");
var corsOptions = {
  origin: "*",
};

app.use(cors());
// parse requests of content-type - application/json
app.use(express.json());
//--------------------------------

function initial() {
  try {
    Users.findOne({
      where: {
        username: "user001",
      },
    }).then((user) => {
      if (!user) {
        Users.create({
          enable: 1,
          firstname: "Borne",
          lastname: "Admin",
          email: "user@usr.tn",
          telephone: "97026387",
          address: "user",
          username: "user001",
          password: bcrypt.hashSync("user001", 8),
          roles: ["admin"],
          createdBy: "server",
        });
      }
      log4j.loggerinfo.info("in function initial ==>successfully");
    });
  } catch (error) {
    log4j.loggerinfo.info("in function initial ==>" + error.message);
  }
}
//In development, you may need to drop existing tables and re-sync database. Just use force: true
db.sequelize.sync({ alter: true }).then(() => {
  log4j.loggerinfo.info("****All models were synchronized successfully.");
  initial();
});
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

/* swaggerAutogen(
  swagger_config.outputFile,
  swagger_config.endpointsFiles,
  swagger_config.option
).then(async () => {
  await import('./server.js') // Your project's root file
}) */
//-------------------------
require("./app/routes/user/authuser.route")(app);
require("./app/routes/user/user.route")(app);
require("./app/routes/user/kiosk.route")(app);
require("./app/routes/user/device.route")(app);
require("./app/routes/user/transaction.route")(app);
require("./app/routes/user/turnover.route")(app);
require("./app/routes/user/notification.route")(app);
require("./app/routes/user/panne.route")(app);
require("./app/routes/user/cashbox.route")(app);
require("./app/routes/user/payout.route")(app);
require("./app/routes/kiosk/authkiosk.route")(app);
require("./app/routes/kiosk/kiosk.route")(app);
require("./app/routes/kiosk/cashbox.route")(app);
require("./app/routes/kiosk/topnet.route")(app);
require("./app/routes/kiosk/panne.route")(app);
require("./app/routes/kiosk/notification.route")(app);
require("./app/routes/kiosk/transaction.route.js")(app);
require("./app/routes/kiosk/feeding.route.js")(app);

// set port, listen for requests
app.get("/", (req, res) => {
  res.json({ message: "Welcome my application  monitoring Topnet" });
  log4j.loggerinfo.info("Welcome my application  monitoring Topnet");
});
// set port, listen for requests
const PORT = 5566;
app.listen(PORT, () => {
  log4j.loggerdebug.debug(`Server monitoring is running on port ${PORT}.`);
});
