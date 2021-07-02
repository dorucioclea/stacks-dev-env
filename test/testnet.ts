import { pubKeyfromPrivKey, publicKeyToString } from "@stacks/transactions";

// from Stacks config.toml file
export const ADDR1 = "ST1HJ4TYWQV3MCSP2T751GDN39PTENCX72HPQYDCM";
export const ADDR2 = "STRVCQ501XZVWWWBWQTC3BCWKYG8WWER1BSCD9S8";
export const ADDR3 = "ST1MFSFY91ZZFCVQFRPHYH2HS258D962RPK3M8CW5";
export const ADDR4 = "ST1Z6E1B35N3A8C974PPCMQPVJ10SCEJA68PMPQ95";
export const testnetKeys: { secretKey: string; stacksAddress: string }[] = [
  {
    secretKey:
      "d8b6639a9dc544cb52accaa701b45c9a3320519101fae0cb90c8066ec7e1d6c601",
    stacksAddress: ADDR1,
  },
  {
    secretKey:
      "95ef516f20d266f6972ccb72382e74a0de7e872dcef764924d6da0c688723a0301",
    stacksAddress: ADDR2,
  },
  {
    secretKey:
      "97a0af6784770897281b17e628a794b31f6acad422624c166df02ad4b7fd5c5f01",
    stacksAddress: ADDR3,
  },
  {
    secretKey:
      "8d61a7c285049ec0a98a02c425f9717c6c9cd103fa4e7bf0f6a30559eedf6dab01",
    stacksAddress: ADDR4,
  },
];

export const testnetKeyMap: Record<
  string,
  { address: string; secretKey: string; pubKey: string }
> = Object.fromEntries(
  testnetKeys.map((t) => [
    t.stacksAddress,
    {
      address: t.stacksAddress,
      secretKey: t.secretKey,
      pubKey: publicKeyToString(pubKeyfromPrivKey(t.secretKey)),
    },
  ])
);
