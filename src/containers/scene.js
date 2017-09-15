import {values,sample} from 'lodash';
import React,{Component} from 'react';
import Pressure from 'react-pressure';
import React3 from 'react-three-renderer';
import * as THREE from 'three';
import CANNON from 'cannon/src/Cannon';
import Cube from '../components/cube';
import Cylinder from '../components/cylinder';
import Sphere from '../components/sphere';
import { connect } from 'react-redux';
import rMC from 'random-material-color';

function BodyTypeException(msg){
  this.message = msg;
  this.name = "BodyTypeException";
}

const BODY_TYPES={
  CYLINDER:CANNON.Shape.types.CONVEXPOLYHEDRON,
  SPHERE:CANNON.Shape.types.SPHERE,
  BOX: CANNON.Shape.types.BOX,
};

const pressureConfig = {
  polyfill: true,
  polyfillSpeedUp: 1000,
  polyfillSpeedDown: 1000,
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
  componentWillReceiveProps({paused,time}){
    //Solo cuando cambie paused renderearemos
    if (this.props.paused !== paused)
    {      
      this.forceUpdate();
      return;
    }

    if (this.props.time !== time) {
      if (time%30===0) //Aumentar dificultad cada 30 seg
        this.levelUp();   
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
    this.fog.color = new THREE.Color(0.14,0.14,0.14);
    this.shadowDition = new THREE.Vector3(this.light.x,this.light.y,this.light.z);
    this.lightTarget = new THREE.Vector3(0, 0, 0);
    this.groundQuaternion = new THREE.Quaternion()
      .setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
    this.cameraPosition = new THREE.Vector3(10, 2, 0);
    this.cameraQuaternion = new THREE.Quaternion()
      .setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
    
    //init Character and objectsDimensions
    const character = this.resetCharacter();
    //INIT CANNON
    const world = new CANNON.World();
    world.quatNormalizeSkip = 0;
    world.quatNormalizeFast = false;
    world.gravity.set(0, 0, 6); //El cubo caera lateralmente <-
    world.broadphase = new CANNON.NaiveBroadphase();
    world.solver.iterations = 10;
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
    groundBody.position.set(0,0,6); //Pared Vertical, nos sirve para saber cuales ya se fueron
    groundBody.addEventListener("collide", this.onPlaneCollision.bind(this));
    world.addBody(groundBody);
    groundBody.collisionResponse = true; //Para que no se vea que rebotan
    //Agregar como objetos de la clase
    this._onAnimate = this._onAnimate.bind(this);
    this.timeStep = 1 / 60; //Evaluate gravity per second
    this.world = world;
    this.toDelete = new Set(); //Cuando chocan se agregan aqui en lugar de ser borrados de golpe
    //Poner el estado
    this.state = {character, level:1, difficulty:this.getDifficulty(), obstacles:this.getObjectsConfig(character.dimensions)};
  }

  //ADD 1 BOX TO THE WORLD
  createObstacle(){
    const mass = Math.random()*20 + 0.5;
    const _type = sample(values(BODY_TYPES)); //Vienen de lodash
    const {startPosition,maxDepth} = this.state.character;
    let objShape = null;
    const objBody = new CANNON.Body({mass});
    switch (_type){
      case BODY_TYPES.CYLINDER: 
        const { min_radius,max_radius,min_height,max_height } = this.state.obstacles.cylinder;
        const r = this.randomBetween(min_radius,max_radius);
        const hc = this.randomBetween(min_height,max_height);
        objShape = new CANNON.Cylinder(r,r,hc,10);
        break;
      case BODY_TYPES.SPHERE: 
        const { sphere } = this.state.obstacles;
        const sp_r = this.randomBetween(sphere.min_radius,sphere.max_radius);
        objShape = new CANNON.Sphere( sp_r );
        break;
      case BODY_TYPES.BOX:
        const {box} = this.state.obstacles
        const w = this.randomBetween(box.min_width,box.max_width);
        const h = this.randomBetween(box.min_height,box.min_height);
        const d = this.randomBetween(box.min_depth,box.max_depth);
        objShape = new CANNON.Box(new CANNON.Vec3(w,w,w));
        break;
      default:
        throw new BodyTypeException("Wrong type on createObstacle");
    }
    objBody.addShape(objShape);
    if (this.state.difficulty.rotation) 
    { 
      const {x,y,z} = this.getRandomVector(-10,10,-10,10,-10,10);
      objBody.angularVelocity.set(x,y,z); //Con esto los ponemos a girar
      objBody.angularDamping = Math.random();  
    }
    objBody.position.set( startPosition.x-Math.random()*maxDepth, //ESTE y Z DEBERIA IR CAMBIANDO
                          startPosition.y,
                          startPosition.z - 5); //Donde empiezan a salir    
    objBody._bodyColor = rMC.getColor(); //RandomMaterialColor
    this.world.addBody(objBody);
  }
  randomBetween(_from,_to){
    return _from+Math.random()*(_to-_from);
  }

  getRandomVector(xMin,xMax,yMin,yMax,zMin,zMax){
    return {x:this.randomBetween(xMin,xMax),
            y:this.randomBetween(yMin,yMax),
            z:this.randomBetween(zMin,zMax)};
  }

  onCharacterCollision(collision){
    // console.log(collision);
  }

  onPlaneCollision( {body} ){
    this.toDelete.add(body);
  }

  levelUp(){
    const {difficulty,level} = this.state;
    const {delta,deltaRateAppearence,rateAppearance,maxRateAppearance,currentMax,maximum} = difficulty;
    if (level === -1) return;

    this.setState({level:level+1});
    switch(level)
    {
      case -1,0: //MAX LEVEL
        return;
      case 1:  
        this.setState( { difficulty: {...difficulty,currentMax:currentMax+delta} } );
        break;
      case 2:
        this.setState( { difficulty:{ ...difficulty,rotation:true } });
        break;
      case 3:
        this.setState( {difficulty:{ ...difficulty,rateAppearance:rateAppearance+deltaRateAppearence}});
        break;
      default: //Un random entre 2 y 3, si no puede uno que haga el otro, si no puede ninguno de los dos que ponga lvl max
        if ( Math.random()>0.5 ) //Validar primero que se puede aumentar OBJs
        {
          if (currentMax<maximum) //Aumentar objetos
            return this.setState( {difficulty:{...difficulty,currentMax:currentMax+delta}});
          else if(maxRateAppearance>rateAppearance) //Aumentar Probabilidad
            return this.setState( {difficulty:{...difficulty,rateAppearance:rateAppearance+deltaRateAppearence}});
          else
            return this.setState({level:-1});
        }
        else
        { //Validar primero el rate
          if(maxRateAppearance>rateAppearance) //Aumentar Probabilidad
            return this.setState( {difficulty:{...difficulty,rateAppearance:rateAppearance+deltaRateAppearence}});
          else if (currentMax<maximum) //Aumentar objetos
            return this.setState( {difficulty:{...difficulty,currentMax:currentMax+delta}});
          else
            return this.setState({level:-1});
        }
    }
  }

  getDifficulty(){
    return {
            rotation:false,         //Rotating figures
            rateAppearance:10,      //Probability of that obj to appear
            deltaRateAppearence:10, //How much it increases
            maxRateAppearance:50,   //Max Probability of that obj to appear
            currentMax:5,           //This will be modified with time
            delta:3,                //Each level how many objs are added
            maximum:50              //Must remain constant, max objects on scene
      };
  }

  //Las dimensiones son en relacion al character
  getObjectsConfig({width,height,depth}){
    return {
      box:{
        min_width: width*0.25,
        min_height: height*0.25,
        min_depth: depth*0.25,

        max_width: width*0.5,
        max_height: height*0.5,
        max_depth: depth*0.5
      },
      sphere:{
        min_radius:width*0.25,
        max_radius:width*0.50
      },
      cylinder:{
        min_radius:width*0.25,
        min_height: height*0.25,

        max_radius: width*0.75,
        max_height: height*0.75
      }
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
    const {currentMax,rateAppearance} = this.state.difficulty
    if (this.world.bodies.length<currentMax  && 
        Math.random()*100<rateAppearance)
    {
      this.createObstacle();
    }

    if (this.toDelete.size>0) //Si tenemos pendientes por borrar...hacerlo
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
    //0 por que se debe llamar esta funcion en cuanto se crea el world
    this.world.bodies[0].position.set(newPos.x, newPos.y, newPos.z);
    this.setState( { character:{...character,position:newPos} } );
  }

  renderObjects(){
    return this.world.bodies.map( ({position,quaternion,shapes,_bodyColor},i)=>{
        if (i>1) 
        {
          switch(shapes[0].type){
            case BODY_TYPES.BOX:
              const {x,y,z} = shapes[0].halfExtents;
              return (
                <Cube
                  key={i}
                  color={_bodyColor}
                  position={new THREE.Vector3().copy(position)}
                  quaternion={new THREE.Quaternion().copy(quaternion)}
                  width={x}
                  height={y}
                  depth={z}/>);
            case BODY_TYPES.CYLINDER:
              return (
                <Cylinder
                  key={i}
                  color={_bodyColor}
                  position={new THREE.Vector3().copy(position)}
                  quaternion={new THREE.Quaternion().copy(quaternion)}
                  radius={shapes[0].boundingSphereRadius*0.35}
                  height={shapes[0].boundingSphereRadius*0.90}/>);             
            case BODY_TYPES.SPHERE: 
              return (
                <Sphere
                  key={i}
                  color={_bodyColor}
                  position={new THREE.Vector3().copy(position)}
                  quaternion={new THREE.Quaternion().copy(quaternion)}
                  radius={ shapes[0].radius/2 }/>); 
            default:
              throw new BodyTypeException("Wrong type on renderObjects");
          }
        }
        return null;
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
          color={"#F0F0F0"}/>
      </mesh>
    );
  }
  
  render() {
    const {width, height} = this.state;

    return (
      <div>
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
              shadowMapWidth={2048}
              shadowMapHeight={2048}
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
      </div>
    );
  }
}

function mapStateToProps({time,paused,level}){
  return {paused,level,time};
}

export default connect(mapStateToProps)(Pressure(Scene,pressureConfig) ) ;