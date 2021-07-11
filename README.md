# Stacks local testnet environment

This repository contains a `docker-compose` configuration to run a local testnet `Stacks blockchain` environment from scratch

This starts the following `private testnet` components: 

* Postgres database
* Bitcoin - `puppet chain`
* Stacks node 
* Stacks api
* Local stacks blockchain explorer

It contains  two `docker-compose` files: 

* bns.yaml
* docker-compose.yaml

If you want to import BNS data you should run

```
$> docker-compose -f bns.yaml pull
$> docker-compose -f bns.yaml build
$> docker-compose -f bns.yaml up
```

This will import `bns data` into the `/bns-data` folder.

Moving forward, starting the stack: 

```

$> docker-compose pull
$> docker-compose build
$> docker-compose up

```

Note:

    - If you do not want to import bns data, then you will need to comment out the environment line `BNS_IMPORT_DIR: /bns-data` from the `stacks-blockchain-api` container, otherwise the container will panic if it doesn't find the files
    - If you did import the bns data, you need to uncomment (if previously commented out) the environment line above and be aware that the `stacks-blockchain` will experience `Connection refused` problems from `stacks-blockchain-api` for the duration of bns data import. After the import, the API will become ready and accept events from stacks-blockchain node

# Features

  - Start a private testnet stacks blockchain
  - Interact with the blockchain using the stacks cli or the local explorer

### Recommmended IDE

VsCode is recomended for development.

### Reasoning

This exists so we can interact with the stacks-blockchain, create test addresses, fill them with test tokens (currently this takes longer on the official testnet) and iteract with the clarity smart contracts through integration tests.

### Useful commands

* Generate stx address

stx make_keychain -t -I "http://localhost:20443" > cli_keychain.json

* See balance

stx balance <address> -t -I "http://localhost:20443"

* Estimate transaction fee

stx send_tokens <address> 1000 800 0 539e35c740079b79f931036651ad01f76d8fe1496dbd840ba9e62c7e7b355db001 0 539e35c740079b79f931036651ad01f76d8fe1496dbd840ba9e62c7e7b355db001 -t -I "http://localhost:20443" -e

* Send tokens to address 

stx send_tokens <address> 1000 800 0 539e35c740079b79f931036651ad01f76d8fe1496dbd840ba9e62c7e7b355db001 0 539e35c740079b79f931036651ad01f76d8fe1496dbd840ba9e62c7e7b355db001 -t -I "http://localhost:20443"

Where the private key is taken from the config.toml configuration file of /provisioning/stacks-blockchain

* Deploy contract

stx deploy_contract ./contracts/dao-token-trait.clar dao-token-trait 200 0 <private_key> -t -I "http://localhost:20443"

* Useful:

for f in *; do npx cti create ./$f; done