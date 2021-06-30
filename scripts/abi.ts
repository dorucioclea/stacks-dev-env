import { convertContractFile } from "../dos2unix";
import { generateFilesForContract } from "../shared/abi/generate-for-contract";

describe("Generate abi", async () => {
    try {

        convertContractFile('counter');

        await generateFilesForContract({
            contractFile: "contracts//counter.clar",
            outputFolder:"out",
            contractAddress: 'ST2ZRX0K27GW0SP3GJCEMHD95TQGJMKB7G9Y0X1MH'
          });
       } catch(error) {
            console.log('found error  ', error);
       }   
});


// async function generate() {
//     try {
//         await generateFilesForContract({
//             contractFile: "counter.clar",
//             outputFolder:"/out",
//             contractAddress: 'ST2ZRX0K27GW0SP3GJCEMHD95TQGJMKB7G9Y0X1MH',
//             dirName: './contracts'
//           });
//        } catch(error) {
//             console.log('found error  ', error);
//        }
// }

// generate();