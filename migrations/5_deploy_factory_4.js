const factoryContract = artifacts.require("ERC20Factory");
const model = artifacts.require("ERC20CloneContract");
const controller = artifacts.require("Controller");

const { deployProxy } = require("@openzeppelin/truffle-upgrades");

module.exports = async function (deployer) {
  const accounts = await web3.eth.getAccounts();
  const modelInstance = await model.deployed();
  const controllerInstance = await controller.deployed();

  await console.log("Deploying Factory Contract");

  let erc20factory = await deployer.deploy(
    factoryContract,
    modelInstance.address,
    controllerInstance.address
  );

  await console.log("Factory IS deployed at Address " + erc20factory.address);
};
