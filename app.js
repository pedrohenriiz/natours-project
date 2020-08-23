const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const app = express();

// Middlewares
// Add middleware to modify the request -> Add values to request.body
app.use(express.json());

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

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Server
module.exports = app;
