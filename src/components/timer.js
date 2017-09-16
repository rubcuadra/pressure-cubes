import React,{Component} from 'react';

class Timer extends Component{

	getFormatedSeconds(seconds){
		const t = new Date(seconds * 1000);
		const h = t.getUTCHours();
		const m = t.getUTCMinutes();
		const s = t.getSeconds();
		
		return `${h>9?h:`0${h}`} :
				${m>9?m:`0${m}`} :
				${s>9?s:`0${s}`}`;
	}

	render(){
		return <h3 className="centered timer">{this.getFormatedSeconds(this.props.seconds)}</h3>
	}
}

export default Timer;