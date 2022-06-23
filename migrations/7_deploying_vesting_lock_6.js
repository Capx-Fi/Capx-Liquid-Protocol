
const vest = artifacts.require("Vesting");

const { deployProxy } = require("@openzeppelin/truffle-upgrades");

module.exports = async function(deployer) {

    const accounts = await web3.eth.getAccounts();

    
    await console.log("Deploying Vesting");


    let vestingInstance = await deployProxy(vest, [], { kind: 'uups' });

    await console.log("Vesting IS at Address " + vestingInstance.address);

   
};