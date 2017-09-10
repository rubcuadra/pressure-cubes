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
    
    //init Character and objectsDimensions
    const character = this.resetCharacter();
    const objD = this.getObjectsConfig(character.dimensions);
    
    //INIT CANNON
    const world = new CANNON.World();
    world.quatNormalizeSkip = 0;
    world.quatNormalizeFast = false;
    world.gravity.set(0, 0, 6); //El cubo caera lateralmente <-
    world.broadphase = new CANNON.NaiveBroadphase();
    const mass = 5;

    //ADD 1 BOX TO THE WORLD
    const boxShape = new CANNON.Box(new CANNON.Vec3(objD.width,objD.height,objD.depth));
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
    groundBody.position.set(0,0,3.5); //Pared Vertical, nos sirve para saber cuales ya se fueron
    world.addBody(groundBody);

    //Add Character to World
    const charShape = new CANNON.Box(new CANNON.Vec3(character.dimensions.width,
                                                     character.dimensions.height,
                                                     character.dimensions.depth));
    const charBody = new CANNON.Body( {mass:0} );
    
    charBody.addShape(charShape);
    charBody.position.set( character.startPosition.x,
                           character.position.y,
                           character.position.z);
    world.addBody(charBody);

    //Agregar como objetos de la clase
    this.objectsDim = objD;
    this._onAnimate = this._onAnimate.bind(this);
    this.timeStep = 1 / 60; //Evaluate gravity per second
    this.world = world;
    //Poner el estado
    this.state = {character};
  }

  //Las dimensiones son en relacion al character
  getObjectsConfig({width,height,depth}){
    return {
      geoId:"objGeo",
      materialId:"matGeo",
      width: width/2,
      height: height/2,
      depth: depth/2,
    };
  }

  resetCharacter(){
    const position = new THREE.Vector3(3,1,1.5);
    return {
      position,
      maxDepth: 10,
      startPosition: position.clone(),
      quaternion: new THREE.Quaternion(),
      geoId:"charGeo",
      materialId:"charMat",
      dimensions:{
        width:0.5,
        height:0.5,
        depth:0.5
      }
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

  renderObjects(){
    const {bodies} = this.world;
    const {position,quaternion} = bodies[0];
    const {geoId,materialId} = this.objectsDim;
    return (
      <Cube
        geometryId={geoId}
        materialId={materialId}
        position={new THREE.Vector3().copy(position)}
        quaternion={new THREE.Quaternion().copy(quaternion)}>
      </Cube>
    );
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
          width={this.state.character.dimensions.width}
          height={this.state.character.dimensions.height}
          depth={this.state.character.dimensions.depth}
          widthSegments={1}
          heightSegments={1}/>
        <meshPhongMaterial
          resourceId={this.state.character.materialId}
          color={0x888888}/>

        <boxGeometry
          resourceId={this.objectsDim.geoId}
          width={this.objectsDim.width}
          height={this.objectsDim.height}
          depth={this.objectsDim.depth}
          widthSegments={10}
          heightSegments={10}/>

        <meshPhongMaterial
          resourceId={this.objectsDim.materialId}
          color={0x88FF88}/>
      </resources>
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