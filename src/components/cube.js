import React,{Component} from 'react';
import * as THREE from 'three';
import PropTypes from 'prop-types';

// const meshScale = new THREE.Vector3(1, 1, 1).multiplyScalar(0.5);
// <mesh scale={meshScale} />
class Cube extends Component {
  static propTypes = {
    position: PropTypes.instanceOf(THREE.Vector3).isRequired,
    quaternion: PropTypes.instanceOf(THREE.Quaternion).isRequired,
  };

  render() {
    const {position,quaternion} = this.props;
    return (
      <mesh
        position={position}
        quaternion={quaternion}
        
        castShadow>

      <geometryResource resourceId={this.props.geometryId}/>
      <materialResource resourceId={this.props.materialId}/>
    </mesh>);
  }
}
export default Cube;