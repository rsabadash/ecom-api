import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { equalObjectsValue, isObjects } from '../utils/object.utils';
import { equalArrays, isArrays } from '../utils/arrays.utils';

@Injectable()
export class CompareFieldsService {
  compare<Entity>(
    newEntity,
    existedEntity,
  ): {
    _id: ObjectId;
    updatedFields: Partial<Entity>;
  } {
    let updatedFields: Partial<Entity> = {};

    const { _id, ...rest } = existedEntity;
    const categoryKeys = Object.keys(rest) as Array<keyof Entity>;

    categoryKeys.forEach((key) => {
      const dataValue = newEntity[key];

      if (!this.areFieldsValueEqual(dataValue, existedEntity[key])) {
        updatedFields = {
          ...updatedFields,
          [key]: dataValue,
        };
      }
    });

    return {
      _id,
      updatedFields,
    };
  }

  areFieldsValueEqual(fieldA: any, fieldB: any): boolean {
    if (isObjects(fieldA, fieldB)) {
      return equalObjectsValue(fieldA, fieldB);
    }

    if (isArrays(fieldA, fieldB)) {
      return equalArrays(fieldA, fieldB);
    }

    return String(fieldA) === String(fieldB);
  }
}
