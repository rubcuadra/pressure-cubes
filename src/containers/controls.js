import React, { Component } from 'react';
import LifeBar from '../components/life_bar';
import Timer from '../components/timer';
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
	render(){
		return (
			<div>
				<nav>
					<Timer seconds={this.props.time}/>
					<LifeBar life={5}/>
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