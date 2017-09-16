import { GAME_CONTINUE, GAME_PAUSE, TIMER_TICKED, RESET_TIMER } from './types';
import { INCREASE_HEARTHS, DECREASE_HEARTHS, RESET_HEARTHS} from './types';
import { START_TIMER,STOP_TIMER } from 'redux-timer-middleware';

export const MAIN_TIMER_NAME = "infiniteTimer";

export function resetTime(){
	return { type:RESET_TIMER };	
}

export function reduceHearths(){
	return { type:DECREASE_HEARTHS };
}

export function resetHearths(){
	return { type:RESET_HEARTHS };
}

export function increaseHearths(){
	return { type:INCREASE_HEARTHS };
}

export function startTimer(timerName=MAIN_TIMER_NAME){
	return {
	    type: START_TIMER,
	    payload: {
	        actionName: TIMER_TICKED,
	        timerName,
	    }
	}
}

export function stopTimer(timerName=MAIN_TIMER_NAME){
	return {
	    type: STOP_TIMER,
	    payload: {
	        timerName
	    }
	};
}
export function pauseGame()
{
	return {
			type: GAME_PAUSE,
			payload: true
	};
}

export function resumeGame()
{
	return {
			type: GAME_CONTINUE,
			payload: false
	};
}
export function resetGame(){
	return (dispatch)=>{
		dispatch(resetTime());
		dispatch(increaseHearths());
	};	
}

export function gameOver(){
	return (dispatch)=>{
		dispatch(pauseGame());
		dispatch(stopTimer());
	};
}
