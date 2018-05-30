const mongoose = require('mongoose');
console.log('here is process', process.env.DB_USERNAME);
mongoose.connect(`mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@ds239930.mlab.com:39930/heroku_nbjsdbvn`);

const eventSchema = mongoose.Schema({
  id: {type: String, unique: true},
  name: String,
  start: String,
  end: String,
  url: String,
  address: String,
  city: String,
  image: String,

});

const Event = mongoose.model('Events', eventSchema);

const venues = [];

const getVenues = (venue) => {
  let venueObj = JSON.parse(venue);
  let venueObjInserted = false;
  for (var i = 0; i < venues.length; i++) {
    if (venues[i].id === venueObj.id) {
      venueObjInserted = true;
    }
  }
  if (!venueObjInserted) {
    venues.push(JSON.parse(venue));
  }
}

let save = (events) => {
  let event;
  let venueID;
  let venueAddress;
  let venueCity;

  for (var i = 0; i < events.length; i++) {
    venueID = events[i].venue_id;
    for (var j = 0; j < venues.length; j++) {
      if (venues[j].id === venueID) {
        venueAddress = venues[j].address.address_1;
        venueCity = venues[j].address.city;

        if (events[i].logo === null) {
          events[i].logo = {url: 'https://cdn.evbstatic.com/s3-build/perm_001/f8c5fa/django/images/discovery/default_logos/4.png'}
        }

        if (venueAddress === null) {
          venueAddress = 'The venue to be confirmed later. Stay tuned!'
        }

        event = new Event ({
          id: events[i].id,
          name: events[i].name.text,
          start: events[i].start.local,
          end: events[i].end.local,
          url: events[i].url,
          address: venueAddress,
          city: venueCity,
          image: events[i].logo.url
        })

        event.save((err) => {
          // if (err) return console.error(err);
        });
      }
    }
  }
}

let get = (callback, sort) => {
  if (sort === 'relevance') {
    Event.find((err, events) => {
      if (err) return console.log('ERROR on Find on relevance sort', err);
      callback(events);
    })
  } else {
    Event.find((err, events) => {
      if (err) return console.log('ERROR on Find on date sort', err);
      callback(events);
    })
    .sort({ start: 1 })
  }
  
}

module.exports.save = save;
module.exports.get = get;
module.exports.getVenues = getVenues;



