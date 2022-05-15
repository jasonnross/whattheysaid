import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import Head from './components/Head';
import Home from './pages/Home';
import About from './pages/About';
import Quote from 'pages/Quote';
import Go from './components/Go';
import SearchBar from 'components/SearchBar';

function App() {
  return (
    <Router>
      <Head />
      <div className="container">
        <Switch>
          <Route exact path="/">
            <Go tool={ Home }/>
          </Route>
          <Route exact path="/quote">
            {/* <SearchBar /> */}
            <Go tool={ Quote }/>
          </Route>

          <Route path="/about">
            <SearchBar />
            <Go tool={ About }/>
          </Route>
          <Route path="/test">
            <SearchBar />
          </Route>



        </Switch>
      </div>
    </Router>
  )
}

export default App;
