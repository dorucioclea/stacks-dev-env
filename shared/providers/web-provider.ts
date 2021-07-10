import {
  broadcastTransaction,
  makeContractDeploy,
  StacksTransaction,
  TxBroadcastResultOk,
  TxBroadcastResultRejected,
} from "@stacks/transactions";
import { Transaction } from "../transaction";
import { BaseProvider, IProviderRequest } from "./base-provider";
import {
  Contracts,
  ContractInstances,
  FromApiContractOptions,
  ApiCreateOptions,
} from "../types";
import { unchanged } from "./types";
import * as fs from "fs";
import { getContractIdentifier } from "../utils/contract-identifier";
import { getContractNameFromPath } from "../utils/contract-name-for-path";
import { StacksNetwork } from "@stacks/network";

export class WebProvider implements BaseProvider {
  private readonly network: StacksNetwork;

  constructor(network: StacksNetwork) {
    this.network = network;
  }
  
  callReadOnly(_request: IProviderRequest): Promise<void> {
    throw new Error("Method not implemented.");
  }

  callPublic(request: IProviderRequest): Transaction<any, any> {
    throw new Error("Method not implemented.");
  }

  public static async fromContracts<T extends Contracts<M>, M>(
    contracts: T, network: StacksNetwork, secretDeployKey: string
  ): Promise<ContractInstances<T, M>> {
    const instances = {} as ContractInstances<T, M>;
    // await deployUtilContract(clarityBin);
    for (const k in contracts) {
      const contract = contracts[k];
      const instance = await this.fromContract({
        contract,
        network,
        secretDeployKey
      });
      instances[k] = {
        identifier: getContractIdentifier(contract),
        contract: instance as ReturnType<T[typeof k]["contract"]>,
      };
    }
    return instances;
  }

  static async fromContract<T>({ contract, network, secretDeployKey }: FromApiContractOptions<T>) {
    const { address } = contract;
    if (!address) {
      throw new Error("TestProvider must have an address");
    }
    const contractName = getContractNameFromPath(contract.contractFile);

    const provider = await this.create({
      contractFilePath: contract.contractFile,
      contractIdentifier: contractName,
      network,
      secretDeployKey
    });
    return contract.contract(provider);
  }

  static async create({
    contractFilePath,
    contractIdentifier,
    network,
    secretDeployKey
  }: ApiCreateOptions) {
    await this.deployContract(contractIdentifier, contractFilePath, network, secretDeployKey);
    return new this(network);
  }

  static async deployContract(
    contractName: string,
    contractPath: string,
    network: StacksNetwork,
    secretDeployKey: string,
    changeCode: (str: string) => string = unchanged
  ) {
    let codeBody = fs.readFileSync(contractPath).toString();
    var transaction = await makeContractDeploy({
      contractName,
      codeBody: changeCode(codeBody),
      senderKey: secretDeployKey,
      network,
      anchorMode: 3,
    });

    console.log(`deploy contract ${contractName}`);
    return this.handleTransaction(transaction, network);
  }

  static async handleTransaction(transaction: StacksTransaction, network: StacksNetwork) {
    const result = await broadcastTransaction(transaction, network);
    console.log(result);
    if ((result as TxBroadcastResultRejected).error) {
      if (
        (result as TxBroadcastResultRejected).reason === "ContractAlreadyExists"
      ) {
        console.log("already deployed");
        return "" as TxBroadcastResultOk;
      } else {
        throw new Error(
          `failed to handle transaction ${transaction.txid()}: ${JSON.stringify(
            result
          )}`
        );
      }
    }
    const processed = await this.processing(network, result as TxBroadcastResultOk);
    if (!processed) {
      throw new Error(
        `failed to process transaction ${transaction.txid}: transaction not found`
      );
    }
    console.log(processed, result);
    return result as TxBroadcastResultOk;
  }

  async timeout(ms: number) {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }

  static async processing(network: StacksNetwork, tx: String, count: number = 0): Promise<boolean> {
    return this.processingWithSidecar(tx, count, network);
  }

  static async processingWithSidecar(tx: String, count: number = 0, network: StacksNetwork): Promise<boolean> {
    const url = `${network.coreApiUrl}/extended/v1/tx/${tx}`;
    var result = await fetch(url);
    var value = await result.json();
    console.log(count);
    if (value.tx_status === "success") {
      console.log(`transaction ${tx} processed`);
      console.log(value);
      return true;
    }
    if (value.tx_status === "pending") {
      console.log(value);
    } else if (count === 3) {
      console.log(value);
    }

    if (count > 20) {
      console.log("failed after 10 tries");
      console.log(value);
      return false;
    }

    await this.timeout(3000); 
    return this.processing(network, tx, count + 1);
  }

  static async timeout(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
