import { Injectable, PipeTransform } from '@nestjs/common';
import { ObjectId } from 'mongodb';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform {
  transform(value: string): ObjectId {
    return new ObjectId(value);
  }
}
