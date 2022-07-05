import { equalArrays } from './arrays.utils';

export const isObject = (value: any): boolean => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

export const isObjects = (...values: any[]): boolean => {
  return values.every((value) => isObject(value));
};

export const objectsArrayToFlattenValues = <Res = any>(
  object: Record<string, any>[],
): Res[] => {
  return object.map((o) => Object.values(o)).flat();
};

export const equalObjectsValue = (
  a: Record<string, any>,
  b: Record<string, any>,
): boolean => {
  return equalArrays(Object.values(a), Object.values(b));
};
