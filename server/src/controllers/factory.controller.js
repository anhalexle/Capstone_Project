const catchAsync = require('../utils/catchAsync.util');
const APIFeature = require('../utils/apiFeatures.util');
const AppError = require('../utils/appError.util');

class CRUDFactory {
  constructor(Model) {
    this.Model = Model;
  }

  getAll() {
    return catchAsync(async (req, res, next) => {
      const features = new APIFeature(this.Model.find({}), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
      const allDoc = await features.query;

      res.status(200).json({
        status: 'success',
        results: allDoc.length,
        data: {
          data: allDoc,
        },
      });
    });
  }

  getOne() {
    return catchAsync(async (req, res, next) => {
      const doc = await this.Model.findById(req.params.id);
      if (!doc) return next(new AppError('No doc found with that id', 404));
      res.status(200).json({
        status: 'success',
        data: {
          data: doc,
        },
      });
    });
  }

  createOne() {
    return catchAsync(async (req, res, next) => {
      const newDoc = await this.Model.create(req.body);
      res.status(201).json({
        status: 'success',
        data: {
          data: newDoc,
        },
      });
    });
  }

  updateOne() {
    return catchAsync(async (req, res, next) => {
      const updatedDoc = await this.Model.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!updatedDoc)
        return next(new AppError('No doc found with that id', 404));
      res.status(200).json({
        status: 'success',
        data: {
          data: updatedDoc,
        },
      });
    });
  }

  deleteOne() {
    return catchAsync(async (req, res, next) => {
      const doc = await this.Model.findByIdAndDelete(req.params.id);
      if (!doc) return next(new AppError('No doc found with that id', 404));
      res.status(204).json({
        status: 'success',
        data: null,
      });
    });
  }
}

module.exports = CRUDFactory;
