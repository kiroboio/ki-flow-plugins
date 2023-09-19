import { Variable } from "../types";

export class InstanceOf {
  static Variable = (object: any): object is Variable => {
    return typeof object === "object" && "type" in object && "id" in object;
  };
}
