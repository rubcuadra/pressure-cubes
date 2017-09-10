import React,{Component} from 'react';
import React3 from 'react-three-renderer';
import * as THREE from 'three';
import PropTypes from 'prop-types';

const meshScale = new THREE.Vector3(1, 1, 1).multiplyScalar(0.5);
class Cube extends Component {
  static propTypes = {
    position: PropTypes.instanceOf(THREE.Vector3).isRequired,
    quaternion: PropTypes.instanceOf(THREE.Quaternion).isRequired,
  };

  render() {
    const {
      position,
      quaternion,
    } = this.props;

    return (<mesh
      position={position}
      quaternion={quaternion}
      scale={meshScale}

      castShadow
    >
      <geometryResource
        resourceId="cubeGeo"
      />
      <materialResource
        resourceId="cubeMaterial"
      />
    </mesh>);
  }
}
export default Cube;