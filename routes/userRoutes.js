const express = require('express');
const router = express.Router();
const userController = require('./../controllers/user');

router.route('/').get(userController.listUsers).post(userController.createUser);

router
  .route('/:id')
  .get(userController.showUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
