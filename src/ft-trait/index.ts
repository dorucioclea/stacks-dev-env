import { Contract } from '../../shared/types';
import { proxy } from '../../shared/test-utils/proxy';
import { BaseProvider } from '../../shared/providers/base-provider';

import type { FtTraitContract } from './types';
import { FtTraitInterface } from './abi';

export type { FtTraitContract } from './types';

export const ftTraitContract = (provider: BaseProvider) => {
  const contract = proxy<FtTraitContract>(FtTraitInterface, provider);
  return contract;
};

export const ftTraitInfo: Contract<FtTraitContract> = {
  contract: ftTraitContract,
  address: 'ST2ZRX0K27GW0SP3GJCEMHD95TQGJMKB7G9Y0X1MH',
  contractFile: 'contracts\ft-trait.clar',
};
