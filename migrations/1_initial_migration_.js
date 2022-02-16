const master = artifacts.require("Master")
const controller = artifacts.require("Controller");
const model = artifacts.require("ERC20CloneContract");
const factoryContract = artifacts.require("ERC20Factory");
const vest = artifacts.require("Vesting");

const { deployProxy } = require("@openzeppelin/truffle-upgrades");

module.exports = async function(deployer) {

    const accounts = await web3.eth.getAccounts();

    await console.log("Deploying using : ",accounts[0])

    await console.log("Deploying Master");

    let masterInstance = await deployProxy(master, [], { kind: 'uups' });
    
    await console.log("Master Address " + masterInstance.address);

    await console.log("Deploying using : ",accounts[0])

    await console.log("Deploying Master");

    
    await console.log("Master Address " + masterInstance.address);

    
    await console.log("Deploying Controller");
    
    
    let controllerInstance = await deployProxy(controller, [masterInstance.address], { kind: 'uups' });
    
    await console.log("Controller Address " + controllerInstance.address);
    
    await console.log("Deploying ERC20 Model Contract");
    
    let erc20model = await deployer.deploy(model);

    await console.log("Model Address " + erc20model.address);
    
    await console.log("Deploying Factory Contract");

    
    
    
    let erc20factory = await deployer.deploy(factoryContract, erc20model.address, controllerInstance.address);
    
    await console.log("Factory Address " + erc20factory.address);

    await masterInstance.setLiquidFactory(erc20factory.address);

    await masterInstance.setLiquidController(controllerInstance.address);


    let vestingInstance = await deployProxy(vest, [], { kind: 'uups' });

    await console.log("Vesting Address " + vestingInstance.address);

    await masterInstance.setVestingController(vestingInstance.address);

    await vestingInstance.setMaster(masterInstance.address);

};