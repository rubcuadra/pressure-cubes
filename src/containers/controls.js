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
			<button onClick={this.onPauseClick.bind(this)}> {this.props.paused?"Resume":"Pause"} </button>
	  );
	}
}

function mapStateToProps({paused}){
	return { paused }
}

export default connect(mapStateToProps, actions)(Controls) ;