import React from 'react';
import ReactDOM from 'react-dom';
import './style/index.css';
import 'semantic-ui-css/semantic.min.css';
import './style/loader.css'
import App from './App';
import * as serviceWorker from './serviceWorker';
import mainStore from './mobx/mainStore';
import { Provider } from 'mobx-react';

const stores = {
	mainStore,
};

ReactDOM.render(
  <Provider { ...stores }>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
