import { Variable } from "../types";

export class InstanceOf {
  static Variable = (object: any): object is Variable => {
    return typeof object === "object" && "type" in object && "id" in object;
  };
}

// Create a function that checks if the value is not undefined or is Variable
export function isVariableOrUndefined(value: any): value is Variable | undefined {
  return typeof value === "undefined" || InstanceOf.Variable(value);
}
