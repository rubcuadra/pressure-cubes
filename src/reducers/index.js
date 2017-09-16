import { combineReducers } from 'redux';
import GameStatusReducer from './gameReducer';
import TimerReducer from './timerReducer';
import HearthsReducer from './hearthsReducer';

const rootReducer = combineReducers({
	paused:GameStatusReducer,
	time:TimerReducer,
	hearths: HearthsReducer,
});

export default rootReducer;