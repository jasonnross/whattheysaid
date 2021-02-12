import React, { Fragment } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Head from './components/Head';
import Home from './pages/Home';
import About from './pages/About';
import Quote from './pages/Quote';
import { observer } from 'mobx-react';
import { useStore } from './mobx/context';

const App = observer(() => {
  const store = useStore();
  setInterval(() => {
    console.log(store);
  }, 8000);
  return (
    <Fragment>
    <Head />
    <div className="container">
    <Router>
      <Switch>
        <Route exact path="/"><Home mainStore={ store } /></Route>
        <Route exact path="/quote"><Quote mainStore={ store } /></Route>
        <Route exact path="/about"><About mainStore={ store } /></Route>
      </Switch>
    </Router>
    </div>
  </Fragment>
  )
})

export default App;
