import { getClarinetTestnetConfig } from "./get-clarinet-dev-config";
import { generateWallet, getStxAddress } from '@stacks/wallet-sdk';
import { ClarinetAccounts } from './types'

export async function getClarinetAccounts(
    folder: string
  ): Promise<ClarinetAccounts> {
    const devConfig = await getClarinetTestnetConfig(folder);

    const accountEntries = await Promise.all(
      Object.entries(devConfig.accounts).map(async ([key, info]) => {

        console.log('===================================================================================== ', key);
        console.log(info.mnemonic);
        const wallet = await generateWallet({
          secretKey: info.mnemonic,
          password: 'password',
        });

        console.log('generated wallet ',JSON.stringify(wallet));

        const [account] = wallet.accounts;
        const address = getStxAddress({ account });

        console.log('ADDRESS ', address);

        console.log('=====================================================================================');

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