import { TestProvider } from "../shared/providers/test-provider";
import { txErr, txOk } from "../shared/transaction";
import { DEPLOYER_ADDRESS } from "../private-testnet";
import { CounterCoinContract, CounterContract, contracts } from '../src';
import { NO_METADATA } from "../shared/providers/types";
const deployer = DEPLOYER_ADDRESS;
const alice = /*testnetKeyMap[0].address ||*/ 'ST1HJ4TYWQV3MCSP2T751GDN39PTENCX72HPQYDCM';
const bob = /*testnetKeyMap[1].address ||*/ 'STRVCQ501XZVWWWBWQTC3BCWKYG8WWER1BSCD9S8';
let counter: CounterContract;
let token: CounterCoinContract;

beforeAll(async () => {
  const deployed = await TestProvider.fromContracts(contracts);
  counter = deployed.counter.contract;
  token = deployed.counterCoin.contract;
});

test('Starts at zero', async () => {
  const current = await counter.getCounter(NO_METADATA);
  expect(current).toEqual(0);
});

test('can increment', async () => {
  
  await txOk(counter.increment(NO_METADATA), alice);
  expect(await counter.getCounter(NO_METADATA)).toEqual(1);
});

test('balance is updated', async () => {
  const balance = (await token.getBalance(alice, NO_METADATA))._unsafeUnwrap();
  expect(balance).toEqual(1e8)
});

test('can decrement', async () => {
  const oldBalance = (await token.getBalance(alice, NO_METADATA))._unsafeUnwrap();
  await txOk(counter.decrement(NO_METADATA), alice);
  expect(await counter.getCounter(NO_METADATA)).toEqual(0);
  const newBalance = (await token.getBalance(alice, NO_METADATA))._unsafeUnwrap();
  expect(newBalance - oldBalance).toEqual(1e8);
});

test('alice can transfer', async () => {
  const result = await txOk(token.transfer(100, alice, bob, null, NO_METADATA), alice);
  expect(result.assets.tokens[alice][`${deployer}.counter-coin::counter-token`]).toEqual('100')
});

test('transfer with memo', async () => {
  const result = await txOk(token.transfer(100, alice, bob, Buffer.from('hello', 'hex'), NO_METADATA), alice);
  expect(result.isOk).toBeTruthy();
});

test('bob cannot transfer more than he has', async () => {
  const result = await txErr(token.transfer(250, bob, alice, null, NO_METADATA), bob);
  expect(result.value).toEqual(1);
});

test('cannot transfer when sender is not tx-sender', async () => {
  const result = await txErr(token.transfer(250, alice, bob, null, NO_METADATA), bob);
  expect(result.value).toEqual(4);
});