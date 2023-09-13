export function isNative(address: string): boolean {
  return (
    address.toLowerCase() === "0x0000000000000000000000000000000000000000" ||
    address.toLowerCase() === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
  );
}

// Create a function that checks if addressA is equal to addressB
export function isEqualAddress(addressA: string, addressB: string): boolean {
  return addressA.toLowerCase() === addressB.toLowerCase();
}
