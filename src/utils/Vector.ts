import { Vector3 } from 'three/src/math/Vector3';

export namespace Vector {
  export const UP       = new Vector3( 0,  1,  0);
  export const DOWN     = new Vector3( 0, -1,  0);

  export const RIGHT    = new Vector3( 1,  0,  0);
  export const LEFT     = new Vector3(-1,  0,  0);

  export const FORWARD  = new Vector3( 0,  0,  1);
  export const BACKWARD = new Vector3( 0,  0, -1);

  export const random = (): Vector3 => new Vector3(
    Math.random() * 2.0 - 1.0,
    Math.random() * 2.0 - 1.0,
    Math.random() * 2.0 - 1.0
  );
}
