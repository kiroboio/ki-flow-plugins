import { ethers } from 'ethers'
import { type JsonFragmentType, type JsonFragment } from './types/createPlugin'
import { ChainId, Param } from './types'
import { IPluginCall } from './types/coreLib'

type HandleUndefined<T> = T extends undefined ? [] : T

type FunctionParameterInput<T extends string, C extends readonly JsonFragmentType[]> = T extends 'tuple'
  ? {
      [K in C[number]['name']]?: FunctionParameterInput<
        Extract<C[number], { name: K }>['type'],
        HandleUndefined<Extract<C[number], { name: K }>['components']>
      >
    }
  : T extends 'bool'
  ? boolean | undefined
  : T extends `${infer _}[${string}`
  ? Array<FunctionParameterInput<_, C>>
  : string | undefined

type FunctionParameterValue<
  N extends string,
  T extends string,
  C extends readonly JsonFragmentType[]
> = T extends 'tuple'
  ? {
      [K in C[number]['name']]: FunctionParameter<
        K,
        Extract<C[number], { name: K }>['type'],
        HandleUndefined<Extract<C[number], { name: K }>['components']>
      >
    }
  : T extends 'bool'
  ? FunctionParameter<T, 'bool', C>
  : T extends `${infer _}[${string}`
  ? Array<FunctionParameterValue<N, _, C>>
  : FunctionParameter<N, T, C>

export class FunctionParameter<
  N extends string = string,
  I extends string = string,
  C extends readonly JsonFragmentType[] = readonly JsonFragmentType[]
> {
  public readonly name: N
  public readonly internalType: I
  public readonly components: FunctionParameter[]

  public value?: FunctionParameterValue<N, I, C>

  constructor(args: { name: N; type: I; components?: C }) {
    this.name = args.name
    this.internalType = args.type
    this.components = args.components?.map((c) => new FunctionParameter(c)) || []
  }

  get type(): string {
    // If a type is tuple AND has components, it's a custom type
    if (this._isTuple()) {
      // If the internalType ends with [] or [number], it's an array
      let arrayString = ''
      if (this._isArray()) {
        // Get "[]" or "[number]" from the end of the string
        arrayString = this.internalType.slice(this.internalType.lastIndexOf('['))
      }

      return `(${this.components.map((c) => c.type).join(',')})${arrayString}`
    }
    return this.internalType
  }

  public set(value: FunctionParameterInput<I, C>) {
    if (this._isTuple()) {
      if (this._isArray()) {
        const storedVal: FunctionParameterValue<N, 'tuple[]', C> = []
        const inputVal = value as unknown as FunctionParameterInput<'tuple[]', C>
        inputVal.forEach((v) => {
          const val: FunctionParameterValue<N, 'tuple', C> = {} as any
          Object.entries<any>(v).forEach((k) => {
            const clone = this._findComponentFromName(k[0])?.clone()
            if (clone) {
              clone.set(k[1])
              val[k[0] as keyof typeof val] = clone
            }
          })
          storedVal.push(val)
        })
        this.value = storedVal as any
        return this.get()
      }
      const storedVal: FunctionParameterValue<N, 'tuple', C> = {} as any

      const val = value as unknown as FunctionParameterInput<'tuple', C>
      Object.entries<any>(val).forEach((k) => {
        const clone = this._findComponentFromName(k[0])?.clone()
        if (clone) {
          clone.set(k[1])
          storedVal[k[0] as keyof typeof storedVal] = clone
        }
      })

      this.value = storedVal as any
      return this.get()
    }
    this.value = value as unknown as FunctionParameterValue<N, I, C>
    return this.get()
  }

  public get(): FunctionParameterInput<I, C> | undefined {
    if (this._isTuple()) {
      if (this._isArray()) {
        const outputVal: FunctionParameterInput<'tuple[]', C> = []
        const inputVal = this.value as FunctionParameterValue<N, 'tuple[]', C>
        inputVal.forEach((v) => {
          const arrayVal: FunctionParameterInput<'tuple', C> = {}
          Object.entries<any>(v).forEach((k) => {
            arrayVal[k[0] as keyof typeof arrayVal] = k[1].get()
          })
          outputVal.push(arrayVal)
        })
        return outputVal as unknown as FunctionParameterInput<I, C>
      }
      const outputVal: FunctionParameterInput<'tuple', C> = {}
      const inputVal = this.value as FunctionParameterValue<N, 'tuple', C>
      Object.entries<any>(inputVal).forEach((k) => {
        outputVal[k[0] as keyof typeof outputVal] = k[1].get()
      })
      return outputVal as FunctionParameterInput<I, C>
    }
    return this.value as unknown as FunctionParameterInput<I, C>
  }

  public getAsCoreParam(): Param {
    const baseParam = {
      name: this.name,
      type: this.type,
    }
    if (this._isTuple()) {
      // Check if the tuple is an array
      if (this._isArray()) {
        const val = this.value as FunctionParameterValue<N, 'tuple[]', C>
        return {
          ...baseParam,
          customType: true,
          value: val.map((p) => {
            return Object.entries<any>(p).map((c) => c[1].getAsCoreParam())
          }),
        }
      }
      const val = this.value as FunctionParameterValue<N, 'tuple', C>
      return {
        ...baseParam,
        customType: true,
        value: Object.entries<any>(val).map((c) => c[1].getAsCoreParam()),
      }
    }
    return {
      ...baseParam,
      value: this.get(),
    }
  }

  public clone(): FunctionParameter {
    return new FunctionParameter({
      name: this.name,
      type: this.internalType,
      components: this.components.map((c) => c.clone()),
    })
  }

  private _findComponentFromName(name: string): FunctionParameter | undefined {
    return this.components.find((c) => c.name === name)
  }

  private _isTuple(): boolean {
    return this.internalType.includes('tuple') && this.components.length > 0
  }

  private _isArray(): boolean {
    return this.internalType.endsWith(']')
  }
}

