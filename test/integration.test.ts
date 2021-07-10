import { WebProvider } from "../shared/providers/web-provider";
import { CounterCoinContract, CounterContract, contracts } from '../src';
import { ADDR1, testnetKeyMap } from "./testnet";
import { StacksNetwork } from "@stacks/network";
import { StacksNetworkConfiguration } from "./stacks-network";

const keys = testnetKeyMap[ADDR1];
const privateKey = keys.secretKey;
// const alice = ADDR1;
// const bob   =  ADDR2;
let counter: CounterContract;
let token: CounterCoinContract;

const network: StacksNetwork = new StacksNetworkConfiguration();

beforeAll(async () => {
  const deployed = await WebProvider.fromContracts(contracts, network, {
      secretKey: keys.secretKey,
      stacksAddress: keys.address
  });

  counter = deployed.counter.contract;
  token = deployed.counterCoin.contract;
});

test("Starts at zero", async () => {
  const current = await counter.getCounter({
      callerPrivateKey: keys.address,
      discriminator: 'metadata'
  });

  expect(current).toEqual(0);
});
