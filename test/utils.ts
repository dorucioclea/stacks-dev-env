import {
  broadcastTransaction,
  makeContractDeploy,
  StacksTransaction,
  TxBroadcastResultOk,
  TxBroadcastResultRejected,
  makeContractCall,
  SignedContractCallOptions,
  SignedMultiSigContractCallOptions
} from "@stacks/transactions";
import { StacksTestnet } from "@stacks/network";

import * as fs from "fs";
const fetch = require("node-fetch");

import { ADDR1, testnetKeyMap } from "./testnet";
const STACKS_CORE_API_URL = "http://localhost:3999";
export const network = new StacksTestnet();
network.coreApiUrl = STACKS_CORE_API_URL;
const keys = testnetKeyMap[ADDR1];

export const secretKey = keys.secretKey;
export const contractAddress = keys.address;
const deployKey = testnetKeyMap[ADDR1];
export const deployContractAddress = deployKey.address;
export const secretDeployKey = deployKey.secretKey;

export async function handleTransaction(transaction: StacksTransaction) {
  const result = await broadcastTransaction(transaction, network);
  console.log(result);
  if ((result as TxBroadcastResultRejected).error) {
    if ((result as TxBroadcastResultRejected).reason === "ContractAlreadyExists") {
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
  const processed = await processing(result as TxBroadcastResultOk);
  if (!processed) {
    throw new Error(
      `failed to process transaction ${transaction.txid}: transaction not found`
    );
  }
  console.log(processed, result);
  return result as TxBroadcastResultOk;
}

export async function callContractFunction(contractName: string, functionName: string, sender: any, args: any) {
  const txOptions: SignedContractCallOptions | SignedMultiSigContractCallOptions = {
    contractAddress: deployContractAddress,
    contractName: contractName,
    functionName: functionName,
    functionArgs: args,
    senderKey: sender,
    network,
    postConditionMode: 0x01, // PostconditionMode.Allow
    anchorMode: 3
  };

  console.log('Sending transaction', contractName);
  const transaction = await makeContractCall(txOptions);
  console.log(transaction);

  return handleTransaction(transaction);
}

export async function deployContract(contractName: string, changeCode: (str: string) => string = unchanged) {
  let codeBody = fs.readFileSync(`./contracts/${contractName}.clar`).toString();;
  var transaction = await makeContractDeploy({
    contractName,
    codeBody: changeCode(codeBody),
    senderKey: secretDeployKey,
    network,
    anchorMode: 3,
    // fee: new BN(1000),
    // nonce: new BN(10)
  });

  console.log(`deploy contract ${contractName}`);
  return handleTransaction(transaction);
}

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function processing(tx: String, count: number = 0): Promise<boolean> {
  return processingWithSidecar(tx, count);
}

async function processingWithSidecar(
  tx: String,
  count: number = 0
): Promise<boolean> {
  const url = `${STACKS_CORE_API_URL}/extended/v1/tx/${tx}`;
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

  await timeout(3000);
  return processing(tx, count + 1);
}

export function unchanged(codeBody: string) {
  return codeBody;
}
