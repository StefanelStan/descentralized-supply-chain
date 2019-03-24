pragma solidity >0.4.25;

// Import the library 'Roles'
import "./Roles.sol";

// Define a contract 'ManufacturerRole' to manage this role - add, remove, check
contract ManufacturerRole {
    using Roles for Roles.Role;
    // Define 2 events, one for Adding, and other for Removing
    event ManufacturerAdded(address indexed account);
    event ManufacturerRemoved(address indexed account);
    // Define a struct 'Manufacturers' by inheriting from 'Roles' library, struct Role
    Roles.Role private manufacturers;
    address private owner;
    // In the constructor make the address that deploys this contract the 1st Manufacturer
    constructor() public {
        _addManufacturer(msg.sender);
        owner = msg.sender;
    }

    function kill() external {
        require(msg.sender == owner, "Only the owner can kill this contract");
        selfdestruct(msg.sender);
    }

    // Define a modifier that checks to see if msg.sender has the appropriate role
    modifier onlyManufacturer() {
        require(isManufacturer(msg.sender), "Only a manufacturer can perform this action");
        _;
    }

    // Define a function 'isManufacturer' to check this role
    function isManufacturer(address account) public view returns (bool) {
        return manufacturers.has(account);
    }

    // Define a function 'addManufacturer' that adds this role
    function addManufacturer(address account) public onlyManufacturer {
        _addManufacturer(account);
    }

    // Define a function 'renounceManufacturer' to renounce this role
    function renounceManufacturer() public {
        _removeManufacturer(msg.sender);
    }

    // Define an internal function '_addManufacturer' to add this role, called by 'addManufacturer'
    function _addManufacturer(address account) internal {
        manufacturers.add(account);
        emit ManufacturerAdded(account);
    }

    // Define an internal function '_removeManufacturer' to remove this role, called by 'removeManufacturer'
    function _removeManufacturer(address account) internal {
        manufacturers.remove(account);
        emit ManufacturerRemoved(account);
    }
}