pragma solidity >0.4.25;

// Import the library 'Roles'
import "./Roles.sol";

// Define a contract 'MasterjewelRole' to manage this role - add, remove, check
contract MasterjewelerRole {
    using Roles for Roles.Role;
    // Define 2 events, one for Adding, and other for Removing
    event MasterjewelerAdded(address indexed account);
    event MasterjewelerRemoved(address indexed account);
    // Define a struct 'Masterjewelers' by inheriting from 'Roles' library, struct Role
    Roles.Role private masterjewelers;
    address private owner;
    // In the constructor make the address that deploys this contract the 1st Masterjeweler
    constructor() public { 
        _addMasterjeweler(msg.sender);
        owner = msg.sender;
    }

    function kill() external {
        require(msg.sender == owner, "Only the owner can kill this contract");
        selfdestruct(msg.sender);
    }

    // Define a modifier that checks to see if msg.sender has the appropriate role
    modifier onlyMasterjeweler() {
        require(isMasterjeweler(msg.sender), "Only a masterjeweler can add another masterjeweler");
        _;
    } 

    // Define a function 'isMasterjeweler' to check this role
    function isMasterjeweler(address account) public view returns (bool) {
        return masterjewelers.has(account);
    }

    // Define a function 'addMasterjeweler' that adds this role
    function addMasterjeweler(address account) public onlyMasterjeweler {
        _addMasterjeweler(account);
    }

    // Define a function 'renounceMasterjeweler' to renounce this role
    function renounceMasterjeweler() public {
        _removeMasterjeweler(msg.sender);
    }

    // Define an internal function '_addMasterjeweler' to add this role, called by 'addMasterjeweler'
    function _addMasterjeweler(address account) internal {
        masterjewelers.add(account);
        emit MasterjewelerAdded(account);
    }

    // Define an internal function '_removeMasterjeweler' to remove this role, called by 'removeMasterjeweler'
    function _removeMasterjeweler(address account) internal {
        masterjewelers.remove(account);
        emit MasterjewelerRemoved(account);
    }
}