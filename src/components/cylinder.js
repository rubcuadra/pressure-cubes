import React,{Component} from 'react';
import * as THREE from 'three';
import PropTypes from 'prop-types';

const meshScale = new THREE.Vector3(1, 1, 1).multiplyScalar(2);
class Cylinder extends Component {
  static propTypes = {
    position: PropTypes.instanceOf(THREE.Vector3).isRequired,
    quaternion: PropTypes.instanceOf(THREE.Quaternion).isRequired,
    radius: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  };

  render() {
    const {position,quaternion,height,radius,color} = this.props;

    return (
      <mesh
        position={position}
        quaternion={quaternion}
        scale={meshScale}
        castShadow>

        <cylinderGeometry
          radiusTop = {radius}
          height= {height}
          radiusBottom = {radius}
          radialSegments={1}
          heightSegments={1}/>

        <meshPhongMaterial
          color={color}/>

    </mesh>);
  }
}
export default Cylinder;