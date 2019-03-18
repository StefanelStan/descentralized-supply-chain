pragma solidity >0.4.25;

// Import the library 'Roles'
import "./Roles.sol";

// Define a contract 'ManufacturerRole' to manage this role - add, remove, check
contract ManufacturerRole {

    // Define 2 events, one for Adding, and other for Removing

    // Define a struct 'Manufacturers' by inheriting from 'Roles' library, struct Role

    // In the constructor make the address that deploys this contract the 1st Manufacturer
    constructor() public { }

    // Define a modifier that checks to see if msg.sender has the appropriate role
    modifier onlyManufacturer() {

        _;
    }

    // Define a function 'isManufacturer' to check this role
    function isManufacturer(address account) public view returns (bool) {

    }

    // Define a function 'addManufacturer' that adds this role
    function addManufacturer(address account) public onlyManufacturer {

    }

    // Define a function 'renounceManufacturer' to renounce this role
    function renounceManufacturer() public {

    }

    // Define an internal function '_addManufacturer' to add this role, called by 'addManufacturer'
    function _addManufacturer(address account) internal {

    }

    // Define an internal function '_removeManufacturer' to remove this role, called by 'removeManufacturer'
    function _removeManufacturer(address account) internal {

    }
}