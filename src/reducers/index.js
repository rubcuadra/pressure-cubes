import { combineReducers } from 'redux';
// import { reducer as formReducer } from 'redux-form';
// import SomeReducer from './reducer_some';

const rootReducer = combineReducers({
	// something: SomeReducer,
	// form: formReducer  
	state: (state = {}) => state
});

export default rootReducer;