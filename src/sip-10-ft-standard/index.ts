import { Contract } from '../../shared/types';
import { proxy } from '../../shared/test-utils/proxy';
import { BaseProvider } from '../../shared/providers/base-provider';

import type { Sip10FtStandardContract } from './types';
import { Sip10FtStandardInterface } from './abi';

export type { Sip10FtStandardContract } from './types';

export const sip10FtStandardContract = (provider: BaseProvider) => {
  const contract = proxy<Sip10FtStandardContract>(Sip10FtStandardInterface, provider);
  return contract;
};

export const sip10FtStandardInfo: Contract<Sip10FtStandardContract> = {
  contract: sip10FtStandardContract,
  address: 'ST1HJ4TYWQV3MCSP2T751GDN39PTENCX72HPQYDCM',
  contractFile: 'contracts\\sip-10-ft-standard.clar',
};
