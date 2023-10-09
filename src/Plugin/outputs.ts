import { HandleUndefined, JsonFragmentType, Variable } from "../types";

export class Output {
  public readonly name: string;
  public readonly type: string;
  public readonly innerIndex: number;

  constructor(args: { innerIndex: number; name: string; type: string }) {
    this.innerIndex = args.innerIndex;
    this.name = args.name;
    this.type = args.type;
  }

  public getOutputVariable(nodeId: string): Variable & { type: "output" } {
    return {
      type: "output",
      id: {
        innerIndex: this.innerIndex,
        nodeId,
      },
    };
  }
}

// Create a type where:
// If the output type is a tuple, then the output should be this type where the key is the tuple name and the value is the Outputs type
// If the output type is a string, bytes or array, do not add the output
// Else add Output class

type GenericOutput<T extends JsonFragmentType> = T extends { type: "tuple" }
  ? Outputs<HandleUndefined<T["components"]>>
  : T extends { type: "string" | "bytes" | "array" }
  ? Record<string, never>
  : Output;

type Outputs<T extends readonly JsonFragmentType[] | undefined> = T extends readonly JsonFragmentType[]
  ? {
      [K in T[number]["name"]]: GenericOutput<Extract<T[number], { name: K }>>;
    }
  : Record<string, never>;

export function getOutputs<O extends ReadonlyArray<JsonFragmentType> | undefined>(args: {
  outputs?: O;
  startIndex?: number;
}): Outputs<O> {
  const { outputs, startIndex = 0 } = args;
  if (!outputs) {
    return {} as Outputs<O>;
  }
  // The logic is like this:
  // If the output is a tuple, for the tuple name specify object with the inner outputs
  // If the output is a string, bytes or array, we need to skip that slot
  // Else we need to get the output variable
  const outputData: Outputs<O> = {} as Outputs<O>;
  let index = startIndex;
  for (const output of outputs) {
    if (output.type === "tuple") {
      const innerOutputs = getOutputs({
        outputs: output.components as ReadonlyArray<JsonFragmentType>,
        startIndex: index,
      });

      outputData[output.name as keyof Outputs<O>] = innerOutputs as unknown as Outputs<O>[typeof output.name];

      index += (output.components as ReadonlyArray<JsonFragmentType>).length;
    } else if (output.type === "string" || output.type === "bytes" || output.type === "array") {
      index += 1;
    } else {
      outputData[output.name as keyof Outputs<O>] = new Output({
        innerIndex: index,
        name: output.name,
        type: output.type,
      }) as Outputs<O>[typeof output.name];
      index += 1;
    }
  }
  return outputData;
}
