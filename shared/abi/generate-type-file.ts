import { ClarityAbi } from "../clarity/types";
import { makeTypes } from "./utils";
import { toCamelCase } from "../utils/to-camel-case";

export const generateTypesFile = (abi: ClarityAbi, contractName: string) => {
  console.log("in generate types file");
  const name = toCamelCase(contractName, true);
  console.log("name ", name);
  const typings = makeTypes(abi);
  const fileContents = `import { Transaction } from '../../shared/transaction';
import { ClarityTypes } from '../../shared/clarity/types';

// prettier-ignore

export interface ${name}Contract {
${typings}
}
`;

  return fileContents;
};
