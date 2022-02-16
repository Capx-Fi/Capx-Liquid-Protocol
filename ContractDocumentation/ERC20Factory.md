Factory Contract 
======================
The factory contract is responsible for the deployment of ERC20 clones.

Variables
-------------
* `address public implementation`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; Address of the the model contract.

* `address public controller`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; Address of the controller contract.

* `address public lender`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; Address of the lender contract.

Functions 
-----------------

### Constructor

```solidity
constructor(
  address _implementaiton,
  address _controller
  )
```
At the time of deployment factory takes in the address of model ERC20 contract as `_implementaiton` and address of the controller contract as `_controller`

### setLender

```solidity
function setLender(address _lender) onlyOwner external{
        lender=_lender;
    }
```
*External function can only be accessed by owner address*.   

This function can be used by owner to set new lender contract address.

   
Inputs required :
* `_lender` - Address of lender contract.

Functionality  
* The function checks if it is called by the owner only.
* The function sets new address to the `lender` state variable.

### createStorage

```solidity
function createStorage(
  string memory _wrappedTokenName, 
  string memory _wrappedTokenTicker, 
  uint8 _wrappedTokenDecimals,
  uint256 _vestEndTime
  ) public returns (address)
```

*Public function can only be accessed by controller*. <br/>
This function can be used by the controller to instruct the factory to make a new clone of ERC20 model contract and returns its address.

   
Inputs required :
* `_wrappedTokenName` - Token Name of the Wrapped ERC20 Token.
* `_wrappedTokenTicker` - Token Ticker of the Wrapped ERC20 Token.
* `_wrappedTokenDecimals` - Decimal value of the Wrapped ERC20 Token.
* `_vestEndTime` - Vest end time for the newly deployed asset. In case the asset is sellable this is sent as 0 so that the asset can be transferred between addresses.

Functionality  
* The function checks if it is called by controller or not.
* The function deploys a cheap copy of the model ERC20 contract.
* The function initializes the newly deployed ERC20 contract with `_wrappedTokenName`, `_wrappedTokenTicker`,`_wrappedTokenDecimals` and `_vestEndTime`.
* The function returns the newly deployed contract address.


### createClone

```solidity
function createClone(
  address target
  ) internal 
  returns (
    address result
    ) 
```

*Internal function which is used by* `createStorage` *function*  
   
Inputs required 
* `target` - `createStorage` function passes address of the model ERC20 contract

Functionality  
* Uses assembly to clone the `target` contract. 
* Returns the address of the newly deployed clone of the `target` contract.

-----------------