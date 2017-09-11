import {GAME_CONTINUE,GAME_PAUSE} from './types';

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