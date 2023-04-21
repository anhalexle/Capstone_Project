const AppError = require('../utils/appError.util');

const sendErrorDev = (err, req, res) => {
  // A) API

  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
  // B) RENDERED WEBSITE
  // console.error('ERROR 💥', err);
  // return res.status(err.statusCode).render('error', {
  //   title: 'Something went wrong',
  //   msg: err.message,
  // });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV !== 'production') {
    sendErrorDev(err, req, res);
  }
};
