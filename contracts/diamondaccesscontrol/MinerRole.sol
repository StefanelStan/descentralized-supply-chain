pragma solidity >0.4.24;

// Import the library 'Roles'
import "./Roles.sol";

// Define a contract 'MinerRole' to manage this role - add, remove, check
contract MinerRole {
    using Roles for Roles.Role;

    // Define 2 events, one for Adding, and other for Removing
    event MinerAdded(address indexed account);
    event MinerRemoved(address indexed account);

    // Define a struct 'miners' by inheriting from 'Roles' library, struct Role
    Roles.Role private miners;
    address private owner;
    // In the constructor make the address that deploys this contract the 1st Miner
    constructor() public {
        _addMiner(msg.sender);
        owner = msg.sender;
    }
    function kill() external {
        require(msg.sender == owner, "Only the owner can kill this contract");
        selfdestruct(msg.sender);
    }
    // Define a modifier that checks to see if msg.sender has the appropriate role
    modifier onlyMiner() {
        require(isMiner(msg.sender), "Only a miner can add another miner");
        _;
    }

    // Define a function 'isMiner' to check this role
    function isMiner(address account) public view returns (bool) {
        return miners.has(account);
    }

    // Define a function 'addMiner' that adds this role
    function addMiner(address account) public onlyMiner {
        _addMiner(account);
    }

    // Define a function 'renounceMiner' to renounce this role
    function renounceMiner() public {
        _removeMiner(msg.sender);
    }

    // Define an internal function '_addMiner' to add this role, called by 'addMiner'
    function _addMiner(address account) internal {
        miners.add(account);
        emit MinerAdded(account);
    }

    // Define an internal function '_removeMiner' to remove this role, called by 'removeMiner'
    function _removeMiner(address account) internal {
        miners.remove(account);
        emit MinerRemoved(account);
    }
}