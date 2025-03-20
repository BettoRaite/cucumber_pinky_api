import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { retry } from 'rxjs';

@ValidatorConstraint({ name: 'isDateAfter', async: false }) // Renamed to reflect the logic
export class IsDateAfterConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];

    // Ensure both values are valid dates
    const startDate = new Date(value);
    const endDate = new Date(relatedValue);
    if (!(startDate && endDate)) {
      return false;
    }
    console.log(value, relatedValue);
    // Check if `value` is after `relatedValue`
    return endDate.getTime() > startDate.getTime();
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    return `${args.property} must be after ${relatedPropertyName}`; // Updated error message
  }
}

export function IsDateAfter(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsDateAfterConstraint,
    });
  };
}
