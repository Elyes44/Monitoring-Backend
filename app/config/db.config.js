// module.exports = {
//     HOST: "localhost",
//     USER: "postgres",
//     PASSWORD:"HAZEM",
//     // PASSWORD: "awt3orfIphsIv",
//     DB: "chuMonitoring",
//     dialect: "postgres",
//     pool: {
//       max: 5,
//       min: 0,
//       acquire: 30000,
//       idle: 10000
//     }
//   };


module.exports = {
  HOST: process.env.DB_HOST || "db",
  USER: process.env.DB_USER || "postgres",
  PASSWORD: process.env.DB_PASSWORD || "HAZEM",
  DB: process.env.DB_NAME || "chuMonitoring",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};