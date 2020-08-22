const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const app = express();

// Add middleware to modify the request -> Add values to request.body
app.use(express.json());

// Middlewares

app.use(morgan('dev'));

app.use((request, response, next) => {
  console.log('Hello from the middleware');
  // Never forget to use next in middleware!
  next();
});

app.use((request, response, next) => {
  request.requestTime = new Date().toISOString();
  next();
});

// Route handler => Callback

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// Route handlers

const listTours = (request, response) => {
  console.log(request.requestTime);
  response.status(200).json({
    status: 'success',
    requestedAt: request.requestTime,
    results: tours.length,
    data: { tours },
  });
};

const showTour = (request, response) => {
  const id = request.params.id * 1;
  const tour = tours.find((tour) => tour.id === id);

  if (!tour) {
    return response.status(400).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  response.status(200).json({
    status: 'success',
    data: { tour },
  });
};

const createTour = (request, response) => {
  // console.log(request.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, request.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      // 201 Code means that a new object/value is created
      response.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (request, response) => {
  if (Number(request.params.id) > tours.length) {
    return response.status(400).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  response.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};

const deleteTour = (request, response) => {
  if (Number(request.params.id) > tours.length) {
    return response.status(400).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  // 204 -> Means no content - delete successfully
  response.status(204).json({
    status: 'success',
    data: null,
  });
};

// Routes
// PUT -> Entire object
// PATCH -> Update specific properties

app.route('/api/v1/tours').get(listTours).post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(showTour)
  .patch(updateTour)
  .delete(deleteTour);

// Server
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
