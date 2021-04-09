import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import Head from './components/Head';

import Home from './pages/Home';
import About from './pages/About';
import Quote from './pages/Quote';
import Go from './components/Go';

function App() {
  return (
    <Router>
      <Head />
      <div className="container">
        <Switch>
          <Route exact path="/">
            <Go tool={ Home }/>
          </Route>

          <Route path="/quote">
            <Go tool={ Quote }/>
          </Route>

          <Route path="/about">
            <Go tool={ About }/>
          </Route>

        </Switch>
      </div>
    </Router>
  )
}

export default App;
