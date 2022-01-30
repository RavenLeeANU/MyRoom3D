import { Vector3 } from "@babylonjs/core";

 export const calcDistance3D = (positionA: Vector3, positionB: Vector3) => {
    return Math.sqrt(
      (positionA.x - positionB.x) * (positionA.x - positionB.x) +
        (positionA.y - positionB.y) * (positionA.y - positionB.y) +
        (positionA.z - positionB.z) * (positionA.z - positionB.z)
    );
  };