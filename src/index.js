import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import reducers from './reducers';
import registerServiceWorker from './registerServiceWorker';
import './styles/index.css'; //Cargar hoja de estilos

//middlewares
import thunk from 'redux-thunk'
import ReduxPromise from 'redux-promise';

//Components
import App from './components/app';

const middleware = [thunk,ReduxPromise];
const createStoreWithMiddleware = applyMiddleware(...middleware)(createStore);
//const createStoreWithMiddleware = applyMiddleware(ReduxPromise)(createStore);

ReactDOM.render(
  <Provider store={ createStoreWithMiddleware(reducers) }>
  	<BrowserRouter>
  	  <div>
  	  	<Switch>
	  	  	<Route path='/' component={App}/>
  	  	</Switch>
  	  </div>
  	</BrowserRouter>
  </Provider>
  , document.getElementById('root'));

registerServiceWorker();