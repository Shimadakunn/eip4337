import {
  Address,
  Chain,
  GetContractReturnType,
  Hex,
  PublicClient,
  WalletClient,
  createPublicClient,
  createWalletClient,
  encodeAbiParameters,
  encodeFunctionData,
  encodePacked,
  getContract,
  http,
  parseAbi,
  toHex,
  zeroAddress,
} from 'viem';

import {
  ENTRYPOINT_ABI,
  ENTRYPOINT_ADDRESS,
  FACTORY_ABI,
  FACTORY_ADDRESS,
  chains,
} from '@/constants';
import { smartWallet } from '@/lib/smart-wallet';
import { DEFAULT_USER_OP } from '@/lib/smart-wallet/service/userOps/constants';
import { Call, UserOperation, UserOperationAsHex } from '@/lib/smart-wallet/service/userOps/types';
import { P256Credential, WebAuthn } from '@/lib/web-authn';

export class UserOpBuilder {
  public relayer: Hex = '0x1f29312f134C79984bA4b21840f2C3DcF57b9c85';
  public entryPoint: Hex = ENTRYPOINT_ADDRESS;
  public chain: Chain;
  public publicClient: PublicClient;
  public factoryContract: GetContractReturnType<typeof FACTORY_ABI, WalletClient, PublicClient>;

  constructor() {
    this.chain = chains.arbitrum.viem;
    this.publicClient = createPublicClient({
      chain: this.chain,
      transport: http(),
    });

    const walletClient = createWalletClient({
      account: this.relayer,
      chain: this.chain,
      transport: http(),
    });

    this.factoryContract = getContract({
      address: FACTORY_ADDRESS,
      abi: FACTORY_ABI,
      walletClient,
      publicClient: this.publicClient,
    });
  }

  // reference: https://ethereum.stackexchange.com/questions/150796/how-to-create-a-raw-erc-4337-useroperation-from-scratch-and-then-send-it-to-bund
  async buildUserOp({
    calls,
    maxFeePerGas,
    maxPriorityFeePerGas,
    keyId,
  }: {
    calls: Call[];
    maxFeePerGas: bigint;
    maxPriorityFeePerGas: bigint;
    keyId: Hex;
  }): Promise<UserOperationAsHex> {
    // calculate smart wallet address via Factory contract to know the sender
    const { account, publicKey } = await this._calculateSmartWalletAddress(keyId); // the keyId is the id tied to the user's public key

    // get bytecode
    const bytecode = await this.publicClient.getBytecode({
      address: account,
    });

    let initCode = toHex(new Uint8Array(0));
    let initCodeGas = BigInt(0);
    if (bytecode === undefined) {
      // smart wallet does NOT already exists
      // calculate initCode and initCodeGas
      ({ initCode, initCodeGas } = await this._createInitCode(publicKey));
    }

    // calculate nonce
    const nonce = await this._getNonce(account);

    calls = [...calls];
    // create callData
    const callData = this._addCallData(calls);

    // create user operation
    const userOp: UserOperation = {
      ...DEFAULT_USER_OP,
      sender: account,
      nonce,
      initCode,
      callData,
      maxFeePerGas: BigInt(3_000_000_000),
      maxPriorityFeePerGas: BigInt(100_000_000),
    };

    // estimate gas for this partial user operation
    // real good article about the subject can be found here:
    // https://www.alchemy.com/blog/erc-4337-gas-estimation
    const { callGasLimit, verificationGasLimit, preVerificationGas } =
      await smartWallet.estimateUserOperationGas({
        userOp: this.toParams(userOp),
      });
    console.log('fetched callGasLimit', callGasLimit);
    console.log('fetched verificationGasLimit', verificationGasLimit);
    console.log('fetched preVerificationGas', preVerificationGas);

    // set gas limits with the estimated values
    userOp.callGasLimit = (BigInt(callGasLimit) * BigInt(4)) / BigInt(100);
    userOp.preVerificationGas = BigInt(preVerificationGas) * BigInt(4);
    userOp.verificationGasLimit = BigInt(verificationGasLimit) + BigInt(initCodeGas);

    console.log('callGasLimit', userOp.callGasLimit);
    console.log('verificationGasLimit', userOp.verificationGasLimit);
    console.log('preVerificationGas', userOp.preVerificationGas);
    console.log('maxFeePerGas', userOp.maxFeePerGas);
    console.log('maxPriorityFeePerGas', userOp.maxPriorityFeePerGas);

    userOp.paymasterAndData = chains.arbitrum.paymaster;
    console.log('PaymasterAndData', userOp.paymasterAndData);

    // get userOp hash (with signature == 0x) by calling the entry point contract
    const userOpHash = await this._getUserOpHash(userOp);

    // version = 1 and validUntil = 0 in msgToSign are hardcoded
    const msgToSign = encodePacked(['uint8', 'uint48', 'bytes32'], [1, 0, userOpHash]);

    // get signature from webauthn
    const signature = await this.getSignature(msgToSign, keyId);

    // Return both userOps and their corresponding signatures
    return this.toParams({ ...userOp, signature });
  }

