import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import reducers from './reducers';
import registerServiceWorker from './registerServiceWorker';
import './styles/index.css'; //Cargar hoja de estilos
import './styles/css/font-awesome.min.css';
//middlewares
import thunk from 'redux-thunk';
import timerMiddleware from 'redux-timer-middleware';
//Components
import CubesGame from './components/cubesGame';

const middleware = [thunk,timerMiddleware];
const createStoreWithMiddleware = applyMiddleware(...middleware)(createStore);
const store = createStoreWithMiddleware(reducers);
// store.dispatch(initMainTimer());
ReactDOM.render(
  <Provider store={ store }>
  	<BrowserRouter>
  	  <div>
  	  	<Switch>
	  	  	<Route path='/' component={CubesGame}/>
  	  	</Switch>
  	  </div>
  	</BrowserRouter>
  </Provider>
  , document.getElementById('root'));

registerServiceWorker();