const { promisify } = require('util');

const jwt = require('jsonwebtoken');

const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync.util');
const AppError = require('../utils/appError.util');

const signToken = (payload) =>
  jwt.sign({ id: payload }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendTokenToClient = (user, statusCode, req, res) => {
  const token = signToken(user._id);
  // send JWT via cookie
  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    // cannot be access or modified everywhere in the browser
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'],
  });

  // Remove password from the output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    roles: user.role,
    // data.user.role
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  // TOKEN EXPIRE OPTIONS

  createSendTokenToClient(newUser, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // Check if email and password are correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new AppError('Invalid email or password', 401));
  }

  // If ok, send token to client
  createSendTokenToClient(user, 200, req, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Get token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access ')
    );
  }

  // 2 Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3 Check if user still exist
  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(
      new AppError('The user belonging to this token does no longer exist', 401)
    );

  // Kiểm tra xem user có đổi mật khẩu sau khi cái JWT được cấp (JWT issued iat)
  if (currentUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'The user has recently changed the password. Please login again',
        401
      )
    );
  }
  // Grant access to protected route
  req.user = currentUser;
  next();
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    next();
  };

exports.logout = catchAsync(async (req, res, next) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
});
