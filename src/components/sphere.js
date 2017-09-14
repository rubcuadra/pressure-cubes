import React,{Component} from 'react';
import * as THREE from 'three';
import PropTypes from 'prop-types';

const meshScale = new THREE.Vector3(1, 1, 1).multiplyScalar(2);
class Sphere extends Component {
  static propTypes = {
    position: PropTypes.instanceOf(THREE.Vector3).isRequired,
    quaternion: PropTypes.instanceOf(THREE.Quaternion).isRequired,
    radius: PropTypes.number.isRequired
  };

  render() {
    const {position,quaternion,radius,color} = this.props;

    return (
      <mesh
        position={position}
        quaternion={quaternion}
        scale={meshScale}
        castShadow>

        <sphereGeometry
          radius = {radius}
          widthSegments={10}
          heightSegments={10}/>

        <meshPhongMaterial
          color={color}/>

    </mesh>);
  }
}
export default Sphere;