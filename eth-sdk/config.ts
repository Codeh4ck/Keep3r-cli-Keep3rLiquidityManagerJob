import { defineConfig } from '@dethcrypto/eth-sdk';

export default defineConfig({
  outputPath: 'src/eth-sdk-build',
  contracts: {
    mainnet: {
      job: '0x7E0Cc5edF2DD01FC543D698b7E00ff54c6c39085',
    },
  },
});
