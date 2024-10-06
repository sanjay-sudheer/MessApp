// models/inmateModel.js

const mongoose = require('mongoose');

const inmateSchema = new mongoose.Schema({
  admissionNumber: { type: String, required: true, unique: true },  
  roomNumber: { type: String, required: true },                     
  name: { type: String, required: true },                           
  department: { type: String, required: true },                     
  year: { type: Number, required: true },                           
  batch: { type: String, required: true },                          
});

module.exports = mongoose.model('Inmate', inmateSchema, 'inmates');
