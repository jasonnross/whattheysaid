import React, { Fragment } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Head from './components/Head';
import Home from './pages/Home';

function App() {
  return (
    <Fragment>
      <Head />
      <div className="container">
      <Router>
        <Switch>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>  
      </div>
    </Fragment>
  );
}

export default App;
