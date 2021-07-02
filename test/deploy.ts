import { describe } from "mocha";
import { deployContract } from "./utils";

describe("dao deploys suite", () => {
  it("deploys", async () => {
    await deployContract('simple-counter');
  });
});