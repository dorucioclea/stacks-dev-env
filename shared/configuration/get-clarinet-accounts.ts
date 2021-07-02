import { getClarinetDevConfig } from "./get-clarinet-dev-config";
import { generateWallet, getStxAddress } from '@stacks/wallet-sdk';
import { ClarinetAccounts } from './types'

export async function getClarinetAccounts(
    folder: string
  ): Promise<ClarinetAccounts> {
    const devConfig = await getClarinetDevConfig(folder);
    const accountEntries = await Promise.all(
      Object.entries(devConfig.accounts).map(async ([key, info]) => {
        const wallet = await generateWallet({
          secretKey: info.mnemonic,
          password: 'password',
        });
        const [account] = wallet.accounts;
        const address = getStxAddress({ account });
        return [
          key,
          {
            ...info,
            address,
          },
        ];
      })
    );
    const accounts: ClarinetAccounts = Object.fromEntries(accountEntries);
    return accounts;
  }