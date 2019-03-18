pragma solidity >0.4.25;

// Import the library 'Roles'
import "./Roles.sol";

// Define a contract 'MasterjewelRole' to manage this role - add, remove, check
contract MasterjewelerRole {

    // Define 2 events, one for Adding, and other for Removing
    
    // Define a struct 'Masterjewelers' by inheriting from 'Roles' library, struct Role

    // In the constructor make the address that deploys this contract the 1st Masterjeweler
    constructor() public { }

    // Define a modifier that checks to see if msg.sender has the appropriate role
    modifier onlyMasterjeweler() {
    
        _;
    } 

    // Define a function 'isMasterjeweler' to check this role
    function isMasterjeweler(address account) public view returns (bool) {
        
    }

    // Define a function 'addMasterjeweler' that adds this role
    function addMasterjeweler(address account) public onlyMasterjeweler {
        
    }

    // Define a function 'renounceMasterjeweler' to renounce this role
    function renounceMasterjeweler() public {
        
    }

    // Define an internal function '_addMasterjeweler' to add this role, called by 'addMasterjeweler'
    function _addMasterjeweler(address account) internal {
        
    }

    // Define an internal function '_removeMasterjeweler' to remove this role, called by 'removeMasterjeweler'
    function _removeMasterjeweler(address account) internal {
        
    }
}