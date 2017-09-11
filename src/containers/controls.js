import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

class Controls extends Component{
	onPauseClick(){
		if (this.props.paused) 
			this.props.resumeGame();
		else
			this.props.pauseGame();
	}

	render(){
		return (
			<nav>
				<button className="pause-btn" onClick={this.onPauseClick.bind(this)}> {this.props.paused?"Resume":"Pause"}</button>
			</nav>
	  );
	}
}

function mapStateToProps({paused}){
	return { paused }
}

export default connect(mapStateToProps, actions)(Controls) ;