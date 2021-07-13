import {
  broadcastTransaction,
  ClarityAbiFunction,
  cvToString,
  makeContractCall,
  makeContractDeploy,
  SignedContractCallOptions,
  SignedMultiSigContractCallOptions,
  StacksTransaction,
  TxBroadcastResultOk,
  TxBroadcastResultRejected,
  callReadOnlyFunction,
  ClarityValue,
  ReadOnlyFunctionOptions,
} from "@stacks/transactions";
import { Transaction } from "../transaction";
import { BaseProvider, IProviderRequest } from "./base-provider";
import {
  Contracts,
  ContractInstances,
  FromApiContractOptions,
  ApiCreateOptions,
} from "../types";
import { DeployerAccount, IMetadata, instanceOfMetadata } from "./types";
import * as fs from "fs";
import { getContractIdentifier, getContractNameFromPath } from "../utils";
import { StacksNetwork } from "@stacks/network";
import { Logger } from "../logger";
import { cvToValue, parseToCV } from "../clarity";

// type GetResultType = () => Promise<TransactionResult<any, any>>;

export class ApiProvider implements BaseProvider {
  private readonly network: StacksNetwork;
  private readonly deployerAccount: DeployerAccount;
  private readonly contractName: string;

  constructor(
    network: StacksNetwork,
    deployerAccount: DeployerAccount,
    contractName: string
  ) {
    this.network = network;
    this.deployerAccount = deployerAccount;
    this.contractName = contractName;
  }

  async callReadOnly(request: IProviderRequest): Promise<any> {
    let formattedArguments: [ClarityValue[], IMetadata] = this.formatReadonlyArguments(
      request.function,
      request.arguments
    );

    var metadata = formattedArguments[1];
    var args = formattedArguments[0];

    let options: ReadOnlyFunctionOptions = {
      contractAddress: this.deployerAccount.stacksAddress,
      contractName: this.contractName,
      functionArgs: args,
      functionName: request.function.name,
      senderAddress: metadata.sender,
      network: this.network
    };

    try{
      
      var cv = await callReadOnlyFunction(options);

      const result = cvToValue(cv);
      
      return result;

    } catch (error) {

      Logger.error('----------------');
      Logger.error(`Error calling readonly function ${request.function.name}`);
      Logger.error('Arguments:');
      Logger.error(JSON.stringify(options));
      Logger.error(JSON.stringify(error));
      Logger.error('----------------');
      
      return null;
    }
  }

  callPublic(_request: IProviderRequest): Transaction<any, any> {
    // let formattedArguments: [string[], IMetadata] = this.formatArguments(
    //   request.function,
    //   request.arguments
    // );
    // var metadata = formattedArguments[1];
    // var args = formattedArguments[0];
    // const submit: Submitter<any, any> = async (_options) => {
    //   if (metadata.sender == null) {
    //     throw new Error("Passing `sender` is required.");
    //   }

    //   let getResult: GetResultType;

    //   try {
    //     var rawTransactionResult = await this.callContractFunction(
    //       this.contractName,
    //       request.function.name,
    //       metadata.sender,
    //       args
    //     );

    //     getResult = (): Promise<TransactionResult<any, any>> => {
    //       const resultCV = deserializeCV(
    //         Buffer.from(rawTransactionResult, "hex")
    //       );
    //       const result = cvToValue(resultCV);

    //       return Promise.resolve({
    //         isOk: true,
    //         response: responseOkCV(resultCV),
    //         value: result,
    //       });
    //     };
    //   } catch (error) {
    //     getResult = (): Promise<TransactionResult<any, any>> => {
    //       const resultCV = deserializeCV(
    //         Buffer.from(rawTransactionResult, "hex")
    //       );
    //       const result = cvToValue(resultCV);

    //       return Promise.resolve({
    //         isOk: false,
    //         response: responseErrorCV(resultCV),
    //         value: result,
    //       });
    //     };
    //   }
    //   return {
    //     getResult,
    //   };
    // };
    // return {
    //   submit,
    // };

    throw new Error("Not implemented ");
  }

  public static async fromContracts<T extends Contracts<M>, M>(
    contracts: T,
    network: StacksNetwork,
    account: DeployerAccount
  ): Promise<ContractInstances<T, M>> {
    const instances = {} as ContractInstances<T, M>;
    // await deployUtilContract(clarityBin);
    for (const k in contracts) {
      const contract = contracts[k];
      const instance = await this.fromContract({
        contract,
        network,
        account,
      });
      instances[k] = {
        identifier: getContractIdentifier(contract),
        contract: instance as ReturnType<T[typeof k]["contract"]>,
      };
    }
    return instances;
  }

  static async fromContract<T>({
    contract,
    network,
    account,
  }: FromApiContractOptions<T>) {
    const { address } = contract;
    if (!address) {
      throw new Error("TestProvider must have an address");
    }
    const contractName = getContractNameFromPath(contract.contractFile);

    const provider = await this.create({
      contractFilePath: contract.contractFile,
      contractIdentifier: contractName,
      network,
      account,
    });
    return contract.contract(provider);
  }

