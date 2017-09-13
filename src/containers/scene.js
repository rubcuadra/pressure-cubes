import React,{Component} from 'react';
import Pressure from 'react-pressure';
import React3 from 'react-three-renderer';
import * as THREE from 'three';
import CANNON from 'cannon/src/Cannon';
import Cube from '../components/cube';
import Cylinder from '../components/cylinder';
import {connect} from 'react-redux';

function BodyTypeException(msg){
  this.message = msg;
  this.name = "BodyTypeException"
}

const BODY_TYPES={
  CYLINDER:CANNON.Shape.types.CYLINDER,
  SPHERE:CANNON.Shape.types.SPHERE,
  BOX: CANNON.Shape.types.BOX,
  PLANE: CANNON.Shape.types.PLANE,
};

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
    if (this.props.paused !== nextProps.paused)
    {
      console.log("Pause switch");
      this.forceUpdate();
    }
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
    const _type = BODY_TYPES.BOX;
    const {startPosition,maxDepth} = this.state.character;
    let objShape = null;
    const objBody = new CANNON.Body({mass});
    switch (_type){
      case BODY_TYPES.CYLINDER: 
        objShape = new CANNON.Cylinder(this.objectsDim.width/2,this.objectsDim.width/2,this.objectsDim.height,10);
        break;
      case BODY_TYPES.SPHERE: 
        objShape = new CANNON.Sphere(this.objectsDim.width);
        break;
      case BODY_TYPES.BOX:
        objShape = new CANNON.Box(new CANNON.Vec3(this.objectsDim.width,
                                                    this.objectsDim.height,
                                                    this.objectsDim.depth));
        break;
      default:
        throw new BodyTypeException("Wrong type on createObstacle");
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
    return this.world.bodies.map( ({position,quaternion,shapes},i)=>{
        if (i>1) 
        {
          switch(shapes[0].type){
            case BODY_TYPES.BOX:    
              return (
                <Cube
                  key={i}
                  color={0x0FF0F0}
                  position={new THREE.Vector3().copy(position)}
                  quaternion={new THREE.Quaternion().copy(quaternion)}
                  width={this.objectsDim.width}
                  height={this.objectsDim.height}
                  depth={this.objectsDim.depth}/>);
            case BODY_TYPES.CYLINDER: 
                return (
                <Cylinder
                  key={i}
                  color={0x0FF0F0}
                  position={new THREE.Vector3().copy(position)}
                  quaternion={new THREE.Quaternion().copy(quaternion)}
                  width={this.objectsDim.width}
                  height={this.objectsDim.height}
                  depth={this.objectsDim.depth}/>);             
            case BODY_TYPES.SPHERE: 
              
              break;
            default:
              throw new BodyTypeException("Wrong type on renderObjects");
          }
          return null;
        }
    });   
  }

  renderCharacter(){
    const {position,quaternion} = this.state.character; 
    return (
      <Cube
        position={position}
        quaternion={quaternion}
        color={0x777777}
        width={this.state.character.dimensions.width}
        height={this.state.character.dimensions.height}
        depth={this.state.character.dimensions.depth}>
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