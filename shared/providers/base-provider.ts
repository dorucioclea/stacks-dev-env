import { ClarityAbiFunction } from "@stacks/transactions";
import { Transaction } from "../transaction";

export interface IProviderRequest {
  function: ClarityAbiFunction;
  arguments: any[];
}

export abstract class BaseProvider {
  // eslint-disable-next-line @typescript-eslint/require-await
  async callReadOnly(_request: IProviderRequest) {
    throw new Error("Not implemented");
  }
  
  callPublic(_request: IProviderRequest): Transaction<any, any> {
    throw new Error("Not implemented");
  }
}