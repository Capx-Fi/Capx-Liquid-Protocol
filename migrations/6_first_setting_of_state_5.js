const master = artifacts.require("Master");
const factory = artifacts.require("ERC20Factory");
const controller = artifacts.require("Controller");

const { deployProxy } = require("@openzeppelin/truffle-upgrades");

module.exports = async function (deployer) {
  const accounts = await web3.eth.getAccounts();

  let masterInstance = await master.deployed();

  let factoryInstance = await factory.deployed();
  let controllerInstance = await controller.deployed();

  //   const masterInstance = await master.at(MASTER_ADDRESS);

  await console.log("Setting factory NOW");

  await masterInstance.setLiquidFactory(factoryInstance.address);
  await console.log("FACTORY set on master");

  await console.log("------");

  await console.log("Setting CONTROLLER NOW");
  await masterInstance.setLiquidController(controllerInstance.address);
  await console.log("CONTROLLER set on master");
};
