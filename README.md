[![image](https://img.shields.io/npm/v/@nikolasandreou/keep3r-cli-keep3rliquiditymanagerjob.svg?style=flat-square)](https://www.npmjs.org/package/@mushroomsfi/keep3r-cli-job)

# Keep3r Liquidity Manager Job

This job enables The Keep3r Network keepers on Ethereum to execute tasks for Keep3r Liquidity Manager (`workForTokens`)

## How to install

1. Open a terminal inside your [CLI](https://github.com/keep3r-network/cli) setup
2. Run `yarn add @nikolasandreou/keep3r-cli-keep3rliquiditymanagerjob`
3. Add job inside your CLI config file. It should look something like this:
```
{
    ...
    "jobs": [
        ...,
        {
            "path": "node_modules/@nikolasandreou/keep3r-cli-keep3rliquiditymanagerjob/dist/src"
        },
    ]
}
```
## Useful Links

* [Job](https://etherscan.io/address/0x7E0Cc5edF2DD01FC543D698b7E00ff54c6c39085)
* [Keep3r V1](https://etherscan.io/address/0x1ceb5cb57c4d4e2b2433641b95dd330a33185a44)