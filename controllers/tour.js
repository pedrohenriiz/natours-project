const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkId = (request, response, next, value) => {
  if (Number(request.params.id) > tours.length) {
    return response.status(400).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};

exports.checkBody = (request, response, next) => {
  if (!request.body.name || !request.body.price) {
    return response.status(400).json({
      status: 'fail',
      message: 'Missing name or price',
    });
  }
  next();
};

exports.listTours = (request, response) => {
  console.log(request.requestTime);
  response.status(200).json({
    status: 'success',
    requestedAt: request.requestTime,
    results: tours.length,
    data: { tours },
  });
};

exports.showTour = (request, response) => {
  const id = request.params.id * 1;
  const tour = tours.find((tour) => tour.id === id);

  response.status(200).json({
    status: 'success',
    data: { tour },
  });
};

exports.createTour = (request, response) => {
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

exports.updateTour = (request, response) => {
  response.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};

exports.deleteTour = (request, response) => {
  // 204 -> Means no content - delete successfully
  response.status(204).json({
    status: 'success',
    data: null,
  });
};
