const mongoose = require('mongoose');

const messCutSchema = new mongoose.Schema({
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  }
});

const MessCut = mongoose.model('MessCut', messCutSchema);

module.exports = MessCut;
