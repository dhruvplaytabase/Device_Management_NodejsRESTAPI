// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Device = require('./models/device');


// Connect to the devicelocker MongoDB
mongoose.connect('mongodb://localhost:27017/pdevices');


// Create our Express application
var app = express();

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
   extended: true
}));

// Use environment defined port or 3000
var port = process.env.PORT || 3000;

// Create our Express router
var router = express.Router();

// Initial dummy route for testing
// http://localhost:3000/api
router.get('/', function(req, res) {
  res.json({ message: 'Hey Dude!!!! Explore the magic & add more deivces' });
});


// Create a new route with the prefix /devices
var devicesRoute = router.route('/devices');

// Create endpoint /api/devices for POSTS
devicesRoute.post(function(req, res) {
  // Create a new instance of the Devices model
  var device = new Device();

  // Set the beer properties that came from the POST data
  device.name = req.body.name;
  device.type = req.body.type;
  device.quantity = req.body.quantity;

  // Save the device and check for errors
  device.save(function(err) {
    if (err)
      res.send(err);

    res.json({ message: 'Device added to the collection!', data: device });
  });
});


// Create endpoint /api/devices for GET
devicesRoute.get(function(req, res) {
  // Use the Beer model to find all beer
  Device.find(function(err, devices) {
    if (err)
      res.send(err);

    res.json(devices);
  });
});


// Create a new route with the /devices/:device_id prefix
var deviceRoute = router.route('/devices/:device_id');

// Create endpoint /api/devices/:device_id for GET
deviceRoute.get(function(req, res) {
  // Use the device model to find a specific device
  Device.findById(req.params.device_id, function(err, device) {
    if (err)
      res.send(err);

    res.json(device);
  });
});

// Create endpoint /api/devices/:device_id for PUT
deviceRoute.put(function(req, res) {
  // Use the Device model to find a specific device
  Device.findById(req.params.device_id, function(err, device) {
    if (err)
      res.send(err);

    // Update the existing device quantity
    device.quantity = req.body.quantity;

    // Save the device and check for errors
    device.save(function(err) {
      if (err)
        res.send(err);

      res.json(device);
    });
  });
});



// Create endpoint /api/devices/:device_id for DELETE
deviceRoute.delete(function(req, res) {
  // Use the Device model to find a specific device and remove it
  Device.findByIdAndRemove(req.params.device_id, function(err) {
    if (err)
      res.send(err);

    res.json({ message: 'Device removed from the locker!' });
  });
});



// Register all our routes with /api
app.use('/api', router);

// Start the server
app.listen(port);
console.log('Add a device on port ' + port);
