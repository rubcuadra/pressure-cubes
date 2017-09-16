import {RESET_SCENE,DONT_RESET_SCENE} from '../actions/types';
export default (state=false,action)=>{
	switch(action.type)
	{
		case RESET_SCENE:
			return true;
		case DONT_RESET_SCENE:
			return false;
		default:
			return state;
	}
}