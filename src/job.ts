import { Job, JobWorkableGroup, makeid, prelog, toKebabCase } from '@keep3r-network/cli-utils';
import { getMainnetSdk } from './eth-sdk-build';
import metadata from './metadata.json';

const getWorkableTxs: Job['getWorkableTxs'] = async (args) => {
  // setup logs
  const correlationId = toKebabCase(metadata.name);
  const logMetadata = {
    job: metadata.name,
    block: args.advancedBlock,
    logId: makeid(5),
  };
  const logConsole = prelog(logMetadata);

  // skip job if already in progress
  if (args.skipIds.includes(correlationId)) {
    logConsole.log(`Skipping job`);
    return args.subject.complete();
  }

  logConsole.log(`Trying to work`);

  // setup job
  const signer = args.fork.ethersProvider.getSigner(args.keeperAddress);
  const { job } = getMainnetSdk(signer);

  // get jobs
  const jobs: string[] = args.retryId ? [args.retryId] : await job.jobs();
  logConsole.log(args.retryId ? `Retrying job` : `Simulating ${jobs.length} jobs`);

  try {
    for (const [index, liquidityJob] of jobs.entries()) {
      const jobLogId = `${logMetadata.logId}-${makeid(5)}`;
      const jobConsole = prelog({ ...logMetadata, logId: jobLogId, liquidityJob });

      if (args.skipIds.includes(liquidityJob)) {
        jobConsole.info('Skipping job');
        continue;
      }

      // check if job is workable
      const workable = await job.callStatic.workable(liquidityJob, { blockTag: args.advancedBlock });
      jobConsole.log(`Job #${index} ${workable ? 'is' : 'is not'} workable`, { liquidityJob });
      if (!workable) continue;

      // create work tx
      const tx = await job.connect(args.keeperAddress).populateTransaction.workForTokens(liquidityJob, {
        nonce: args.keeperNonce,
        gasLimit: 2_500_000,
        type: 2,
      });

      // create a workable group every bundle burst
      const workableGroups: JobWorkableGroup[] = new Array(args.bundleBurst).fill(null).map((_, index) => ({
        targetBlock: args.targetBlock + index,
        txs: [tx],
        logId: `${jobLogId}-${makeid(5)}`,
      }));

      // submit all bundles
      args.subject.next({
        workableGroups,
        correlationId: liquidityJob,
      });
    }
  } catch (err: unknown) {
    logConsole.warn('Unexpected error', { message: (err as Error).message });
  }
  // finish job process
  args.subject.complete();
};

module.exports = {
  getWorkableTxs,
} as Job;
