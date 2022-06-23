const master = artifacts.require("Master")

const { deployProxy } = require("@openzeppelin/truffle-upgrades");

module.exports = async function(deployer) {

    const accounts = await web3.eth.getAccounts();

    await console.log("Deploying using : ",accounts[0])

    await console.log("Deploying Master");

    let masterInstance = await deployProxy(master, [], { kind: 'uups' });
    
    await console.log("Master Address " + masterInstance.address);


    await console.log("Deploying Master Complete");

    
    await console.log("Master Address IS" + masterInstance.address);

};