import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { ObjectId } from 'mongodb';

export function IsMongoObjectId(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'IsMongoObjectId',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any): boolean {
          return ObjectId.isValid(value);
        },
        defaultMessage({ value, property }: ValidationArguments): string {
          if (Array.isArray(value)) {
            return `Each value of "${property}" should be an ObjectId`;
          }

          return `Value of "${property}" should be ObjectId`;
        },
      },
    });
  };
}
