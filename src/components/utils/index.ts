import type { Coords } from '@/types.d';

export const getScaledCoords = (coords: Coords, minCoords: Coords, scale: number): Coords =>
  [coords[0] * scale + scale * minCoords[0], coords[1] * scale + scale * minCoords[1]];

export const pointInCircle = (pCoords: Coords, cCoords: Coords, radius: number): boolean =>
  Math.sqrt(Math.pow(pCoords[0] - cCoords[0], 2) + Math.pow(pCoords[1] - cCoords[1], 2)) < radius;