import React, { Component } from 'react';
import './App.css';
import CoronaTracker from './containers/CoronaTracker/CoronaTracker';

class App extends Component {
  render() {
    return (
      <div className="App">
        <CoronaTracker />          
      </div>
    );
  }
}

export default App;
