import { Me } from '@/providers';
import { Address, EstimateFeesPerGasReturnType, Hex, parseUnits } from 'viem';
import { smartWallet } from '../smart-wallet';
import { UserOpBuilder } from '../smart-wallet/service/userOps';
import { Send } from './send';
import { Supply } from './supply';
import { Withdraw } from './withdraw';

const builder = new UserOpBuilder();

type TransactionType = 'send' | 'supply' | 'withdraw';

export async function Transaction(
  me: Me,
  amount: string,
  functionName: TransactionType,
  setIsLoading: (loading: boolean) => void,
  updateBalances: (account: Address) => Promise<void>,
  setSuccess?: (receipt: string | null) => void,
  to?: string
) {
  setSuccess?.(null);
  try {
    const { maxFeePerGas, maxPriorityFeePerGas }: EstimateFeesPerGasReturnType =
      await smartWallet.client.estimateFeesPerGas();

    const value = parseUnits(amount, 6);

    let calls;
    switch (functionName) {
      case 'send':
        calls = Send(me!.account, value, to!);
        break;
      case 'supply':
        calls = Supply(me!.account, value);
        break;
      case 'withdraw':
        calls = Withdraw(me!.account, value);
        break;
      default:
        throw new Error('Invalid transaction type');
    }

    const userOp = await builder.buildUserOp({
      calls,
      maxFeePerGas: maxFeePerGas as bigint,
      maxPriorityFeePerGas: maxPriorityFeePerGas as bigint,
      keyId: me?.keyId as Hex,
    });
    setIsLoading(true);
    console.log('userOp', userOp);
    const hash = await smartWallet.sendUserOperation({ userOp });
    console.log('hash', hash);
    if (!hash.startsWith('0x')) {
      throw new Error('Transaction failed');
    }
    const receipt = await smartWallet.waitForUserOperationReceipt({ hash });
    setIsLoading(false);
    setSuccess?.('success');
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return receipt;
  } catch (error) {
    console.log('error in transaction');
    setSuccess?.('error');
    throw error;
  } finally {
    await updateBalances(me.account);
    setIsLoading(false);
  }
}
