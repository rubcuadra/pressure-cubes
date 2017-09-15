import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

class Controls extends Component{
	onPauseClick(){
		if (this.props.paused) 
		{
			this.props.resumeGame();
			this.props.startTimer()
		}	
		else
		{
			this.props.pauseGame();
			this.props.stopTimer()
		}
	}
	getFormatedSeconds(seconds){
		const t = new Date(seconds * 1000);
		const h = t.getUTCHours();
		const m = t.getUTCMinutes();
		const s = t.getSeconds();
		
		console.log(this.props.level);
		if (s===0) 
			this.props.levelUp()

		return `${h>9?h:`0${h}`} :
				${m>9?m:`0${m}`} :
				${s>9?s:`0${s}`}`;
	}

	render(){
		return (
			<div>
				<nav>
					<h3 className="centered timer">{this.getFormatedSeconds(this.props.time)}</h3>
					<button className="pause-btn" onClick={this.onPauseClick.bind(this)}> {this.props.paused?"Resume":"Pause"}</button>										
				</nav>
				{this.props.paused?<h1 className="centered message">PAUSED</h1>:""}
			</div>
	  );
	}
}

function mapStateToProps({paused,time,level}){
	return {paused,time,level}
}

export default connect(mapStateToProps, actions)(Controls) ;