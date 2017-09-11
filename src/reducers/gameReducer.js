import {GAME_CONTINUE,GAME_PAUSE} from '../actions/types';

export default function(state=true,action){
	switch(action.type){
		case GAME_CONTINUE:
			return action.payload;
		case GAME_PAUSE:
			return action.payload;
	} 
	return state;
}