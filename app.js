const fs = require('fs');
const express = require('express');
const app = express();

// Add middleware to modify the request -> Add values to request.body
app.use(express.json());

// app.get('/', (request, response) => {
//   response.status(200).json({
//     message: 'Hello from the server side!',
//     app: 'Natours',
//   });
// });

// app.post('/', (request, response) => {
//   response.status(200).send('You can post to this endpoint!');
// });

// Route handler => Callback

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (request, response) => {
  response.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
});

app.get('/api/v1/tours/:id', (request, response) => {
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
});

app.post('/api/v1/tours', (request, response) => {
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
});

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
