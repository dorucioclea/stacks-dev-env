import { contracts } from "./contracts";
import { generateAbis } from "./generate-abi";
import { generateProjectIndexFile } from "./generate-project";

describe("Generate abi", async () => {
        generateAbis();
        generateProjectIndexFile(contracts);
});

