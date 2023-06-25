import { Injectable } from '@nestjs/common';
import bigDecimal from 'js-big-decimal';

type MathArg = number | string | null | undefined;

@Injectable()
export class MathService {
  add(number1: MathArg, number2): string {
    return bigDecimal.add(number1, number2);
  }

  parseToDecimal(value: string): string {
    const valueToParse = value.trim() ? value : '0';

    return Number.parseFloat(valueToParse).toFixed(2);
  }
}
