import { generateAbis } from "./generate-abi";

describe("Generate abi", async () => {
    try {
        generateAbis();
       } catch(error) {
            console.log('found error  ', error);
       }   
});

