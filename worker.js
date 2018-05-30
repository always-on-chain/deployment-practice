const request = require('request');
const mongoose = require('mongoose');
const config = require('./config.js');
const database = require('./database/events.js');
const Promise = require('bluebird');
const rp = require('request-promise');

mongoose.connect(`mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@ds239930.mlab.com:39930/heroku_nbjsdbvn`);

const getEventsFromEB = () => {
  let events = {
    url: `
    https://www.eventbriteapi.com/v3/events/search/?token=${config.EventBrightToken}
    &location.address=${'San Francisco'}
    &q=${'blockchain'}
    `,
    headers: {
      'User-Agent': 'request',
      'Authorization': `Bearer ${config.EventBrightToken}`
    }
  };

  return new Promise ((resolve, reject) => {
    rp(events)
      .then((events) => {
        events = JSON.parse(events).events;
        database.save(events);
        return events;
      })
      .then((events) => {
        let promises = [];

        for (var i = 0; i < events.length; i++) {
          let venue = JSON.parse(events[i].venue_id);
          let location = {
            url: `https://www.eventbriteapi.com/v3/venues/${venue}/?token=${config.EventBrightToken}`,
            headers: {
              'User-Agent': 'request',
              'Authorization': `Bearer ${config.EventBrightToken}`
            }
          }
          let locationPromise = rp(location)
            .then((location) => {
              database.getVenues(location);
            })
            promises.push(locationPromise);
        }
        Promise.all(promises)
          .then(resolve)
          .catch((err) => {
            reject(err)
          });
      })
  })
}

// const getEventsFromMeetup = () => {
//   let options = {
//     // url: `https://api.meetup.com/2/events?key=${config.MeetupToken}&group_urlname=ny-tech&sign=true`,
//     url: `https://api.meetup.com/find/upcoming_events?&sign=true&photo-host=public&page=20&text=blockchain&key=${config.MeetupToken}`,
//     // url: `https://api.meetup.com/find/upcoming_events?key=${config.MeetupToken}&photo-host=public&text='blockchain'&zip=94102&radius=10&sign=true`,
//     headers: {
//       'User-Agent': 'request',
//       'Authorization': `Bearer ${config.MeetupToken}`
//     }
//   };

//   request(options, (error, response, body) => {
//     console.log('error:', error); 
//     console.log('statusCode:', response.statusCode);
//     console.log('body:', body);
//   });
// }

module.exports.getEventsFromEB = getEventsFromEB;
// module.exports.getEventsFromMeetup = getEventsFromMeetup;


