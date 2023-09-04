import React from 'react';

import logo from './logo.svg';
import './App.css';
import MyFormComponent from './MyFormComponent';
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <MyFormComponent />
    </div>
  );
}

export default App;
