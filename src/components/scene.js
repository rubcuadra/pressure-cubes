import React,{Component} from 'react';
import Pressure from 'react-pressure';
import React3 from 'react-three-renderer';
import * as THREE from 'three';
import CANNON from 'cannon/src/Cannon';
import Cube from './cube';

const pressureConfig = {
  polyfill: true,
  polyfillSpeedUp: 1000,
  polyfillSpeedDown: 1000
};

class Scene extends Component {

  shouldComponentUpdate(){
    //No queremos se renderee excepto 
    //cuando lo dice la escena(Usando force)
    return false; 
  }

  constructor(props, context) {
    super(props, context);
  
    // Configure scene
    this.shadowD = 20;
    this.fog = new THREE.Fog(0x001525, 10, 0);
    this.shadowDition = new THREE.Vector3(this.shadowD,this.shadowD,this.shadowD);
    this.lightTarget = new THREE.Vector3(0, 0, 0);
    this.groundQuaternion = new THREE.Quaternion()
      .setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
    this.cameraPosition = new THREE.Vector3(10, 2, 0);
    this.cameraQuaternion = new THREE.Quaternion()
      .setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
    
    //Configurar estado, onAnimate es el encargo de invocar el render
    this._onAnimate = this._onAnimate.bind(this);

    const character = this.resetCharacter();
    this.state = {character};


    //INIT CANNON
    const world = new CANNON.World();
    world.quatNormalizeSkip = 0;
    world.quatNormalizeFast = false;
    world.gravity.set(0, 0, 6); //El cubo caera lateralmente <-
    world.broadphase = new CANNON.NaiveBroadphase();
    const mass = 5;

    //ADD 1 BOX TO THE WORLD
    const boxShape = new CANNON.Box(new CANNON.Vec3(0.25, 0.25, 0.25));
    const boxBody = new CANNON.Body({mass});
    boxBody.addShape(boxShape);
    boxBody.position.set( 3, //ESTE y Z DEBERIA IR CAMBIANDO
                          character.position.y,
                          character.position.z - 3 ); //Donde empiezan a salir
    world.addBody(boxBody);


    //ADD Vertical PLANE to the WORLD
    const groundShape = new CANNON.Plane();
    const groundBody = new CANNON.Body({ mass: 0 });
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI);
    groundBody.position.set(0,0,5); //Pared Vertical, nos sirve para saber cuales ya se fueron
    world.addBody(groundBody);
    // boxBody.collisionFilterGroup = 0;
    // boxBody.collisionFilterMask = 0;
    this.timeStep = 1 / 60; //Evaluate gravity per second
    this.world = world;
  }

  resetCharacter(){
    const position = new THREE.Vector3(3,1,1.5);
    return {
      position,
      maxDepth: 10,
      startPosition: position.clone(),
      quaternion: new THREE.Quaternion(),
      geoId:"charGeo",
      materialId:"charMat"
    };
  }

  _updateWorld(){
    this.world.step(this.timeStep);
    
  }

  _onAnimate() {
    this._updateCharacterPosition();
    this._updateWorld();

    this.forceUpdate();
  };

  _updateCharacterPosition() {    
    const {character} = this.state;
    const newPos = character.startPosition.clone()
                            .add( new THREE.Vector3(-this.props.force,0,0)
                            .multiplyScalar(character.maxDepth) );   
    this.setState( { character:{...character,position:newPos} } );
  }

  renderCharacter(){
    const {position,quaternion,geoId,materialId} = this.state.character; 
    return (
      <Cube
        geometryId={geoId}
        materialId={materialId}
        position={position}
        quaternion={quaternion}>
      </Cube>
    );
  }

  renderFloor(){
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

  addResources(){
    return (
      <resources>
        <boxGeometry
          resourceId={this.state.character.geoId}
          width={0.5}
          height={0.5}
          depth={0.5}
          widthSegments={10}
          heightSegments={10}/>
        <meshPhongMaterial
          resourceId={this.state.character.materialId}
          color={0x888888}/>
      </resources>
    );
  }

  renderObjects(){
    const {bodies} = this.world;
    const {position,quaternion} = bodies[0]
    
    return (
      <Cube
        geometryId="charGeo"
        materialId="charMat"
        position={new THREE.Vector3().copy(position)}
        quaternion={new THREE.Quaternion().copy(quaternion)}>
      </Cube>
    );
  }

  render() {
    const [width, height] = [1500,800];
    return (
      <React3
        antialias
        mainCamera="camera"
        width={width}
        height={height}
        clearColor={this.fog.color}
        onAnimate={this._onAnimate}
        gammaInput
        gammaOutput
        shadowMapEnabled>
        
        {this.addResources()}
        
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

          {this.renderFloor()}
          {this.renderCharacter()}
          {this.renderObjects()}

        </scene>
      </React3>
    );
  }
}

export default Pressure(Scene,pressureConfig) ;