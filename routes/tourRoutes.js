const express = require('express');
const tourController = require('../controllers/tour');

const router = express.Router();

router.param('id', tourController.checkId);

router
  .route('/')
  .get(tourController.listTours)
  .post(tourController.checkBody, tourController.createTour);

router
  .route('/:id')
  .get(tourController.showTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
