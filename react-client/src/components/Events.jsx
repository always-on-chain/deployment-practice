import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

const Events = (props) => {

  return (
  <div id="events">
    {props.events.length > 0 ? props.events.map((event) => {
      let index = event.start.search('T') + 1;
      let time = event.start.slice(index, index + 5);
      let date = new Date(event.start).toDateString();
      let convertedDate = date.slice(0, 10);
      let splitSourceUrl = event.url.split('.').includes('eventbrite');
      let source; 
      console.log('source url', splitSourceUrl)
      if (splitSourceUrl) {
        source = '/images/Eventbrite_wordmark_orange.jpg'
      }    
      
      return (
      <div id="event">
        <div id="image"><img src={event.image} /></div>
        <div id="event-info">
          <div id="time">{convertedDate} {moment().format(time + ' a')} </div>
          <div id="name"><a href={event.url} target="_blank">{event.name}</a></div>
          <div id="address">{event.address}, </div>
          <div id="city">{event.city}</div>
          <div id="source">Source: <img src={source} id="source-image"/></div>
        </div>
      </div>
      )
    }) : ''}
  </div>
  )
};

export default Events;