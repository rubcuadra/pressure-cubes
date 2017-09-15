import { combineReducers } from 'redux';
import GameStatusReducer from './gameReducer';
import TimerReducer from './timerReducer';
import LevelReducer from './levelReducer.js';

const rootReducer = combineReducers({
	paused:GameStatusReducer,
	level:LevelReducer,
	time:TimerReducer
});

export default rootReducer;