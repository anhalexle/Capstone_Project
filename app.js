const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const app = express();
const server = require('http').createServer(app);

// Router
const dataRouter = require('./src/routes/data.route');
const userRouter = require('./src/routes/user.route');

// Controller
const globalErrorHandler = require('./src/controllers/error.controller');

// Middleware
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}
app.use('/api/v1/data', dataRouter);
app.use('/api/v1/users', userRouter);
app.use(globalErrorHandler);

module.exports = server;
