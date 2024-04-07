import { ExtendedObject3D } from "enable3d";

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

/** Get the length of a vector */
export const length = (vec3: Vector3) => Math.sqrt(lengthSqr(vec3));

/** Get the length squared of a vector */
export const lengthSqr = (vec3: Vector3) =>
  vec3.x * vec3.x + vec3.y * vec3.y + vec3.z * vec3.z;

/** Returns true if an object is moving */
export const isMoving = (obj: ExtendedObject3D) =>
  lengthSqr(obj.body.velocity) > 0.0001 ||
  lengthSqr(obj.body.angularVelocity) > 0.0001;

/** Debounce call to a function */
export const debounce = (callback: (...args: any[]) => void, wait: number) => {
  let timeoutId: number | undefined = undefined;
  return (...args: any[]) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback(...args);
    }, wait);
  };
};

/** Get random number between -range and +range */
export const random = (range: number = 1) => (Math.random() * 2 - 1) * range;

/** Get dimensions (excluding scroll bars) of an element with specific id */
export const getDimensions = (id: string) => {
  const el = document.getElementsByTagName(id)[0];
  return { x: el.clientWidth, y: el.clientHeight };
};
