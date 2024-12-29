import {
  Account,
  Chain,
  Client,
  createPublicClient,
  Hash,
  http,
  PublicClient,
  PublicClientConfig,
  Transport,
} from "viem";

import { SmartWalletActions, smartWalletActions } from "./decorators";

import { chains, ChainType } from "@/constants";
import { EstimateUserOperationGasReturnType } from "@/lib/smart-wallet/service/actions";
import {
  ERC4337RpcSchema,
  UserOperationAsHex,
} from "@/lib/smart-wallet/service/userOps";

export type SmartWalletClient<
  chain extends Chain | undefined = Chain | undefined
> = Client<
  Transport,
  chain,
  Account | undefined,
  ERC4337RpcSchema,
  SmartWalletActions
> &
  PublicClient;

export const createSmartWalletClient = (
  parameters: PublicClientConfig
): SmartWalletClient => {
  const { key = "public", name = "Smart Wallet Client" } = parameters;
  const client = createPublicClient({
    ...parameters,
    key,
    name,
  });
  return client.extend(smartWalletActions);
};

class SmartWallet {
  private _client: SmartWalletClient;
  private _isInitiated: boolean = true;

  constructor() {
    this._client = createSmartWalletClient({
      chain: chains.arbitrum.viem,
      transport: http(chains.arbitrum.bundlerRpc),
    });
  }

  public init(chain: ChainType) {
    this._isInitiated = true;
    this._client = createSmartWalletClient({
      chain: chain.viem,
      transport: http(chain.bundlerRpc),
    });
  }

  public get client() {
    console.warn(
      "smartWallet: isInit() is not called. Only use this getter if you want to access wagmi publicClient method."
    );
    return this._client;
  }

  public async sendUserOperation(args: {
    userOp: UserOperationAsHex;
  }): Promise<`0x${string}`> {
    this._isInit();
    console.log("sending userOp", args);
    return await this._client.sendUserOperation({
      ...args,
    });
  }

  public async estimateUserOperationGas(args: {
    userOp: UserOperationAsHex;
  }): Promise<EstimateUserOperationGasReturnType> {
    this._isInit();
    return await this._client.estimateUserOperationGas({
      ...args,
    });
  }

  public async getUserOperationReceipt(args: {
    hash: Hash;
  }): Promise<`0x${string}`> {
    this._isInit();
    return await this._client.getUserOperationReceipt({
      ...args,
    });
  }

  public async getIsValidSignature(args: any): Promise<boolean> {
    this._isInit();
    return await this._client.getIsValidSignature({
      ...args,
    });
  }

  public async waitForUserOperationReceipt(args: any): Promise<any> {
    this._isInit();
    return await this._client.waitForUserOperationReceipt({
      ...args,
    });
  }

  private _isInit() {
    if (this._isInitiated) {
      return true;
    } else {
      throw new Error("SmartWallet is not initialized");
    }
  }
}

export const smartWallet = new SmartWallet();
