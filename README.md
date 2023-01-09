Vesting - WVT Asset Creation 
====================================

The project provides a decentralized platform allowing token creators, developers and token holders to create a "*Smart Vesting Contract*" to hold their ERC20 Tokens for a specific period of time and provide them with a wrapped ERC20 Token derived from the locked token depending on the user's choice.<br />
This creates trust in the token community and prevents spams and '*rug pulls*'. The platform also provides tradability of this derived asset. Once, the vesting schedule has elapsed, the derived asset are the *key* to attain the vested ERC20 Token.

>**Vesting** definition - *In law, vesting is the point in time when the rights and interests arising from legal ownership of a property is acquired by some person.*

Architecture
-------------------

![Architecture](./Images/Capx-Liquid-Arch.png)

Deploying the Smart Contracts
================================

The deployment script is written in the migrations file "1_initial_migration".
This project has total of 5 contracts which are deployed in succession with multiple functions called in between.

## How to deploy a contract in migration files

Normal Deployment
```js
const instanceVariable = await deployer.deploy(contractVariable, contructorArguments)
```
Deployment with proxy
```js
const instanceVariable = await deployProxy(contractVariable, [args], { kind: 'uups' });
```

## Step 1

Importing the contracts

```javascript
const master = artifacts.require("Master")
const controller = artifacts.require("Controller");
const model = artifacts.require("ERC20CloneContract");
const factoryContract = artifacts.require("ERC20Factory");
const vest = artifacts.require("Vesting");
```

## Step 2 

Gets the accounts to be used for deployment

```javascript
const accounts = await web3.eth.getAccounts();
```

## Step 3

Deploys master contract using openzeppelin upgradable plugin. 

```javascript
let masterInstance = await deployProxy(master, [], { kind: 'uups' });
```

## Step 4

Deploys controller contract using openzeppelin upgradable plugin. 

```javascript
let controllerInstance = await deployProxy(controller, [masterInstance.address], { kind: 'uups' });
```

## Step 5

Deploy ERC20Model contract and ERC20factory contract which uses the model and the controller address in its constructors

```javascript

let erc20model = await deployer.deploy(model);

let erc20factory = await deployer.deploy(factoryContract, erc20model.address, controllerInstance.address);

```

## Step 6

Set Factory and Liquid controller address in the master by calling the `setLiquidFactory` and `setLiquidController` functions

```javascript
await masterInstance.setLiquidFactory(erc20factory.address);

await masterInstance.setLiquidController(controllerInstance.address);
```

## Step 7

Deploy Vesting contract 

```javascript
let vestingInstance = await deployProxy(vest, [], { kind: 'uups' });
```

## Step 8

Set addresses in vesting contract and master contract

```javascript
await masterInstance.setVestingController(vestingInstance.address);

await vestingInstance.setMaster(masterInstance.address);
```

### Run Migrate to deploy the contracts.
> truffle migrate


## Contract Address

