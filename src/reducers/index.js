import { combineReducers } from 'redux';
import GameStatusReducer from './gameReducer';
import TimerReducer from './timerReducer';
import HearthsReducer from './hearthsReducer';
import ResetReducer from "./resetReducer";
const rootReducer = combineReducers({
	paused:GameStatusReducer,
	time:TimerReducer,
	hearths: HearthsReducer,
	reset: ResetReducer
});

export default rootReducer;