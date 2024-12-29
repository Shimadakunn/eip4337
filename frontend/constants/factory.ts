import { Hex } from 'viem';

export const FACTORY_ADDRESS: Hex = '0xaCea7eD933a39B18E30C9F899a97787669f55752';

export const FACTORY_ABI = [
  {
    inputs: [
      {
        internalType: 'bytes32[2]',
        name: 'publicKey',
        type: 'bytes32[2]',
      },
    ],
    name: 'createAccount',
    outputs: [
      {
        internalType: 'contract SimpleAccount',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32[2]',
        name: 'publicKey',
        type: 'bytes32[2]',
      },
    ],
    name: 'getAddress',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        internalType: 'bytes32[2]',
        name: 'publicKey',
        type: 'bytes32[2]',
      },
    ],
    name: 'saveUser',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'getUser',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            internalType: 'bytes32[2]',
            name: 'publicKey',
            type: 'bytes32[2]',
          },
          {
            internalType: 'address',
            name: 'account',
            type: 'address',
          },
        ],
        internalType: 'struct User',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32[2]',
        name: 'publicKey',
        type: 'bytes32[2]',
      },
    ],
    name: 'getAddress',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
