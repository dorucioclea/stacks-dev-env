import { TestProvider } from "../shared/providers/test-provider";
import { txErr, txOk } from "../shared/transaction";
import { DEPLOYER_ADDRESS, testnetKeyMap } from "../private-testnet";

import { CounterCoinContract, CounterContract, contracts } from '../src';

console.log('start testing ', JSON.stringify(testnetKeyMap));

const deployer = DEPLOYER_ADDRESS;

console.log('alice ', JSON.stringify(testnetKeyMap[0]));

const alice = /*testnetKeyMap[0].address ||*/ 'ST26FVX16539KKXZKJN098Q08HRX3XBAP541MFS0P';
const bob = /*testnetKeyMap[1].address ||*/ 'ST3CECAKJ4BH08JYY7W53MC81BYDT4YDA5M7S5F53';

let counter: CounterContract;
let token: CounterCoinContract;

beforeAll(async () => {
  const deployed = await TestProvider.fromContracts(contracts);

  counter = deployed.counter.contract;
  token = deployed.counterCoin.contract;
});

test('Starts at zero', async () => {
  const current = await counter.getCounter();
  expect(current).toEqual(0);
});

test('can increment', async () => {
  await txOk(counter.increment(), alice);
  expect(await counter.getCounter()).toEqual(1);
});

test('balance is updated', async () => {
  const balance = (await token.getBalance(alice))._unsafeUnwrap();
  expect(balance).toEqual(1e8)
});

test('can decrement', async () => {
  const oldBalance = (await token.getBalance(alice))._unsafeUnwrap();
  await txOk(counter.decrement(), alice);
  expect(await counter.getCounter()).toEqual(0);
  const newBalance = (await token.getBalance(alice))._unsafeUnwrap();
  expect(newBalance - oldBalance).toEqual(1e8);
});

test('alice can transfer', async () => {
  const result = await txOk(token.transfer(100, alice, bob, null), alice);
  expect(result.assets.tokens[alice][`${deployer}.counter-coin::counter-token`]).toEqual('100')
});

test('transfer with memo', async () => {
  const result = await txOk(token.transfer(100, alice, bob, Buffer.from('hello', 'hex')), alice);
  expect(result.isOk).toBeTruthy();
});

test('bob cannot transfer more than he has', async () => {
  const result = await txErr(token.transfer(250, bob, alice, null), bob);
  expect(result.value).toEqual(1);
});

test('cannot transfer when sender is not tx-sender', async () => {
  const result = await txErr(token.transfer(250, alice, bob, null), bob);
  expect(result.value).toEqual(4);
});
