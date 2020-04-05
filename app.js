// Import the express library here
const express = require('express');
// Instantiate the app here
const app = express();

//I have to somehow get this server to get requests from this url and not the array I made
url = "https://app.ticketmaster.com/discovery/v2/events.json?size=1&apikey=bmaBdvvoasFwssS77Hqo2xUwqQJ"

// Use static server to serve the Express Yourself Website
app.use(express.static('public'));

const events = [
    {artist: 'JustinBeiber', date: '04/25/2020'},
    {artist: 'TaylorSwift', date: '05/01/2020'}
]

app.get('/events', (req, res, next) => {
    // Here we would send back the events array in response
    res.send(events)
  });

app.get('/events/:artist', (req, res) => {
    const foundEvent = events.find(e => e.artist === (req.params.artist));
    if (!foundEvent) res.status(404).send("the event with the given artist is not found");
    res.send(foundEvent);
});

const PORT = process.env.PORT || 3000;

// Invoke the app's `.listen()` method below:
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

