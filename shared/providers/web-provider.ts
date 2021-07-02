// import { ClarityAbiFunction } from '@stacks/transactions';
// import { Transaction } from '../transaction';
// import { BaseProvider } from './base-provider';
// import { Contracts, ContractInstances } from '../types'

// export class WebProvider implements BaseProvider {
//     public static async fromContracts<T extends Contracts<M>, M>(
//         contracts: T,
//         accounts?: ClarinetAccounts
//       ): Promise<ContractInstances<T, M>> {
//         // const clarityBin = await getDefaultClarityBin(clarityBinOrAccounts);
//         // const instances = {} as ContractInstances<T, M>;
//         // await deployUtilContract(clarityBin);
//         // for (const k in contracts) {
//         //   const contract = contracts[k];
//         //   const instance = await this.fromContract({
//         //     contract,
//         //     clarityBin,
//         //   });
//         //   instances[k] = {
//         //     identifier: getContractIdentifier(contract),
//         //     contract: instance as ReturnType<T[typeof k]["contract"]>,
//         //   };
//         // }
//         // return instances;

//         return null;
//       }

//     callReadOnly(func: ClarityAbiFunction, args: any[]): Promise<void> {
//         throw new Error('Method not implemented.');
//     }

//     callPublic(func: ClarityAbiFunction, args: any[]): Transaction<any, any> {
//         throw new Error('Method not implemented.');
//     }
// }