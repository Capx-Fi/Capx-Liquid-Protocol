const master = artifacts.require("Master");
const vest = artifacts.require("Vesting");

const { deployProxy } = require("@openzeppelin/truffle-upgrades");

module.exports = async function (deployer) {
  const accounts = await web3.eth.getAccounts();

  const masterInstance = await master.deployed();

  const vestingInstance = await vest.deployed();

  await console.log("Setting vesting controller in master");

  await masterInstance.setVestingController(vestingInstance.address);
  await console.log("vesting controller set in master");
  await console.log("------------");
  await console.log("Setting master in vesting");

  await vestingInstance.setMaster(masterInstance.address);

  await console.log("Deployment complete");
};
