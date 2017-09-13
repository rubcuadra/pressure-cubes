import _ from 'lodash';
import React,{Component} from 'react';
import Pressure from 'react-pressure';
import React3 from 'react-three-renderer';
import * as THREE from 'three';
import CANNON from 'cannon/src/Cannon';
import Cube from '../components/cube';
import {connect} from 'react-redux';

const pressureConfig = {
  polyfill: true,
  polyfillSpeedUp: 1000,
  polyfillSpeedDown: 1000
};

class Scene extends Component {

  updateDimensions() {
    const width = window.window.innerWidth;
    let height = window.innerHeight;

    if (height>width) height = width; //Para que no se vea tan raro
    this.setState({width,height});
    this.forceUpdate();
  }

  componentWillMount() {
    this.updateDimensions();
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions.bind(this) );
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this) );
  }

  shouldComponentUpdate(){
    //No queremos se renderee excepto 
    //cuando lo dice la escena(Usando force)
    return false; 
  }
  componentWillReceiveProps(nextProps){
    //Solo cuando cambie paused renderearemos
    if (this.props.paused != nextProps.paused)
      this.forceUpdate();
  }

  constructor(props, context) {
    super(props, context);
    this.width = 100;
    this.height = 100;
    // Configure scene
    this.light = {x:20,y:20,z:20};
    this.shadowD = 20;
    this.fog = new THREE.Fog(0x001525, 10, 40);
    this.shadowDition = new THREE.Vector3(this.light.x,this.light.y,this.light.z);
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
    //Add Character to World
    const charShape = new CANNON.Box(new CANNON.Vec3(character.dimensions.width,
                                                     character.dimensions.height,
                                                     character.dimensions.depth));
    const charBody = new CANNON.Body( {mass:0} );
    
    charBody.addShape(charShape);
    charBody.position.set( character.startPosition.x,
                           character.startPosition.y,
                           character.startPosition.z);
    charBody.fixedRotation = true;
    charBody.addEventListener("collide", this.onCharacterCollision.bind(this) );
    world.addBody(charBody);

    //ADD Vertical PLANE to the WORLD
    const groundShape = new CANNON.Plane();
    const groundBody = new CANNON.Body({ mass: 0 });
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI);
    groundBody.position.set(0,0,3.5); //Pared Vertical, nos sirve para saber cuales ya se fueron
    groundBody.addEventListener("collide", this.onPlaneCollision.bind(this));
    world.addBody(groundBody);
    groundBody.collisionResponse = false; //Para que no se vea que rebotan
    //Agregar como objetos de la clase
    this.objectsDim = objD;
    this._onAnimate = this._onAnimate.bind(this);
    this.timeStep = 1 / 60; //Evaluate gravity per second
    this.world = world;
    this.toDelete = new Set();
    this.currentMaxObjects = 5;
    this.maxSceneObjects = 50;
    this.rateAppearance = 10;
    //Poner el estado
    this.state = {character};
  }
  //ADD 1 BOX TO THE WORLD
  createObstacle(mass=5){
    const _type = 43;
    const {startPosition,maxDepth} = this.state.character;
    let objShape = null;
    const objBody = new CANNON.Body({mass});
    switch (_type){
      case 0: 
        objShape = new CANNON.Cylinder(this.objectsDim.width/2,this.objectsDim.width/2,this.objectsDim.height,10);
        break;
      case 1: 
        objShape = new CANNON.Sphere(this.objectsDim.width);
      default: //Box
        objShape = new CANNON.Box(new CANNON.Vec3(this.objectsDim.width,
                                                    this.objectsDim.height,
                                                    this.objectsDim.depth));
        break;
    }
    objBody.addShape(objShape);
    objBody.position.set( startPosition.x - Math.random()*maxDepth, //ESTE y Z DEBERIA IR CAMBIANDO
                          startPosition.y,
                          startPosition.z - 5); //Donde empiezan a salir
    this.world.addBody(objBody);
  }

  onCharacterCollision(collision){
    // console.log(collision);
  }

  onPlaneCollision( {contact} ){
    this.toDelete.add(contact.bj);
  }

  //Las dimensiones son en relacion al character
  getObjectsConfig({width,height,depth}){
    return {
      geoId:"cubeGeo",
      materialId:"matGeo",
      icoGeoId:"icoGeo",
      width: width/2,
      height: height/2,
      depth: depth/2,
    };
  }

  resetCharacter(){
    const position = new THREE.Vector3(2.5,1,1.5);
    return {
      position,
      maxDepth: 10,
      startPosition: position.clone(),
      quaternion: new THREE.Quaternion(),
      geoId:"charGeo",
      materialId:"charMat",
      dimensions:{
        width:0.25,
        height:0.25,
        depth:0.25
      }
    };
  }

  _updateWorld(){
    this.world.step(this.timeStep);
    
    if (this.world.bodies.length<this.currentMaxObjects && Math.random()*100<this.rateAppearance)
    {this.createObstacle();}

    if (this.toDelete.size>0) 
    {
      this.toDelete.forEach(body=>this.world.removeBody(body));
      this.toDelete.clear();
    } 
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
    //Actualizar tanto el personaje con su estado como el objeto del mundo
    this.world.bodies[0].position.set(newPos.x, newPos.y, newPos.z);
    this.setState( { character:{...character,position:newPos} } );
  }

  renderObjects(){
    const {geoId,materialId} = this.objectsDim; //Dimensiones para todos, tal vez diferentes?
    return this.world.bodies.map( ({position,quaternion},i)=>{
        if (i>1) 
        {
          return (
            <Cube
              key={i}
              geometryId={geoId}
              materialId={materialId}
              position={new THREE.Vector3().copy(position)}
              quaternion={new THREE.Quaternion().copy(quaternion)}/>);
        }
    });   
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

        <icosahedronGeometry
          resourceId={this.objectsDim.icoGeoId}
          radius={this.objectsDim.width}
          detail={0}/>

        <meshPhongMaterial
          resourceId={this.objectsDim.materialId}
          color={0x88FF88}/>
      </resources>
    );
  }

  render() {
    const {width, height} = this.state;

    return (
      <React3
        antialias
        mainCamera="camera"
        width={width}
        height={height}
        clearColor={this.fog.color}
        onAnimate={this.props.paused?null:this._onAnimate}
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

function mapStateToProps({paused}){
  return {paused};
}

export default connect(mapStateToProps)(Pressure(Scene,pressureConfig)) ;