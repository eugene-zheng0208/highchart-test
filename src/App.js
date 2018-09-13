import React, { Component } from 'react';
import './App.css';

import TabView from './components/TabView'

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Bitcoin-Ethereum</h1>
        <TabView />
      </div>
    );
  }
}

export default App;
