import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import reducers from './reducers';
import registerServiceWorker from './registerServiceWorker';
import './styles/index.css'; //Cargar hoja de estilos

//middlewares
import thunk from 'redux-thunk';
import timerMiddleware from 'redux-timer-middleware';
// import ReduxPromise from 'redux-promise';
import { initMainTimer } from './actions';
//Components
import Scene from './containers/scene';
import Controls from './containers/controls';

const middleware = [thunk,timerMiddleware];
const createStoreWithMiddleware = applyMiddleware(...middleware)(createStore);
const store = createStoreWithMiddleware(reducers);
// store.dispatch(initMainTimer());
ReactDOM.render(
  <Provider store={ store }>
  	<BrowserRouter>
  	  <div>
        <Controls/>
  	  	<Switch>
	  	  	<Route path='/' component={Scene}/>
  	  	</Switch>
  	  </div>
  	</BrowserRouter>
  </Provider>
  , document.getElementById('root'));

registerServiceWorker();