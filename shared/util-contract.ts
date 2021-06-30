  
import { Client, NativeClarityBinProvider } from '@blockstack/clarity';
import { deserializeCV } from '@stacks/transactions';
import { join } from 'path';
import { cvToValue } from './clarity-types';
import { deployContract, evalJson, executeJson } from './adapter/clarity-cli-adapter';

export async function mineBlocks(blocks: number, provider: NativeClarityBinProvider) {
  for (let index = 0; index < blocks; index++) {
    await mineBlock(provider);
  }
}