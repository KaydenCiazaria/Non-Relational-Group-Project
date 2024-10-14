const sampleModel = require('../model/sampleModel'); //Import sampleModel from Model folder
const factory = require('./handlerFactory');

exports.function_name = factory.getAll(sampleModel); // factory.(choose_function)(Model)