#### Ethereum 
| Contract Name     | Contract Addresss  |
|---------------------|--------------------------------------------------------------------|
| Master      | [0xd297b094607DE535378000Fa6fc45e71627Fc839](https://etherscan.io/address/0xd297b094607DE535378000Fa6fc45e71627Fc839)	 |
| Controller  | [0x30B9A8279298Ba8d37Bf76b9f2A805D656fC1C07](https://etherscan.io/address/0x30B9A8279298Ba8d37Bf76b9f2A805D656fC1C07)	 |
| Vesting     | [0x5d985753aE3691a0A94d38eC2F12793006097416](https://etherscan.io/address/0x5d985753aE3691a0A94d38eC2F12793006097416)	 |

#### Binance Smart Chain (BSC) 
| Contract Name     | Contract Addresss  |
|---------------------|--------------------------------------------------------------------|
| Master      | [0x30B9A8279298Ba8d37Bf76b9f2A805D656fC1C07](https://bscscan.com/address/0x30B9A8279298Ba8d37Bf76b9f2A805D656fC1C07)	 |
| Controller  | [0x316717ecEff2D3a612Deba49B5A21430c78D22f2](https://bscscan.com/address/0x316717ecEff2D3a612Deba49B5A21430c78D22f2)	 |
| Vesting     | [0x1428c7f929b3Ac5d5c6619FC3F9C722d2cfC66A5](https://bscscan.com/address/0x1428c7f929b3Ac5d5c6619FC3F9C722d2cfC66A5)	 |

#### Matic (Polygon)
| Contract Name     | Contract Addresss  |
|---------------------|--------------------------------------------------------------------|
| Master      | [0xd297b094607DE535378000Fa6fc45e71627Fc839](https://polygonscan.com/address/0xd297b094607DE535378000Fa6fc45e71627Fc839)	 |
| Controller  | [0x30B9A8279298Ba8d37Bf76b9f2A805D656fC1C07](https://polygonscan.com/address/0x30B9A8279298Ba8d37Bf76b9f2A805D656fC1C07)	 |
| Vesting     | [0x5d985753aE3691a0A94d38eC2F12793006097416](https://polygonscan.com/address/0x5d985753aE3691a0A94d38eC2F12793006097416)	 |

#### Avalanche 
| Contract Name     | Contract Addresss  |
|---------------------|--------------------------------------------------------------------|
| Master      | [0xd297b094607DE535378000Fa6fc45e71627Fc839](https://snowtrace.io/address/0xd297b094607DE535378000Fa6fc45e71627Fc839)	 |
| Controller  | [0x30B9A8279298Ba8d37Bf76b9f2A805D656fC1C07](https://snowtrace.io/address/0x30B9A8279298Ba8d37Bf76b9f2A805D656fC1C07)	 |
| Vesting     | [0x5d985753aE3691a0A94d38eC2F12793006097416](https://snowtrace.io/address/0x5d985753aE3691a0A94d38eC2F12793006097416)	 |

#### Fantom 
| Contract Name     | Contract Addresss  |
|---------------------|--------------------------------------------------------------------|
| Master      | [0xd297b094607DE535378000Fa6fc45e71627Fc839](https://ftmscan.com/address/0xd297b094607DE535378000Fa6fc45e71627Fc839)	 |
| Controller  | [0x30B9A8279298Ba8d37Bf76b9f2A805D656fC1C07](https://ftmscan.com/address/0x30B9A8279298Ba8d37Bf76b9f2A805D656fC1C07)	 |
| Vesting     | [0x5d985753aE3691a0A94d38eC2F12793006097416](https://ftmscan.com/address/0x5d985753aE3691a0A94d38eC2F12793006097416)	 |


## SubGraph Query URLs

#### Ethereum 
| Subgraph     | Query URL  |
|---------------------|--------------------------------------------------------------------|
| Liquid Subgraph     | https://api.thegraph.com/subgraphs/name/capxdev/capx-liquid-eth   |

#### Binance Smart Chain (BSC) 
| Subgraph     | Query URL  |
|---------------------|--------------------------------------------------------------------|
| Liquid Subgraph     | https://api.thegraph.com/subgraphs/name/capxdev/capx-liquid-bsc   |

#### Matic (Polygon)
| Subgraph     | Query URL  |
|---------------------|--------------------------------------------------------------------|
| Liquid Subgraph     | https://api.thegraph.com/subgraphs/name/capxdev/capx-liquid-matic   |

#### Avalanche 
| Subgraph     | Query URL  |
|---------------------|--------------------------------------------------------------------|
| Liquid Subgraph     | https://api.thegraph.com/subgraphs/name/capxdev/capx-liquid-avax   |

#### Fantom 
| Subgraph     | Query URL  |
|---------------------|--------------------------------------------------------------------|
| Liquid Subgraph     | https://api.thegraph.com/subgraphs/name/capxdev/capx-liquid-ftm   |

Implementation Details 
======================

### Master Contract

The Master contract is the contract from which the user interacts with. This contract is responsible for calling the Liquid Controller and the Vesting Lock controller with appropriate inputs.
For more details see [Master.md](./ContractDocumentation/Master.md)

### Controller/ Escrow Contract

The Controller/ Escrow Contract provides the functionality of creating vesting schedules, every wrapped asset created will follow the naming convention of `<TokenName>.<DateOfExpiry>-<typeOfToken>` and symbol of `<TokenSymbol>.<DateOfExpiry>-<typeOfToken>`. <br />
`<typeOfToken>` only occurs as `NT` if the token is non tradable. If the token is tradable  then the naming convention has no `<typeOfToken>`.
The Controller/ Escrow Contract mints the wrapped assets for the end-user.
For more details see [Controller.md](./ContractDocumentation/Controller.md)

### Vesting Lock Contract

The Vesting Lock contract is the contract which is responsible for creating vesting locks. The controller contract has the following tasks. Keep the vested tokens. After the vesting time has passed, return the actual ERC20 token.
For more details see [VestingLock.md](./ContractDocumentation/VestingLock.md)

### Model ERC-20 contract

The standard ERC-20 Token smart contract from which the wrapped ERC20 contracts will be made.
For more details see [ERC20Model.md](./ContractDocumentation/ERC20Model.md) 

### ERC20 Factory

The smart contract which makes **clones** of the model ERC20 contract using [EIP-1167 standard](https://eips.ethereum.org/EIPS/eip-1167).
For more details see [ERC20Factory.md](./ContractDocumentation/ERC20Factory.md) 
