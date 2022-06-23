const model = artifacts.require("ERC20CloneContract");

const { deployProxy } = require("@openzeppelin/truffle-upgrades");

module.exports = async function(deployer) {

    const accounts = await web3.eth.getAccounts();
    
    await console.log("Deploying ERC20 Model Contract");
    
    let erc20model = await deployer.deploy(model);

    await console.log("Model Address is deployed AT " + erc20model.address);
    

};