  public toParams(op: UserOperation): UserOperationAsHex {
    return {
      sender: op.sender,
      nonce: toHex(op.nonce),
      initCode: op.initCode,
      callData: op.callData,
      callGasLimit: toHex(op.callGasLimit),
      verificationGasLimit: toHex(op.verificationGasLimit),
      preVerificationGas: toHex(op.preVerificationGas),
      maxFeePerGas: toHex(op.maxFeePerGas),
      maxPriorityFeePerGas: toHex(op.maxPriorityFeePerGas),
      paymasterAndData: op.paymasterAndData === zeroAddress ? '0x' : op.paymasterAndData,
      signature: op.signature,
    };
  }

  public async getSignature(msgToSign: Hex, keyId: Hex): Promise<Hex> {
    const credential: P256Credential = (await WebAuthn.get(msgToSign)) as P256Credential;

    if (!credential) {
      throw new Error('Failed to get WebAuthn credential');
    }

    return this.createSignature(credential, keyId);
  }

  private createSignature(credential: P256Credential, keyId: Hex): Hex {
    if (credential.rawId !== keyId) {
      throw new Error(
        'Incorrect passkeys used for tx signing. Please sign the transaction with the correct logged-in account'
      );
    }

    return encodePacked(
      ['uint8', 'uint48', 'bytes'],
      [
        1,
        0,
        encodeAbiParameters(
          [
            {
              type: 'tuple',
              name: 'credentials',
              components: [
                { name: 'authenticatorData', type: 'bytes' },
                { name: 'clientDataJSON', type: 'string' },
                { name: 'challengeLocation', type: 'uint256' },
                { name: 'responseTypeLocation', type: 'uint256' },
                { name: 'r', type: 'bytes32' },
                { name: 's', type: 'bytes32' },
              ],
            },
          ],
          [
            {
              authenticatorData: credential.authenticatorData,
              clientDataJSON: JSON.stringify(credential.clientData),
              challengeLocation: BigInt(23),
              responseTypeLocation: BigInt(1),
              r: credential.signature.r,
              s: credential.signature.s,
            },
          ]
        ),
      ]
    );
  }

  private async _createInitCode(
    pubKey: readonly [Hex, Hex]
  ): Promise<{ initCode: Hex; initCodeGas: bigint }> {
    const createAccountTx = encodeFunctionData({
      abi: FACTORY_ABI,
      functionName: 'createAccount',
      args: [pubKey],
    });

    const initCode = encodePacked(
      ['address', 'bytes'], // types
      [this.factoryContract.address, createAccountTx] // values
    );

    const initCodeGas = await this.publicClient.estimateGas({
      account: this.relayer,
      to: this.factoryContract.address,
      data: createAccountTx,
    });

    return {
      initCode,
      initCodeGas,
    };
  }

  private async _calculateSmartWalletAddress(
    id: Hex
  ): Promise<{ account: Address; publicKey: readonly [Hex, Hex] }> {
    const user = await this.factoryContract.read.getUser([BigInt(id)]);
    return { account: user.account, publicKey: user.publicKey };
  }

  private _addCallData(calls: Call[]): Hex {
    return encodeFunctionData({
      abi: [
        {
          inputs: [
            {
              components: [
                {
                  internalType: 'address',
                  name: 'dest',
                  type: 'address',
                },
                {
                  internalType: 'uint256',
                  name: 'value',
                  type: 'uint256',
                },
                {
                  internalType: 'bytes',
                  name: 'data',
                  type: 'bytes',
                },
              ],
              internalType: 'struct Call[]',
              name: 'calls',
              type: 'tuple[]',
            },
          ],
          name: 'executeBatch',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
      functionName: 'executeBatch',
      args: [calls],
    });
  }

  private async _getNonce(smartWalletAddress: Hex): Promise<bigint> {
    const nonce: bigint = await this.publicClient.readContract({
      address: this.entryPoint,
      abi: parseAbi(['function getNonce(address, uint192) view returns (uint256)']),
      functionName: 'getNonce',
      args: [smartWalletAddress, BigInt(0)],
    });
    return nonce;
  }

  private async _getUserOpHash(userOp: UserOperation): Promise<Hex> {
    const entryPointContract = getContract({
      address: this.entryPoint,
      abi: ENTRYPOINT_ABI,
      publicClient: this.publicClient,
    });

    const userOpHash = entryPointContract.read.getUserOpHash([userOp]);
    return userOpHash;
  }
}
