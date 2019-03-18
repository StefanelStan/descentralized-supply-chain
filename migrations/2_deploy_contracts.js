// migrating the appropriate contracts
var MinerRole = artifacts.require("./MinerRole.sol");
var ManufacturerRole = artifacts.require("./ManufacturerRole.sol");
var MasterjewelerRole = artifacts.require("./MasterjewelerRole.sol");
var RetailerRole = artifacts.require("./RetailerRole.sol");
var CustomerRole = artifacts.require("./CustomerRole.sol");
//var SupplyChain = artifacts.require("./SupplyChain.sol");

module.exports = function(deployer) {
  deployer.deploy(MinerRole);
  deployer.deploy(ManufacturerRole);
  deployer.deploy(MasterjewelerRole);
  deployer.deploy(RetailerRole);
  deployer.deploy(CustomerRole);
 // deployer.deploy(SupplyChain);
};
