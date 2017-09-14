import React,{Component} from 'react';
import * as THREE from 'three';
import PropTypes from 'prop-types';

const meshScale = new THREE.Vector3(1, 1, 1).multiplyScalar(2);
class Cube extends Component {
  static propTypes = {
    position: PropTypes.instanceOf(THREE.Vector3).isRequired,
    quaternion: PropTypes.instanceOf(THREE.Quaternion).isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    depth: PropTypes.number.isRequired
  };
  //0x88FF88
  render() {
    const {position,quaternion,width,height,depth,color} = this.props;

    return (
      <mesh
        position={position}
        quaternion={quaternion}
        scale={meshScale}
        castShadow>

        <boxGeometry
          width= {width}
          height= {height}
          depth= {depth}
          widthSegments={10}
          heightSegments={10}/>

        <meshPhongMaterial
          color={color}/>

    </mesh>);
  }
}
export default Cube;