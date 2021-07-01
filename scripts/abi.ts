import { contracts } from "./contracts";
import { convertDos2Unix } from "./dos2unix";
import { generateAbis } from "./generate-abi";
import { generateProjectIndexFile } from "./generate-project";

describe("Generate abi", async () => {
    try {
        // await convertDos2Unix();
        generateAbis();
        generateProjectIndexFile(contracts);
       } catch(error) {
            console.log('found error  ', error);
       }   
});

