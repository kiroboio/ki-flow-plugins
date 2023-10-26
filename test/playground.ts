import { ParamType } from "ethers/lib/utils";

function main() {
  const abi = [
    {
      inputs: [
        {
          internalType: "address",
          name: "token",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "deposit",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];

  const params = abi[0].inputs.map((c) => ParamType.fromObject(c));

  console.log(params);

  const format = params[0].format();

  console.log(format);
}

main();
