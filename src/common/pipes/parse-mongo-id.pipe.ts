import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log(value, typeof(value))
    if( !isValidObjectId(value) ) throw new BadRequestException(`Value is not a valid mongo id.`);
    return value;
  }
}
