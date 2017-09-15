import {LEVEL_UP,RESET_LVL} from '../actions/types';

export default function(state=0,action){
	switch(action.type){
		case LEVEL_UP:
			return state+1;
		case RESET_LVL:
			return 0;
		default:
			return state;

	}
}