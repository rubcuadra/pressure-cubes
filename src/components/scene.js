import React,{Component} from 'react';
import Pressure from 'react-pressure';
import React3 from 'react-three-renderer';
import * as THREE from 'three';
import PropTypes from 'prop-types';
import Cube from './cube';

const pressureConfig = {
  polyfill: true,
  polyfillSpeedUp: 1000,
  polyfillSpeedDown: 1000
};

class Scene extends Component {
  constructor(props, context) {
    super(props, context);
  
    // Configure scene
    this.shadowD = 20;
    this.fog = new THREE.Fog(0x001525, 10, 40);
    this.shadowDition = new THREE.Vector3(this.shadowD,this.shadowD,this.shadowD);
    this.lightTarget = new THREE.Vector3(0, 0, 0);
    this.groundQuaternion = new THREE.Quaternion()
      .setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
    this.cameraPosition = new THREE.Vector3(10, 2, 0);
    this.cameraQuaternion = new THREE.Quaternion()
      .setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);

    this.state = {character:this._createCube(3,1,1.5)};

    // const N = 1;
    // const bodies = [];
    // bodies.length = N;

    // this.bodies = bodies;

    // this._createBodies();

    // this.state = {
    //   numBodies: N,
    //   meshStates: this._getMeshStates(),
    // };
  }

  // _getMeshStates() {
  //   return this.bodies.map(({ position, quaternion }) => ({
  //     position: new THREE.Vector3().copy(position),
  //     quaternion: new THREE.Quaternion().copy(quaternion),
  //   }));
  // }

  _onAnimate = () => {
    // this._updatePhysics();
    // this._updateGraphics();
  };

  // _updateGraphics() {
  //   this.setState({
  //     meshStates: this._getMeshStates(),
  //   });
  // }

  // _updatePhysics() {
  //   const time = new Date().getTime();
  //   const bodies = this.bodies;

  //   for (let i = 0; i < bodies.length; ++i) {
  //     const body = bodies[i];

  //     const sinTime = Math.sin(time * body.timeScale);

  //     body.quaternion.multiply(body.rotationDeltaPerFrame);

  //     const { movementPerFrame } = body;

  //     body.position.copy(body.startPosition.clone()
  //       .add(movementPerFrame.clone()
  //         .multiplyScalar(sinTime)));
  //   }
  // }

  // _createBodies() {
  //   const { bodies } = this;
  //   const N = bodies.length;

  //   for (let i = 0; i < N; ++i) 
  //     bodies[i] = this._createBody(i);
  // }

  _createCube(X,Y,Z) {
    const position = new THREE.Vector3(X,Y,Z);
    return {
      position,
      // timeScale: Math.random() * 0.005,
      startPosition: position.clone(),
      // movementPerFrame: new THREE.Vector3(Math.random(), Math.random(), Math.random()),
      // rotationDeltaPerFrame: new THREE.Quaternion()
        // .setFromEuler(new THREE.Euler(
        //   Math.random() * 0.05,
        //   Math.random() * 0.05,
        //   Math.random() * 0.05)),
      quaternion: new THREE.Quaternion(),
    };
  }

  // getArrayOfCubes(){
  //   return this.state.meshStates.map(({ position, quaternion }, i) =>
  //     (<Cube
  //       key={i}
  //       position={position}
  //       quaternion={quaternion}
  //       bodyIndex={i}
  //       meshes={this.meshes}/>));
  // }

  getPlane(){
    return (
      <mesh
        castShadow
        receiveShadow
        quaternion={this.groundQuaternion}>
        <planeBufferGeometry
          width={100}
          height={100}
          widthSegments={1}
          heightSegments={1}/>
        <meshLambertMaterial
          color={0x777777}/>
      </mesh>
    );
  }

  render() {
    const [width, height] = [800,800];
    const {position,quaternion,meshes} = this.state.character;
    
    const newPos = position.clone().add( new THREE.Vector3(-this.props.force*5,0,0) );

    return (<div ref="container">
        <React3
          antialias
          mainCamera="camera"
          width={width}
          height={height}
          onAnimate={null}
          clearColor={this.fog.color}
          gammaInput
          gammaOutput
          shadowMapEnabled>
          
          <resources>
            <boxGeometry
              resourceId="cubeGeo"
              width={0.5}
              height={0.5}
              depth={0.5}
              widthSegments={10}
              heightSegments={10}/>
            <meshPhongMaterial
              resourceId="cubeMaterial"
              color={0x888888}/>
          </resources>
          
          <scene
            ref="scene"
            fog={this.fog}>

            <perspectiveCamera
              name="camera"
              fov={30}
              aspect={width / height}
              near={0.5}
              far={10000}
              position={this.cameraPosition}
              quaternion={this.cameraQuaternion}
              ref="camera"/>

            <ambientLight
              color={0x666666}/>

            <directionalLight
              color={0xffffff}
              intensity={1.75}
              shadowMapWidth={1024}
              shadowMapHeight={1024}
              shadowCameraLeft={-this.shadowD}
              shadowCameraRight={this.shadowD}
              shadowCameraTop={this.shadowD}
              shadowCameraBottom={-this.shadowD}
              shadowCameraFar={3 * this.shadowD}
              shadowCameraNear={this.shadowD}
              position={this.shadowDition}
              lookAt={this.lightTarget}
              castShadow/>


            {this.getPlane()}
            
            <Cube
              position={newPos}
              quaternion={quaternion}
              meshes={meshes}/>

          </scene>
        </React3>
      </div>
    );
  }
}

export default Pressure(Scene,pressureConfig) ;