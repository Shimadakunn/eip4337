import axios from "axios";
import { Hash } from "viem";

import { SmartWalletClient } from "../smart-wallet";
import { UserOperationAsHex } from "../userOps";

import { ENTRYPOINT_ADDRESS } from "@/constants";
/*  */
export type SendUserOperationReturnType = Hash;

export async function sendUserOperation(
  client: SmartWalletClient,
  args: { userOp: UserOperationAsHex }
): Promise<SendUserOperationReturnType> {
  try {
    console.log("sendUserOperation client", client.transport.url);
    const response = await axios.post(client.transport.url, {
      jsonrpc: "2.0",
      method: "eth_sendUserOperation",
      params: [args.userOp, ENTRYPOINT_ADDRESS],
      id: 1,
    });
    console.log("UserOp Hash", response);

    return response.data.result;
  } catch (error) {
    console.error("Error fetching sendUserOperation:", error);
    throw error;
  }
}
