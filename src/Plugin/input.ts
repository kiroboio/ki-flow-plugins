import { EnhancedJsonFragmentType, HandleUndefined, Param } from "../types";
import {
  BaseInputData,
  GetArrayType,
  GetInputFragmentType,
  InputFragmentType,
  InputFragmentValue,
  InputMethods,
  InputSet,
} from "../types/input";

export class InputFragment<F extends EnhancedJsonFragmentType> {
  type: F["type"];
  name: F["name"];

  private _data: InputFragmentValue<F> | undefined;

  constructor(fragment: F) {
    this.type = fragment.type;
    this.name = fragment.name;
  }

  // @ts-ignore
  get() {
    return this._data;
  }

  getAsParam(): Param {
    return {
      name: this.name,
      type: this.type,
      value: this._data as any,
      customType: false,
      // hashed: ....
    };
  }

  set(value: InputFragmentValue<F>) {
    this._data = value;
  }

  getFullType() {
    return this.type;
  }

  static create<F extends EnhancedJsonFragmentType>(fragment: F): GetInputFragmentType<F> {
    if (fragment.type === "tuple") {
      if (!fragment.components) {
        throw new Error(`Invalid fragment ${fragment.name}`);
      }
      return new TupleInputFragment(fragment as any) as any;
    }
    if (fragment.type.endsWith("]")) {
      return new ArrayInputFragment(fragment) as any;
    }
    return new InputFragment(fragment) as any;
  }
}

export class TupleInputFragment<F extends EnhancedJsonFragmentType> {
  type: F["type"];
  name: F["name"];

  private _data: Record<string, InputFragmentType> = {};

  constructor(fragment: F) {
    this.type = fragment.type;
    this.name = fragment.name;

    this._data = fragment.components?.reduce((acc, cur) => {
      return {
        ...acc,
        [cur.name]: InputFragment.create(cur),
      };
    }, {}) as any;

    return new Proxy(this, {
      get(target, prop, receiver) {
        if (typeof prop === "string") {
          const param = target._data[prop];
          if (param) {
            return param;
          }
        }

        return Reflect.get(target, prop, receiver);
      },
    });
  }

  // @ts-ignore
  get() {
    const result: Record<string, any> = {};
    Object.entries(this._data).forEach(([key, value]) => {
      if (value instanceof InputFragment) {
        result[key] = value.get();
      } else if (value instanceof ArrayInputFragment) {
        result[key] = value.get();
      } else if (value instanceof TupleInputFragment) {
        result[key] = value.get();
      }
    });
    return result;
  }

  getAsParam(): Param {
    return {
      name: this.name,
      type: this.type,
      value: Object.values(this._data).map((val) => {
        return val.getAsParam();
      }),
      customType: true,
      // hashed: ....
    };
  }

  set(value: InputMethods<HandleUndefined<F["components"]>>) {
    // Verify every key
    Object.keys(value).forEach((key) => {
      const param = this._data[key];
      if (param) {
        // @ts-ignore
        param.set(value[key] as any);
      } else {
        throw new Error(`Invalid key ${key}`);
      }
    });
  }

  getFullType() {
    const params = Object.values(this._data).map((p) => p.getFullType()) as string[];
    return `(${params.join(",")})`;
  }
}

export class ArrayInputFragment<F extends EnhancedJsonFragmentType> {
  type: F["type"];
  name: F["name"];

  private _innerType: GetArrayType<F>;
  private _components: readonly EnhancedJsonFragmentType[] | undefined;

  private _data: InputFragmentType[] = [];

  constructor(fragment: F) {
    this.type = fragment.type;
    this.name = fragment.name;
    this._innerType = fragment.type.slice(0, fragment.type.indexOf("[")) as GetArrayType<F>;
    this._components = fragment.components;

    return new Proxy(this, {
      get(target, prop, receiver) {
        if (typeof prop === "string" && !isNaN(+prop)) {
          const index = +prop;
          if (target._data[index]) {
            return target._data[index];
          }
          const input = InputFragment.create({
            name: `${target.name}[${index}]`,
            type: target._innerType,
            components: fragment.components,
          });
          target._data[index] = input;
          return input;
        }

        return Reflect.get(target, prop, receiver);
      },
    });
  }

  // @ts-ignore
  get() {
    // @ts-ignore
    return this._data.map((d) => d.get());
  }

  getAsParam(): Param {
    return {
      name: this.name,
      type: this.type,
      value: this._data.map((val) => {
        return val.getAsParam();
      }),
      customType: this._components !== undefined,
      // hashed: ....
    };
  }

  set(value: InputFragmentValue<F>) {
    // Verify every value
    (value as Array<any>).forEach((v, index) => {
      if (this._data[index]) {
        this._data[index].set(v as any);
      } else {
        const input = InputFragment.create({
          name: `${this.name}[${index}]`,
          type: this._innerType,
          components: this._components,
        });
        input.set(v as any);
        this._data[index] = input;
      }
    });
  }

  getFullType() {
    if (this._components) {
      const params = this._components.map((p) => InputFragment.create(p).getFullType());
      return `(${params.join(",")})${this.type.slice(this.type.indexOf("["))}`;
    }
    return this.type;
  }
}

export class BaseInput<P extends readonly EnhancedJsonFragmentType[]> {
  private _data: BaseInputData<P> = [];

