const master = artifacts.require("Master")
// const master2 = artifacts.require("Master2");
const controller = artifacts.require("Controller");
const model = artifacts.require("ERC20CloneContract");
const factoryContract = artifacts.require("ERC20Factory");
const vest = artifacts.require("Vesting");

const { deployProxy } = require("@openzeppelin/truffle-upgrades");
const { prepareUpgrade } = require('@openzeppelin/truffle-upgrades');

module.exports = async function(deployer) {
    // let masterInstance = await master.deployed();

    // console.log("Preparing Upgrade.");
    // try{
    //     // prepareUpgrade. 
    //     // Validates and deploys a new implementation contract, and returns its address. 
    //     // Use this method to prepare an upgrade to be run from an admin address you do not control directly or cannot use from Truffle. 
    //     await prepareUpgrade(masterInstance.address, master2, {deployer});
    // }
    // catch(error){
    //     console.log(error);
    // }

    // const accounts = await web3.eth.getAccounts();

    // await console.log("Deploying using : ",accounts[0])

    // await console.log("Deploying Master");

    // let masterInstance = await deployProxy(master, [], { kind: 'uups' });
    
    // await console.log("Master Address " + masterInstance.address);

    // await console.log("Deploying using : ",accounts[0])

    // await console.log("Deploying Master");

    
    // await console.log("Master Address " + masterInstance.address);

    
    // await console.log("Deploying Controller");
    
    
    // let controllerInstance = await deployProxy(controller, [masterInstance.address], { kind: 'uups' });
    
    // await console.log("Controller Address " + controllerInstance.address);
    
    // await console.log("Deploying ERC20 Model Contract");
    
    // let erc20model = await deployer.deploy(model);

    // await console.log("Model Address " + erc20model.address);
    
    // await console.log("Deploying Factory Contract");

    
    
    
    // let erc20factory = await deployer.deploy(factoryContract, erc20model.address, controllerInstance.address);
    
    // await console.log("Factory Address " + erc20factory.address);

    // await masterInstance.setLiquidFactory(erc20factory.address);

    // await masterInstance.setLiquidController(controllerInstance.address);


    // let vestingInstance = await deployProxy(vest, [], { kind: 'uups' });

    // await console.log("Vesting Address " + vestingInstance.address);

    // await masterInstance.setVestingController(vestingInstance.address);

    // await vestingInstance.setMaster(masterInstance.address);


};