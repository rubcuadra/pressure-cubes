import {TIMER_TICKED,RESET_TIMER} from '../actions/types';

export default function(state=0,action){
	switch(action.type){
		case TIMER_TICKED:
			return state+1;
		case RESET_TIMER:
			return 0;
		default:
			return state;
	} 
}