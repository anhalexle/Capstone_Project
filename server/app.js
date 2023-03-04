const path = require('path');

const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const pug = require('pug');

const app = express();
const server = require('http').createServer(app);

// Router
const dataRouter = require('./src/routes/data.route');
const userRouter = require('./src/routes/user.route');
const alarmRouter = require('./src/routes/alarm.route');

// Controller
const globalErrorHandler = require('./src/controllers/error.controller');

// View engine
app.set('view engine', pug);
app.set('views', path.join(__dirname, 'views'));

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
app.use(globalErrorHandler);

module.exports = server;
