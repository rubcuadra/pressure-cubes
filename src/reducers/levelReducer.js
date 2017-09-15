import {LEVEL_UP,RESET_LVL,MAX_LEVEL} from '../actions/types';

export default function(state=0,action){
	switch(action.type){
		case LEVEL_UP:
			return state+1;
		case RESET_LVL:
			return 0;
		case MAX_LEVEL:
			return action.payload;
		default:
			return state;
	}
}