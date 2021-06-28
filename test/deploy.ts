import { ContractDeployOptions, TxBroadcastResultOk, TxBroadcastResultRejected } from "@stacks/transactions";
import { describe } from "mocha";
import { deployContract, handleTransaction } from "./utils";

import * as blockstack from 'blockstack';
import * as bitcoin from 'bitcoinjs-lib';
import * as process from 'process';
import * as fs from 'fs';

import BN from 'bn.js';
import * as crypto from 'crypto';
import * as bip39 from 'bip39';
import * as path from 'path';
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
    // await deployContract("dao-token-trait", s => s.replace(/[^\x00-\x7F]/g, "").replace(/(?:\\[rn]|[\r\n]+)+/g, ""));
    // await deployContract("dao-token", s => s.replace(/[^\x00-\x7F]/g, "").replace(/(?:\\[rn]|[\r\n]+)+/g, ""));
    // await deployContract("dao", s => s.replace(/[^\x00-\x7F]/g, "").replace(/(?:\\[rn]|[\r\n]+)+/g, ""));

    await deployContract('counter', s => s.replace(/[^\x00-\x7F]/g, "").replace(/(?:\\[rn]|[\r\n]+)+/g, ""));
  });
});