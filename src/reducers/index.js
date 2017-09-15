import { combineReducers } from 'redux';
import GameStatusReducer from './gameReducer';
import TimerReducer from './timerReducer';

const rootReducer = combineReducers({
	paused:GameStatusReducer,
	time:TimerReducer
});

export default rootReducer;