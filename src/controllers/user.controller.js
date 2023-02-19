const CRUDFactory = require('./factory.controller');
const User = require('../models/user.model');

// CRUDFactory
exports.getAllUser = new CRUDFactory(User).getAll();
exports.getUser = new CRUDFactory(User).getOne();
exports.createUser = new CRUDFactory(User).createOne();
exports.updateUser = new CRUDFactory(User).updateOne();
exports.deleteUser = new CRUDFactory(User).deleteOne();
