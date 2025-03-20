import {
  IsString,
  Length,
  IsDate,
  IsEnum,
  IsBoolean,
  IsArray,
  IsNumber,
} from 'class-validator';
import { WEEKDAYS } from 'src/lib/constants';
import { Transform } from 'class-transformer';
import { IsDateAfter } from 'src/shared/validation/is-date-after.validation';

export class CreateActivityDto {
  @IsString()
  @Length(3, 255)
  name;
  // @IsDateAfter('end')
  @Transform(({ value }) => new Date(value))
  @IsDate()
  start;
  @Transform(({ value }) => new Date(value))
  @IsDate()
  end;
  @IsString()
  color;
  @IsArray()
  @IsEnum(WEEKDAYS, { each: true })
  weekdays;
  @IsBoolean()
  isRepeating;
}
