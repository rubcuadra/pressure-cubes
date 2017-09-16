import React, { Component } from 'react';
import Scene from '../containers/scene';
import Controls from '../containers/controls';

export default class CubesGame extends Component{
	
	render(){
		return (
		<div>
			<Controls/>
			<Scene/>
		</div>);
	}
}