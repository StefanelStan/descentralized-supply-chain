pragma solidity ^0.5.0;

// Import the library 'Roles'
import "./Roles.sol";

// Define a contract 'CustomerRole' to manage this role - add, remove, check
contract CustomerRole {

    // Define 2 events, one for Adding, and other for Removing

    // Define a struct 'Customers' by inheriting from 'Roles' library, struct Role

    // In the constructor make the address that deploys this contract the 1st Customer
    constructor() public { }

    // Define a modifier that checks to see if msg.sender has the appropriate role
    modifier onlyCustomer() {
    
        _;
    } 

    // Define a function 'isCustomer' to check this role
    function isCustomer(address account) public view returns (bool) {
    
    }

    // Define a function 'addCustomer' that adds this role
    function addCustomer(address account) public onlyCustomer {
    
    }

    // Define a function 'renounceCustomer' to renounce this role
    function renounceCustomer() public {
    
    }

    // Define an internal function '_addCustomer' to add this role, called by 'addCustomer'
    function _addCustomer(address account) internal {
    
    }

    // Define an internal function '_removeCustomer' to remove this role, called by 'removeCustomer'
    function _removeCustomer(address account) internal {
    
    }
}