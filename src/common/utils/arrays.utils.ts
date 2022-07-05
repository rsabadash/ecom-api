import { isObjects, objectsArrayToFlattenValues } from './object.utils';

export const isArrays = (...values: any[]): boolean => {
  return values.every((value) => Array.isArray(value));
};

export const equalArrays = (a: any[], b: any[]): boolean => {
  if (a.length !== b.length) return false;

  if (isObjects(a[0], b[0])) {
    const aValue = objectsArrayToFlattenValues(a);
    const bValue = objectsArrayToFlattenValues(b);

    return equalArrays(aValue, bValue);
  }

  const uniqueValues = new Set([...a, ...b]);

  for (const v of uniqueValues) {
    const aCount = a.filter((e) => e === v).length;
    const bCount = b.filter((e) => e === v).length;

    if (aCount !== bCount) return false;
  }

  return true;
};
