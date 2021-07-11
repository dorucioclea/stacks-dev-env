import { StacksNetworkConfiguration } from './stacks-network'
export { ADDR1, ADDR2, ADDR3, ADDR4, testnetKeys, testnetKeyMap } from './testnet'

export const NETWORK = new StacksNetworkConfiguration();

export function getTransactionUrl(transaction: String): String {
    return `${NETWORK.coreApiUrl}/extended/v1/tx/${transaction}`;
}