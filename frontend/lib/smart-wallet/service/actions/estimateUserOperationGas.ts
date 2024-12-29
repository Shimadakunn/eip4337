import axios from "axios";

import { SmartWalletClient } from "../smart-wallet";
import { UserOperationAsHex } from "../userOps";

import { ENTRYPOINT_ADDRESS } from "@/constants";

/*  */
export type EstimateUserOperationGasReturnType = {
  preVerificationGas: bigint;
  verificationGasLimit: bigint;
  callGasLimit: bigint;
};

export async function estimateUserOperationGas(
  client: SmartWalletClient,
  args: { userOp: UserOperationAsHex }
): Promise<EstimateUserOperationGasReturnType> {
  try {
    console.log("estimateUserOperationGas client", client.transport.url);
    const response = await axios.post(client.transport.url, {
      jsonrpc: "2.0",
      method: "eth_estimateUserOperationGas",
      params: [{ ...args.userOp }, ENTRYPOINT_ADDRESS],
      id: 1,
    });
    console.log("estimated UserOp Gas", response);

    return response.data.result;
  } catch (error) {
    console.error("Error fetching estimateUserOperationGas", error);
    throw error;
  }
}
