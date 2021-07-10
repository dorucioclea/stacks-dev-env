import { Logger } from '../shared/logger/logger';
import { getClarinetAccounts } from '../shared/configuration/get-clarinet-accounts';

test("clarinet", async () =>{

    const cwd = process.cwd();

    var contracts = await getClarinetAccounts(cwd);

    for(var contract in contracts) {
        Logger.debug(`Contract: ${contract}`);
    } 
});