// Load required packages
var mongoose = require('mongoose');

// Define our device schema
var DeviceSchema   = new mongoose.Schema({
  name: String,
  type: String,
  quantity: Number
});

// Export the Mongoose model
module.exports = mongoose.model('Device', DeviceSchema);