  static async create({
    contractFilePath,
    contractIdentifier,
    network,
    account,
  }: ApiCreateOptions) {
    await this.deployContract(
      contractIdentifier,
      contractFilePath,
      network,
      account.secretKey
    );
    return new this(network, account, contractIdentifier);
  }

  static async deployContract(
    contractName: string,
    contractPath: string,
    network: StacksNetwork,
    secretDeployKey: string
  ) {
    let codeBody = fs.readFileSync(contractPath).toString();

    var transaction = await makeContractDeploy({
      contractName,
      codeBody,
      senderKey: secretDeployKey,
      network,
      anchorMode: 3,
    });

    console.log(`deploy contract ${contractName}`);

    return this.handleTransaction(transaction, network);
  }

  static async handleTransaction(
    transaction: StacksTransaction,
    network: StacksNetwork
  ): Promise<TxBroadcastResultOk> {
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

    const processed = await this.processing(
      network,
      result as TxBroadcastResultOk
    );
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

  static async processing(
    network: StacksNetwork,
    tx: String,
    count: number = 0
  ): Promise<boolean> {
    return this.processingWithSidecar(tx, count, network);
  }

  static async processingWithSidecar(
    tx: String,
    count: number = 0,
    network: StacksNetwork
  ): Promise<boolean> {
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

  async callContractFunction(
    contractName: string,
    functionName: string,
    sender: any,
    args: any
  ) {
    const txOptions:
      | SignedContractCallOptions
      | SignedMultiSigContractCallOptions = {
      contractAddress: this.deployerAccount.stacksAddress,
      contractName: contractName,
      functionName: functionName,
      functionArgs: args,
      senderKey: sender,
      network: this.network,
      postConditionMode: 0x01, // PostconditionMode.Allow
      anchorMode: 3,
    };

    Logger.debug(`Contract function call on ${contractName}::${functionName}`);
    const transaction = await makeContractCall(txOptions);
    console.log(transaction);

    return this.handleFunctionTransaction(transaction, this.network);
  }

  async handleFunctionTransaction(
    transaction: StacksTransaction,
    network: StacksNetwork
  ): Promise<TxBroadcastResultOk> {
    const result = await broadcastTransaction(transaction, network);
    console.log(result);
    if ((result as TxBroadcastResultRejected).error) {
      throw new Error(
        `failed to handle transaction ${transaction.txid()}: ${JSON.stringify(
          result
        )}`
      );
    }

    const processed = await this.functionProcessing(
      network,
      result as TxBroadcastResultOk
    );
    if (!processed) {
      throw new Error(
        `failed to process transaction ${transaction.txid}: transaction not found`
      );
    }

    console.log(processed, result);
    return result as TxBroadcastResultOk;
  }

  async functionProcessing(
    network: StacksNetwork,
    tx: String,
    count: number = 0
  ): Promise<boolean> {
    return this.functionProcessingWithSidecar(tx, count, network);
  }

  async functionProcessingWithSidecar(
    tx: String,
    count: number = 0,
    network: StacksNetwork
  ): Promise<boolean> {
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
    return this.functionProcessing(network, tx, count + 1);
  }

  formatArguments(
    func: ClarityAbiFunction,
    args: any[]
  ): [string[], IMetadata] {
    var metadata = args.filter((arg) => instanceOfMetadata(arg));
    if (metadata.length > 1) {
      throw new TypeError("More than one metadata objects");
    }

    var metadataConfig = metadata[0];

    var argsWithoutMetadata =
      metadata.length == 1 ? args.filter((x) => x !== metadataConfig) : args;

    console.log(
      "argswithoutmetadata --> " + JSON.stringify(argsWithoutMetadata)
    );

    var formatted = argsWithoutMetadata.map((arg, index) => {
      const { type } = func.args[index];
      if (type === "trait_reference") {
        return `'${arg}`;
      }
      const argCV = parseToCV(arg, type);
      const cvString = cvToString(argCV);
      if (type === "principal") {
        return `'${cvString}`;
      }
      return cvString;
    });

    return [formatted, metadataConfig];
  }

  formatReadonlyArguments(
    func: ClarityAbiFunction,
    args: any[]
  ): [ClarityValue[], IMetadata] {
    var metadata = args.filter((arg) => instanceOfMetadata(arg));
    if (metadata.length > 1) {
      throw new TypeError("More than one metadata objects");
    }

    var metadataConfig = metadata[0];

    var argsWithoutMetadata =
      metadata.length == 1 ? args.filter((x) => x !== metadataConfig) : args;

    console.log(
      "argswithoutmetadata --> " + JSON.stringify(argsWithoutMetadata)
    );

    var formatted = argsWithoutMetadata.map((arg, index) => {
      const { type } = func.args[index];
      const argCV = parseToCV(arg, type);
      return argCV;
    });

    return [formatted, metadataConfig];
  }
}
