import { getClarinetAccounts } from '../shared/configuration/get-clarinet-accounts';

test("Clarinet", async () =>{

    const cwd = process.cwd();

    var contracts = await getClarinetAccounts(cwd);

    for(var contract in contracts) {
        console.log('contract: ', JSON.stringify(contract));
    } 
});