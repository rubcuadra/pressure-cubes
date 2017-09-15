import { GAME_CONTINUE, GAME_PAUSE, TIMER_TICKED, RESET_LVL, LEVEL_UP } from './types';
import { START_TIMER,STOP_TIMER } from 'redux-timer-middleware';

export const MAIN_TIMER_NAME = "infiniteTimer";

export function levelUp(){
	return {
		type: LEVEL_UP,
		payload: null
	};
}

export function resetLvl(){
	return {
		type: RESET_LVL,
		payload: null
	};
}

export function initMainTimer(){
	return (dispatch)=>{
		dispatch(startTimer()); //Inicializar
		dispatch(stopTimer());	//Detener
	};
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
