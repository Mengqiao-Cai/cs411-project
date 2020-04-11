// Import the express library here
const express = require('express');
// Instantiate the app here
const app = express();

// Use static server to serve the Express Yourself Website
app.use(express.static('public'));

var request = require('request');
  var options = {
  'method': 'GET',
  'url': 'https://app.ticketmaster.com/discovery/v2/events.json?city=Boston&apikey=bmaBdvvoasFwssS77Hqo2xUwqQJAeFPh',
  'headers': {
    'Cookie': 'TMSO=seed=1daad088cf24&exp=1586629516&kid=key1&sig=0x4ce6c5d5ddef1485eca8c516309683d7597d067614bf7aa50210176cab6dc697a4f96ef0f9488028dd83429991ec6ac77e0fc70c49697590fedf25a8098384ba'
  }
};

app.get('/events', (req, res) => {
  request(options, function (error, response) { 
    if (error) throw new Error(error);
    var events =  JSON.parse(response.body);
    res.send(events)
  });
});

const PORT = process.env.PORT || 3000;

// Invoke the app's `.listen()` method below:
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
