import { describe } from "mocha";
import { deployContract } from "./utils";

describe("dao deploys suite", () => {
  it("deploys", async () => {
    // await deployContract("dao-token-trait", s => s.replace(/[^\x00-\x7F]/g, "").replace(/(?:\\[rn]|[\r\n]+)+/g, ""));
    // await deployContract("dao-token", s => s.replace(/[^\x00-\x7F]/g, "").replace(/(?:\\[rn]|[\r\n]+)+/g, ""));
    // await deployContract("dao", s => s.replace(/[^\x00-\x7F]/g, "").replace(/(?:\\[rn]|[\r\n]+)+/g, ""));

    await deployContract('counter', s => s.replace(/[^\x00-\x7F]/g, "").replace(/(?:\\[rn]|[\r\n]+)+/g, ""));
  });
});