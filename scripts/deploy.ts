import { Logger } from "../shared/logger/logger";
import { deployContract } from "./deploy-utils";

console.log('Deploying contracts');
deployContracts();

async function deployContracts(): Promise<void> {
    Logger.debug('Deploying contract simple-counter');
    var result = await deployContract('simple-counter');
    Logger.debug(`Contract deployed: ${result}`);
}
