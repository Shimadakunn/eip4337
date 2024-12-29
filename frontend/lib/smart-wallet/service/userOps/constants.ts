import { toHex, zeroAddress } from 'viem';

import { UserOperation } from '../userOps/types';

export const DEFAULT_CALL_GAS_LIMIT = BigInt(8000000);
export const DEFAULT_VERIFICATION_GAS_LIMIT = BigInt(600000); // 2M
export const DEFAULT_PRE_VERIFICATION_GAS = BigInt(90000); //65000

export const DEFAULT_USER_OP: UserOperation = {
  sender: zeroAddress,
  nonce: BigInt(0),
  initCode: toHex(new Uint8Array(0)),
  callData: toHex(new Uint8Array(0)),
  callGasLimit: DEFAULT_CALL_GAS_LIMIT,
  verificationGasLimit: DEFAULT_VERIFICATION_GAS_LIMIT,
  preVerificationGas: DEFAULT_PRE_VERIFICATION_GAS,
  maxFeePerGas: BigInt(0),
  maxPriorityFeePerGas: BigInt(330000000),
  signature:
    '0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c',
  paymasterAndData: toHex(new Uint8Array(0)),
};

export const emptyHex = toHex(new Uint8Array(0));
