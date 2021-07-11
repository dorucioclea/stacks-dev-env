import { ApiProvider } from "../shared/providers/api-provider";
import { contracts } from '../src';
import { ADDR1, testnetKeyMap } from "../configuration/testnet";
import { StacksNetwork } from "@stacks/network";
import { StacksNetworkConfiguration } from "../configuration/stacks-network";

const keys = testnetKeyMap[ADDR1];
// const alice = ADDR1;
// const bob   =  ADDR2;
// let counter: CounterContract;
// let token: CounterCoinContract;

const network: StacksNetwork = new StacksNetworkConfiguration();

beforeAll(async () => {
  const deployed = await ApiProvider.fromContracts(contracts, network, {
      secretKey: keys.secretKey,
      stacksAddress: keys.address
  });


  console.log('Deployed contracts to testnet yay');
  console.log(JSON.stringify(deployed));

  // counter = deployed.counter.contract;
  // token = deployed.counterCoin.contract;
});

test("Dummy test equality", async () => {
  expect(0).toEqual(0);
});

// test("Starts at zero", async () => {
//   const current = await counter.getCounter({
//       sender: keys.address,
//       discriminator: 'metadata'
//   });

//   expect(current).toEqual(0);
// });
