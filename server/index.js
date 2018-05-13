const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const worker = require('../worker.js');
const database = require('../database/events.js');

app.use(express.static(__dirname + '/../react-client/dist'));

app.get('/events/relevance', (req, res) => {
  worker.getEventsFromEB();
  database.get((events) => {
    res.send(events);
  }, 'relevance')
})

app.get('/events/date', (req, res) => {
  worker.getEventsFromEB();
  database.get((events) => {
    res.send(events);
  }, 'date')
})

// app.get('/events/meetup', (req, res) => {
//   worker.getEventsFromMeetup();
//   // database.get((events) => {
//   //   res.send(events);
//   // }, 'date')
// })

const port = 3000;

app.listen(port, () => {
  console.log('listening on port ' + port);
})
