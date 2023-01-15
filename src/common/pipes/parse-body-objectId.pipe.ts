import { Injectable, PipeTransform } from '@nestjs/common';
import { ObjectId } from 'mongodb';

type ValueType = 'array' | 'string';

type ParseValueArgs<I> = {
  value: I;
  key: keyof I;
  type: ValueType;
};

@Injectable()
export class ParseObjectIdsPipe<I extends { [k: string]: any }>
  implements PipeTransform
{
  constructor(
    private key: keyof I | Array<keyof I>,
    private valueType: ValueType | ValueType[],
  ) {}

  private parseString(value: string): ObjectId {
    return new ObjectId(value);
  }

  private parseArray(value: string[]): ObjectId[] {
    return value.map(this.parseString);
  }

  private parseValue({ value, key, type }: ParseValueArgs<I>) {
    if (type === 'array') {
      return this.parseArray(value[key]);
    }

    if (type === 'string') {
      return this.parseString(value[key]);
    }
  }

  transform(value: I): Record<string, any> {
    if (Array.isArray(this.key) && Array.isArray(this.valueType)) {
      if (this.key.length === this.valueType.length) {
        const parsedValues = this.key.reduce((acc, k, index) => {
          const type = this.valueType[index] as ValueType;
          const parsedValue = this.parseValue({ value, key: k, type });

          return {
            ...acc,
            [k]: parsedValue,
          };
        }, {});

        return {
          ...value,
          ...parsedValues,
        };
      } else {
        throw new Error(
          'Length of arrays "key" and "valueType" doesn\'t match',
        );
      }
    }

    if (typeof this.key === 'string' && typeof this.valueType === 'string') {
      const parsedValue = this.parseValue({
        value,
        key: this.key,
        type: this.valueType,
      });

      return {
        ...value,
        [this.key]: parsedValue,
      };
    }

    throw new Error('Type of "key" and "valueType" doesn\'t match');
  }
}
