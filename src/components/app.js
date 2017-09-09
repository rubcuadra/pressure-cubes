import React, {Component} from 'react';
import React3 from 'react-three-renderer';
import * as THREE from 'three';
import View from './rotating_cube';

class Viewer extends Component{
	constructor(props, context) {
	    super(props, context);
	    this.cameraPosition = new THREE.Vector3(0, 0, 5);
	}

	render(){
		const width=800;
		const height=800;
		return (<View {...{width,height}}></View>);
	}
}

export default Viewer;