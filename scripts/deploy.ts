import { Logger } from "../shared/logger/logger";
import { deployContract } from "./deploy-utils";

console.log('Deploying contracts');
deployContracts();

async function deployContracts(): Promise<void> {
    Logger.debug('Deploying contract simple-counter');
    var result = await deployContract('simple-counter');
    Logger.debug(`Contract deployed: ${result}`);

    Logger.debug('Deploying contract sip-10-ft-standard');
    var result = await deployContract('sip-10-ft-standard');
    Logger.debug(`Contract deployed: ${result}`);

    Logger.debug('Deploying contract counter-coin');
    var result = await deployContract('counter-coin');
    Logger.debug(`Contract deployed: ${result}`);

    Logger.debug('Deploying contract counter');
    var result = await deployContract('counter');
    Logger.debug(`Contract deployed: ${result}`);

    // simpleCounter: simpleCounterInfo,
    // sip10FtStandard: sip10FtStandardInfo,
    // counterCoin: counterCoinInfo,
    // counter: counterInfo,
}
