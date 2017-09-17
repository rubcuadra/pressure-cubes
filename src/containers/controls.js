import React, { Component } from 'react';
import LifeBar from '../components/life_bar';
import Timer from '../components/timer';
import { connect } from 'react-redux';
import * as actions from '../actions';

class Controls extends Component{

	onPauseClick(){
		if (!this.props.hearths>0) 
		{

			this.props.resetGame();
			window.location.reload();
			return;
		}
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
	render(){
		return (
			<div>
				<nav>
					<Timer seconds={this.props.time}/>
					<LifeBar life={this.props.hearths}/>
					<button className="pause-btn" onClick={this.onPauseClick.bind(this)}> {this.props.paused?(this.props.hearths>0?"Resume":"Restart"):"Pause"}</button>										
				</nav>
				{this.props.paused?<h1 className="centered message">{this.props.hearths>0?"PAUSED":"GAME OVER"}</h1>:""}
			</div>
	  );
	}
}

function mapStateToProps({paused,time,level,hearths}){
	return {paused,time,level,hearths}
}

export default connect(mapStateToProps, actions)(Controls) ;