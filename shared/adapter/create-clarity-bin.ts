import { NativeClarityBinProvider } from "@blockstack/clarity";
import { getDefaultBinaryFilePath } from "@blockstack/clarity-native-bin";
import { getTempFilePath } from "@blockstack/clarity/lib/utils/fsUtil";
import getAllocations from "./get-allocations";
import { AllocationOrAccounts } from "./types";

export async function createClarityBin({
  allocations,
}: { allocations?: AllocationOrAccounts } = {}) {
  const binFile = getDefaultBinaryFilePath();

  const dbFileName = getTempFilePath();
  const _allocations = getAllocations(allocations);
  const provider = await NativeClarityBinProvider.create(
    _allocations,
    dbFileName,
    binFile
  );
  return provider;
}