type PluginFunctionInput<A extends readonly JsonFragmentType[]> = {
  [K in A[number]['name']]: FunctionParameterInput<
    Extract<A[number], { name: K }>['type'],
    HandleUndefined<Extract<A[number], { name: K }>['components']>
  >
}

export class PluginFunction<A extends JsonFragment = JsonFragment> {
  public readonly chainId: ChainId
  public readonly method: A['name']
  public readonly params: FunctionParameter[] = []

  public contractAddress?: string

  constructor(args: { abiFragment: A; chainId: ChainId; contractAddress?: string }) {
    this.chainId = args.chainId
    this.method = args.abiFragment.name
    this.params = args.abiFragment.inputs?.map((c) => new FunctionParameter(c)) || []
  }

  get functionSignature(): string {
    return `${this.method}(${this.params.map((p) => p.type).join(',')})`
  }

  get functionSignatureHash(): string {
    return ethers.utils.id(this.functionSignature)
  }

  get inputs() {
    return this.params.reduce((acc, cur) => {
      return { ...acc, [cur.name]: cur.get() }
    }, {} as PluginFunctionInput<HandleUndefined<A['inputs']>>)
  }

  public setContractAddress(address: string) {
    this.contractAddress = address
  }

  public set(params: Partial<PluginFunctionInput<HandleUndefined<A['inputs']>>>) {
    Object.entries<any>(params).forEach((p) => {
      const param = this.params.find((fp) => fp.name === p[0])
      if (param) {
        param.set(p[1])
      }
    })
  }

  public get() {
    return this.params.reduce<PluginFunctionInput<HandleUndefined<A['inputs']>>>((acc, cur) => {
      return { ...acc, [cur.name]: cur.get() }
    }, {} as PluginFunctionInput<HandleUndefined<A['inputs']>>)
  }

  public async create(): Promise<IPluginCall | undefined> {
    if (!this.contractAddress) return undefined
    const params = this.params.map((p) => p.getAsCoreParam())
    const call: IPluginCall = {
      method: this.method,
      params,
      to: this.contractAddress,
    }
    return call
  }
}

export function createPluginFunction<F extends Readonly<JsonFragment>>({
  abiFragment,
  chainId,
}: {
  chainId: ChainId
  abiFragment: F
}) {
  return new PluginFunction({
    chainId,
    abiFragment,
  })
}

export function createProtocolPlugins<F extends JsonFragment>({
  abi,
  chainId,
}: {
  abi: readonly F[]
  chainId: ChainId
}) {
  return abi
    .filter((f) => f.type === 'function')
    .map((f) =>
      createPluginFunction({
        chainId,
        abiFragment: f,
      })
    )
}

export function createProtocolPluginsAsObject<F extends readonly JsonFragment[]>({
  abi,
  chainId,
}: {
  abi: F
  chainId: ChainId
}): {
  [K in Extract<F[number], { type: 'function' }>['name']]: PluginFunction<
    Extract<F[number], { name: K; type: 'function' }>
  >
} {
  return abi
    .filter((f) => f.type === 'function')
    .reduce((acc, cur) => {
      return {
        ...acc,
        [cur.name]: createPluginFunction({ chainId, abiFragment: cur }),
      }
    }, {} as {
      [K in Extract<F[number], { type: 'function' }>['name']]: PluginFunction<
        Extract<F[number], { name: K; type: 'function' }>
      >
    })
}

const testABI = [
  {
    inputs: [
      { internalType: 'uint256', name: 'amountIn', type: 'uint256' },
      { internalType: 'uint256', name: 'amountOutMin', type: 'uint256' },
      { internalType: 'address[]', name: 'path', type: 'address[]' },
      { internalType: 'address', name: 'to', type: 'address' },
    ],
    name: 'swapExactTokensForTokens',
    outputs: [{ internalType: 'uint256', name: 'amountOut', type: 'uint256' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
] as const

const UniswapV3ABI = [
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'tokenIn', type: 'address' },
          { internalType: 'address', name: 'tokenOut', type: 'address' },
          { internalType: 'uint24', name: 'fee', type: 'uint24' },
          { internalType: 'address', name: 'recipient', type: 'address' },
          { internalType: 'uint256', name: 'amountIn', type: 'uint256' },
          {
            internalType: 'uint256',
            name: 'amountOutMinimum',
            type: 'uint256',
          },
          {
            internalType: 'uint160',
            name: 'sqrtPriceLimitX96',
            type: 'uint160',
          },
          { internalType: 'string[]', name: 'path', type: 'string[]' },
        ],
        internalType: 'struct IV3SwapRouter.ExactInputSingleParams',
        name: 'params',
        type: 'tuple',
      },
    ],
    name: 'exactInputSingle',
    outputs: [{ internalType: 'uint256', name: 'amountOut', type: 'uint256' }],
    stateMutability: 'payable',
    type: 'function',
  },
] as const

const uniswap = createProtocolPlugins({ abi: testABI, chainId: '1' })

const uniswapAsObject = createProtocolPluginsAsObject({
  abi: testABI,
  chainId: '1',
})
