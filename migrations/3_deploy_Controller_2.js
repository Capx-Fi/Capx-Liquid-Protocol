const controller = artifacts.require("Controller");
const master = artifacts.require("Master");

const { deployProxy } = require("@openzeppelin/truffle-upgrades");

module.exports = async function (deployer) {
  const accounts = await web3.eth.getAccounts();

  let masterInstance = await master.deployed();

  await console.log("Deploying Controller");

  let controllerInstance = await deployProxy(
    controller,
    [masterInstance.address],
    {
      kind: "uups",
    }
  );

  await console.log(
    "Controller Address deployed at -  " + controllerInstance.address
  );
};
