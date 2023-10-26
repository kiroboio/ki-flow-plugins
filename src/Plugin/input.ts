import { ethers } from "ethers";

import { InstanceOf } from "../helpers/instanceOf";
import { EnhancedJsonFragmentType } from "../types";

class ArrayInput<T extends string, P extends readonly EnhancedJsonFragmentType[]> {
  private _type: T;
  private _components: P;

  private _value: any[] = [];

  constructor(type: T, components: P) {
    this._type = type;
    this._components = components;

    return new Proxy(this, {
      get(target, prop, receiver) {},
    });
  }
}

export class Input<P extends readonly EnhancedJsonFragmentType[]> {
  private _params: P;
  private _value: any;

  private _tupleData: Record<string, any> = {};
  private _arrayData: Record<string, any> = {};

  constructor(params: P) {
    this._params = params;

    // Check if any of the params are tuples. If yes, create Input for them and store them in _tupleData
    params.forEach((p) => {
      if (p.type === "tuple") {
        this._tupleData[p.name] = new Input(p.components as ReadonlyArray<EnhancedJsonFragmentType>);
      }
      if (p.type.endsWith("]")) {
        this._arrayData[p.name] = new Input([p]);
      }
    });

    return new Proxy(this, {
      get(target, prop, receiver) {
        // TODO: If the prop is a key in the params, return the value
        const param = target._params.find((p) => p.name === prop);
        if (param) {
        }

        // Prop is not any of the params, return the default behavior
        return Reflect.get(target, prop, receiver);
      },
    });
  }

  set(value: any[] | Record<string, any>) {
    if (Array.isArray(value)) {
      this._value = value;
    } else {
      // Verify every key
      Object.keys(value).forEach((key) => {
        const param = this._params.find((p) => p.name === key);
        if (!param) {
          throw new Error(`Invalid key ${key}`);
        }
      });
      this._value = this._params.map((p) => value[p.name]);
    }
  }
}

export class InputFragment<P extends readonly EnhancedJsonFragmentType[]> {
  private _params: P;
  private _value: any[] = [];

  constructor(params: P) {
    this._params = params;
  }

  set(value: any[] | Record<string, any>) {
    if (Array.isArray(value)) {
      // Verify every value
      value.forEach((v, index) => this._verify(this._params[index], v));
      this._value = value;
    }
  }

  private _verify(param: EnhancedJsonFragmentType, value: any, parentKeys: string[] = []) {
    const type = param.type;
    const key = this._keyName(param, parentKeys);

    // If the type is an array, then we need to verify each element
    if (type.endsWith("]")) {
      if (InstanceOf.Variable(value)) {
        throw new Error(`${key}: Arrays cannot be a variable`);
      }

      const paramOverride = {
        ...param,
        type: type.slice(0, type.indexOf("[")),
      };
      if (!Array.isArray(value)) {
        throw new Error(`${key}: Expected array, got ${typeof value}`);
      }
      // Check if array is like this "...[x]". If yes, verify that value.length === x.
      // Assume that uint256[3] is also possible
      const arrayLength = type.split("[")[1].match(/\d+/g);
      if (arrayLength && value.length !== +arrayLength[0]) {
        throw new Error(`${key}: Expected array of length ${arrayLength[0]}, got ${value.length}`);
      }

      value.forEach((v, index) => this._verify(paramOverride, v, [...parentKeys, `${index}`]));
      return;
    }

    if (type === "tuple") {
      if (InstanceOf.Variable(value)) {
        throw new Error(`${key}: Tuples cannot be a variable`);
      }
      if (typeof value !== "object") {
        throw new Error(`${key}: Expected object, got ${typeof value}`);
      }
      Object.entries(value).forEach(([k, v]) => {
        const paramOverride = param.components?.find((c) => c.name === k);
        if (!paramOverride) {
          throw new Error(`${key}.${k}: ${k} is not a valid parameter`);
        }
        this._verify(paramOverride, v, [...parentKeys, k]);
      });
      return;
    }

    if (InstanceOf.Variable(value)) {
      if (!param.canBeVariable) {
        throw new Error(`${key}: cannot be a variable`);
      }
    }

    if (type === "bool") {
      if (typeof value !== "boolean") {
        throw new Error(`${key}: Expected boolean, got ${typeof value}`);
      }
      return;
    }
    if (typeof value !== "string") {
      throw new Error(`${key}: Expected string, got ${typeof value}`);
    }

    if (param.type === "address") {
      return ethers.utils.isAddress(value);
    }

    if (type.startsWith("uint")) {
      if (value.includes(".")) {
        throw new Error(`${key}: Cannot be a decimal`);
      }
      if (value.startsWith("-")) {
        throw new Error(`${key}: Cannot be negative`);
      }
      if (isNaN(+value)) {
        throw new Error(`${key}: Invalid number`);
      }
      const bits = type.match(/\d+/g);
      if (bits && BigInt(value) > 2n ** BigInt(bits[0]) - 1n) {
        throw new Error(`${key}: Value too large for ${type}`);
      }
    }
  }

  private _keyName(param: P[number], parentKeys: string[] = []) {
    return [...parentKeys, param.name].join(".");
  }
}
