module.exports = app => {
  const user = require('../../controllers/user/user.controller')
  const usermiddleware = require('../../middleware/user/user.middleware')
  let jwt = require('../../middleware/user/jwtuser')
  var router = require('express').Router()

  router.post(
    '/add',
    jwt.checkToken,
    jwt.isAdmin,
    usermiddleware.create(),
    user.create
  )
  // Retrieve all users from the database.
  router.get('/findall', jwt.checkToken, jwt.isAdmin, user.findAll)
  // Retrieve all Users(id,firstname,lastname) from the database.
  router.get(
    '/findallsmall',
    jwt.checkToken,
    jwt.forAll,
    user.findAllwithspecificattributes
  )
  //Retrieve lot of users from database based on parameters (filter paging)
  router.get('/get', jwt.checkToken, jwt.isAdmin, user.findLots)
  //get active user numbers
  router.get('/getnbuser', jwt.checkToken, jwt.isAdminAndFinancial, user.getnbuser)
  // Find a single user with an id
  router.get(
    '/get/:id',
    jwt.checkToken,
    jwt.forAll,
    usermiddleware.find(),
    user.findOne
  )
  // Update a user by the id in the request
  router.put(
    '/update/:id',
    jwt.checkToken,
    jwt.isAdmin,
    usermiddleware.find(),
    usermiddleware.create(),
    user.update
  )
  router.patch(
    '/updatestatus/:id',
    jwt.checkToken,
    jwt.isAdmin,
    usermiddleware.enable(),
    user.setstatus
  )
  router.patch(
    '/updatepassword/',
    jwt.checkToken,
    jwt.forAll,
    usermiddleware.editpwt(),
    user.updatepassword
  )
  // Delete a user with the specified id in the request
  router.delete(
    '/delete/:id',
    jwt.checkToken,
    jwt.isAdmin,
    usermiddleware.find(),
    user.delete
  )
  // Delete all users from the database.
  router.delete('/deleteall', jwt.checkToken, jwt.isAdmin, user.deleteAll)
  app.use('/api/user', router)
}
