// Create a function that parses Param array and returns an object with correct values

import { Param } from "../types";

export function parseParams(data: Param[]) {
  const result: any = {};
  data.forEach((p) => {
    if (p.type === "tuple") {
      result[p.name] = parseParams(p.value as Param[]);
      return;
    }
    if (p.type === "tuple[]") {
      result[p.name] = (p.value as Param[]).map((v) => parseParams(v.value as Param[]));
      return;
    }
    result[p.name] = p.value;
  });
  return result;
}