  constructor(params: P) {
    this._data = (params || []).map((p) => {
      return InputFragment.create(p);
    }) as BaseInputData<P>;

    return new Proxy(this, {
      get(target, prop, receiver) {
        const param = target._data.find((p) => p.name === prop);
        if (param) {
          return param;
        }

        // Prop is not any of the params, return the default behavior
        return Reflect.get(target, prop, receiver);
      },
    });
  }

  get data() {
    return this._data;
  }

  get(): InputSet<P> {
    // @ts-ignore
    return this._data.reduce((acc, cur) => {
      return { ...acc, [cur.name]: cur.get() };
    }, {} as InputSet<P>);
  }

  getAsArray() {
    return this._data.map((d) => d.get());
  }

  getCoreParameters(): Param[] {
    return this._data.map((d) => {
      return d.getAsParam();
    });
  }

  getFunctionSignature(method: string) {
    const params = this._data.map((p) => p.type);
    return `${method}(${params.join(",")})`;
  }

  set(value: any[] | Partial<InputSet<P>>) {
    if (Array.isArray(value)) {
      value.forEach((v, index) => {
        const param = this._data[index];
        if (param) {
          this._data[index].set(v);
        } else {
          throw new Error(`Invalid index ${index}`);
        }
      });
    } else {
      // Verify every key
      Object.keys(value).forEach((key) => {
        const param = this._data.find((p) => p.name === key);
        if (!param) {
          throw new Error(`Invalid key ${key}`);
        }
        // @ts-ignore
        param.set(value[key]);
      });
    }
  }
}

export function createInput<P extends readonly EnhancedJsonFragmentType[]>(params: P) {
  return new BaseInput(params) as BaseInput<P> & InputMethods<P>;
}

// export class InputFragment<P extends readonly EnhancedJsonFragmentType[]> {
//   private _params: P;
//   private _value: any[] = [];

//   constructor(params: P) {
//     this._params = params;
//   }

//   set(value: any[] | Record<string, any>) {
//     if (Array.isArray(value)) {
//       // Verify every value
//       value.forEach((v, index) => this._verify(this._params[index], v));
//       this._value = value;
//     }
//   }

//   private _verify(param: EnhancedJsonFragmentType, value: any, parentKeys: string[] = []) {
//     const type = param.type;
//     const key = this._keyName(param, parentKeys);

//     // If the type is an array, then we need to verify each element
//     if (type.endsWith("]")) {
//       if (InstanceOf.Variable(value)) {
//         throw new Error(`${key}: Arrays cannot be a variable`);
//       }

//       const paramOverride = {
//         ...param,
//         type: type.slice(0, type.indexOf("[")),
//       };
//       if (!Array.isArray(value)) {
//         throw new Error(`${key}: Expected array, got ${typeof value}`);
//       }
//       // Check if array is like this "...[x]". If yes, verify that value.length === x.
//       // Assume that uint256[3] is also possible
//       const arrayLength = type.split("[")[1].match(/\d+/g);
//       if (arrayLength && value.length !== +arrayLength[0]) {
//         throw new Error(`${key}: Expected array of length ${arrayLength[0]}, got ${value.length}`);
//       }

//       value.forEach((v, index) => this._verify(paramOverride, v, [...parentKeys, `${index}`]));
//       return;
//     }

//     if (type === "tuple") {
//       if (InstanceOf.Variable(value)) {
//         throw new Error(`${key}: Tuples cannot be a variable`);
//       }
//       if (typeof value !== "object") {
//         throw new Error(`${key}: Expected object, got ${typeof value}`);
//       }
//       Object.entries(value).forEach(([k, v]) => {
//         const paramOverride = param.components?.find((c) => c.name === k);
//         if (!paramOverride) {
//           throw new Error(`${key}.${k}: ${k} is not a valid parameter`);
//         }
//         this._verify(paramOverride, v, [...parentKeys, k]);
//       });
//       return;
//     }

//     if (InstanceOf.Variable(value)) {
//       if (!param.canBeVariable) {
//         throw new Error(`${key}: cannot be a variable`);
//       }
//     }

//     if (type === "bool") {
//       if (typeof value !== "boolean") {
//         throw new Error(`${key}: Expected boolean, got ${typeof value}`);
//       }
//       return;
//     }
//     if (typeof value !== "string") {
//       throw new Error(`${key}: Expected string, got ${typeof value}`);
//     }

//     if (param.type === "address") {
//       return ethers.utils.isAddress(value);
//     }

//     if (type.startsWith("uint")) {
//       if (value.includes(".")) {
//         throw new Error(`${key}: Cannot be a decimal`);
//       }
//       if (value.startsWith("-")) {
//         throw new Error(`${key}: Cannot be negative`);
//       }
//       if (isNaN(+value)) {
//         throw new Error(`${key}: Invalid number`);
//       }
//       const bits = type.match(/\d+/g);
//       if (bits && BigInt(value) > 2n ** BigInt(bits[0]) - 1n) {
//         throw new Error(`${key}: Value too large for ${type}`);
//       }
//     }
//   }

//   private _keyName(param: P[number], parentKeys: string[] = []) {
//     return [...parentKeys, param.name].join(".");
//   }
// }
