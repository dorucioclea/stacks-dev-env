import { NativeClarityBinProvider } from "@blockstack/clarity";
import { getDefaultBinaryFilePath } from "@blockstack/clarity-native-bin";
import { getTempFilePath } from "@blockstack/clarity/lib/utils/fsUtil";
import { ClarityAbi } from "../clarity/types";
import { getContractNameFromPath } from "../utils/contract-name-for-path";

export async function generateInterface({
    provider: _provider, contractFile, contractAddress = 'S1G2081040G2081040G2081040G208105NK8PE5',
}: {
    contractFile: string;
    provider?: NativeClarityBinProvider;
    contractAddress?: string;
}): Promise<ClarityAbi> {

    console.log('inside generate interface');

    const binFile = getDefaultBinaryFilePath();


    console.log('binfile', binFile);

    const dbFileName = getTempFilePath();


    console.log('dbfilename', dbFileName);

    const provider = _provider ||
        (await NativeClarityBinProvider.create([], dbFileName, binFile));

    console.log('Created provider');

    const contractName = getContractNameFromPath(contractFile);

    console.log('contractname', contractName);



    const receipt = await provider.runCommand([
        'launch',
        `${contractAddress}.${contractName}`,
        contractFile,
        provider.dbFilePath,
        '--output_analysis',
        '--costs',
        '--assets',
    ]);
    if (receipt.stderr) {
        throw new Error(`Error on ${contractFile}:
    ${receipt.stderr}
      `);
    }

    console.log('receipt', receipt.exitCode);

    console.log('stdout', receipt.stdout);

    const output = JSON.parse(receipt.stdout);
    if (output.error) {
        const { initialization } = output.error;
        if (initialization?.includes('\nNear:\n')) {
            const [error, trace] = initialization.split('\nNear:\n');
            let startLine = '';
            const matcher = /start_line: (\d+),/;
            const matches = matcher.exec(trace);
            if (matches)
                startLine = matches[1];
            throw new Error(`Error on ${contractFile}:
      ${error}
      ${startLine ? `Near line ${startLine}` : ''}
      Raw trace:
      ${trace}
        `);
        }
        throw new Error(`Error on ${contractFile}:
    ${JSON.stringify(output.error, null, 2)}
      `);
    }
    const abi = output.analysis;
    return abi;
}
    