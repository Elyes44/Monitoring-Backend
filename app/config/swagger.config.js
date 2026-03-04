module.exports = {
  option: {
    info: {
      title: 'monitoringkiosk',
      description: 'Standard API for Monitoring Kiosk'
    },
    host: 'localhost:8282',
    schemes: ['http']
  },
  endpointsFiles: [
    './app/routes/user/authuser.route',
    './app/routes/user/user.route',
    './app/routes/user/kiosk.route',
    './app/routes/user/device.route',
    './app/routes/user/transaction.route',
    './app/routes/kiosk/authkiosk.route',
    './app/routes/kiosk/cashbox.route',
    './app/routes/kiosk/topnet.route',
    './app/routes/kiosk/panne.route'
  ],
  outputFile: './swagger.json'
}
