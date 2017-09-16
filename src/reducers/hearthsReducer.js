import {INCREASE_HEARTHS,DECREASE_HEARTHS,RESET_HEARTHS} from '../actions/types';

const maxHearts = 5;
export default (state=maxHearts,action)=>{
	switch(action.type){
		case INCREASE_HEARTHS:
			return state+1;
		case DECREASE_HEARTHS:
			return state-1;
		case RESET_HEARTHS:
			return maxHearts;
		default:
			return state;
	}
}