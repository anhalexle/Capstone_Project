const path = require('path');

const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

const AppError = require('./src/utils/appError.util');

// Router
const dataRouter = require('./src/routes/data.route');
const userRouter = require('./src/routes/user.route');
const alarmRouter = require('./src/routes/alarm.route');
const emailRouter = require('./src/routes/email.route');

// Controller
const globalErrorHandler = require('./src/controllers/error.controller');

// // View engine
// app.set('view engine', 'pug');
// app.set('views', path.join(__dirname, 'src\\views'));

// Middleware
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}
app.use('/api/v1/data', dataRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/alarms', alarmRouter);
app.use('/api/v1/email', emailRouter);
app.all('*', (req, res, next) => {
  // Express automatically assumes that every argument passed in is an error
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 400));
});
app.use(globalErrorHandler);

module.exports = app;
