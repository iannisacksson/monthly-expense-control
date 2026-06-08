import { validateSync, ValidationError } from "class-validator";
import { UnprocessableEntityError } from "./errors";

export const validate = (value: any): void => {
  const errors = validateSync(value, {
    forbidNonWhitelisted: true,
    whitelist: true,
  });

  if (errors.length) {
    throw new UnprocessableEntityError(
      errors
        .map((err: ValidationError) => JSON.stringify(err.constraints))
        .join("; "),
    );
  }
};

export class Validation<T> {
  constructor(props: T) {
    Object.assign(this, props);
    validate(this);
  }
}
