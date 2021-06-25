import { ContractDeployOptions } from "@stacks/transactions";
import { describe } from "mocha";
import { deployContract } from "./utils";

import * as blockstack from 'blockstack';
import * as bitcoin from 'bitcoinjs-lib';
import * as process from 'process';
import * as fs from 'fs';

import BN from 'bn.js';
import * as crypto from 'crypto';
import * as bip39 from 'bip39';
import * as path from 'path';
import fetch from 'node-fetch';
import {
  makeSTXTokenTransfer,
  makeContractDeploy,
  makeContractCall,
  callReadOnlyFunction,
  broadcastTransaction,
  estimateTransfer,
  estimateContractDeploy,
  estimateContractFunctionCall,
  SignedTokenTransferOptions,
  SignedContractCallOptions,
  ReadOnlyFunctionOptions,
  ContractCallPayload,
  ClarityValue,
  ClarityAbi,
  getAbi,
  validateContractCall,
  PostConditionMode,
  cvToString,
  StacksTransaction,
  TxBroadcastResult,
  getAddressFromPrivateKey,
  TransactionVersion,
  AnchorMode,
} from '@stacks/transactions';

import { StacksTestnet, StacksMainnet } from "@stacks/network";

describe("dao deploys suite", () => {
  it("deploys", async () => {
    await contractDeploy("dao-token-trait");
    await contractDeploy("dao-token");
    await contractDeploy("dao");
  });
});


/*
 * Depoly a Clarity smart contract.
 * args:
 * @source (string) path to the contract source file
 * @contractName (string) the name of the contract
 * @fee (int) the transaction fee to be paid
 * @nonce (int) integer nonce needs to be incremented after each transaction from an account
 * @privateKey (string) the hex-encoded private key to use to send the tokens
 */
async function contractDeploy(contractName: string): Promise<string> {
  console.log(`Deploying ${contractName}yarn`);
  
  const fee = new BN(200);

  const nonce = new BN(0);
  const privateKey = "a5d66af321865a43ec6bab56dc2859e13fd708f134428f56d012be2c0e6910b501";

  const source = fs.readFileSync(`./contracts/${contractName}.clar`).toString();


  // temporary hack to use network config from stacks-transactions lib
  const txNetwork = new StacksTestnet();
  txNetwork.coreApiUrl = "http://localhost:3999";

  const options: ContractDeployOptions = {
    contractName,
    codeBody: source,
    senderKey: privateKey,
    fee,
    nonce,
    network: txNetwork,
    postConditionMode: PostConditionMode.Allow,
    anchorMode: AnchorMode.Any,
  };

  const tx = await makeContractDeploy(options);

  return broadcastTransaction(tx, txNetwork)
    .then(response => {
      if (response.hasOwnProperty('error')) {
        return response;
      }

      console.log('success');
      return {
        txid: `0x${tx.txid()}`,
      };
    })
    .catch(error => {
      return error.toString();
    });
}