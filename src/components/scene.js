import React,{Component} from 'react';
import Pressure from 'react-pressure';
import React3 from 'react-three-renderer';
import * as THREE from 'three';
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
    
    // object = new THREE.Mesh( new THREE.BoxGeometry( 100, 100, 100, 4, 4, 4 ), material );
    // object.position.set( -200, 0, 0 );
    // scene.add( object );
    //Configurar estado, onAnimate es el encargo de invocar el render
    this._onAnimate = this._onAnimate.bind(this);
    this.state = {character:this.resetCharacter()};

    // var map = new THREE.TextureLoader().load( 'textures/UV_Grid_Sm.jpg' );
    // map.wrapS = map.wrapT = THREE.RepeatWrapping;
    // map.anisotropy = 16;
    // var material = new THREE.MeshLambertMaterial( { map: map, side: THREE.DoubleSide } );
    // const object = new THREE.Mesh( new THREE.BoxGeometry( 100, 100, 100, 4, 4, 4 ), material );
    // console.log(object)
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

  _onAnimate() {
    this._updateCharacterPosition();
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

        </scene>
      </React3>
    );
  }
}

export default Pressure(Scene,pressureConfig) ;