import React from 'react';
import './App.css';
import Upload from './components/Upload';
import { List } from './components/List';

function App() {
    return (
    <div className="App">
      <header className="App-header">
        <Upload />
        <span className="mt-3">
          <List />
        </span>
      </header>
    </div>
  );
}

export default App;
