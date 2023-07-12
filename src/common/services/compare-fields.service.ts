import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { equalObjectsValue, isObjects } from '../utils/object.utils';
import { equalArrays, isArrays } from '../utils/arrays.utils';

@Injectable()
export class CompareFieldsService {
  compare<Entity>(
    newEntity: Partial<Entity> & { id?: undefined | string },
    existedEntity: Partial<Entity> & { _id?: undefined | ObjectId },
  ): {
    _id: undefined | ObjectId;
    updatedFields: Partial<Entity>;
  } {
    let updatedFields: Partial<Entity> = {};

    const keys = Object.keys(newEntity) as Array<keyof Entity>;

    keys.forEach((key) => {
      const newEntityValue = newEntity[key];
      const existedEntityValue = existedEntity[key];

      if (
        // check if value exists in DB model
        existedEntityValue !== undefined &&
        !this.areFieldsValueEqual(newEntityValue, existedEntityValue)
      ) {
        updatedFields = {
          ...updatedFields,
          [key]: newEntityValue,
        };
      }
    });

    return {
      _id: existedEntity._id,
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
