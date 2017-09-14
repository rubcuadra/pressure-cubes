import {TIMER_TICKED} from '../actions/types';

export default function(state=0,action){
	switch(action.type){
		case TIMER_TICKED:
			return state+1;
		default:
			return state;
	} 
}