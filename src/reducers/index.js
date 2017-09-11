import { combineReducers } from 'redux';
import GameStatusReducer from './gameReducer';

const rootReducer = combineReducers({
	paused:GameStatusReducer
});

export default rootReducer;