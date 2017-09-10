import React,{Component} from 'react';
import * as THREE from 'three';
import PropTypes from 'prop-types';

const meshScale = new THREE.Vector3(1, 1, 1).multiplyScalar(2);
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
        scale={meshScale}
        castShadow>

      <geometryResource resourceId={this.props.geometryId}/>
      <materialResource resourceId={this.props.materialId}/>
    </mesh>);
  }
}
export default Cube;