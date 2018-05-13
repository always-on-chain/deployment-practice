import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Events from './components/Events.jsx';
import Button from 'react-bootstrap/lib/Button';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      button: 'relevance'
    };
  }

  fetch(sort) {
    $.ajax({
      method: 'GET',
      url: `http://localhost:3000/events/${sort}`,
      contentType: 'application/json',
      success: (data) => {
        this.setState({ events: data });
        console.log('success with data ', data)
      },
      error: (error) => {
        console.log('ERROR on ajax Get request', error);
      }
    })
  }

  componentWillMount() {
    this.fetch(this.state.button);
    // this.fetch('meetup')
  }

  handleClick(sort) {
    this.setState({button: sort}, ()=> {
      console.log('currentState', this.state.button)
      this.fetch(this.state.button);
    });
    
  }

  render() {
    return (
    <div id="container">
      <div id="sort">
        <Button onClick={()=> {this.handleClick('relevance');}} bsStyle="info">Relevance</Button> 
        <Button onClick={()=> {this.handleClick('date');}} bsStyle="info">Date</Button>
      </div>
      <Events events={this.state.events} /> 
    </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));

