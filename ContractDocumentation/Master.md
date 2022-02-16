Master Contract 
======================
The `Master` contract is the contract which is responsible for creating wrapped assets and locks for vesting.

Constants
-------------

* `uint256 private constant _INACTIVE`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; Signifies the state of a function being in-active.

* `uint256 private constant _ACTIVE`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; Signifies the state of a function being active.

* `uint256 ADMIN_ACTIONS_DELAY`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; Number of seconds in three days.

Variables
-------------
* `address public liquidController`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; Liquid Controller address.

* `address public liquidFactory`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; Liquid Factory address.

* `address public liquidProposal`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; Liquid Factory address.

* `address public vestingController`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; Vesting controller address.

* `address public futureFactory`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; future factory address.

* `address public futureProposal`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; future proposal address.

* `bool private liquidControllerSetFlag`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; Boolean flag which prevents setting of liquid controller again immediately.

* `bool private factorySetFlag`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; Boolean flag which prevents setting of factory for liquid controller again immediately.

* `bool private vestingSetFlag`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; Boolean flag which prevents setting of vesting controller again immediately.

* `uint256 internal _locked`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; Determines the state of the function.

* `uint256 public newFactoryDeadline`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; Timestamp at which the new factory address will be updated.

* `uint256 public newProposalDeadline`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; Timestamp at which the new proposal address will be updated.

* `mapping(address => address) public assetAddresstoProjectOwner`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; Mapping which stores the address of the project owner.

Events
-------------

```solidity
event ProjectInfo(
        string name,
        address indexed tokenAddress,
        string tokenTicker,
        string documentHash,
        address creator,
        uint256 tokenDecimal
    );
```
Event emitted when Project is On-boarded.
* `name` - Name of the project.
* `tokenAddress` - Address of the token being vested.
* `tokenTicker` - Symbol of token.
* `documentHash` - IPFS hash of project document.
* `creator` - Creator address of the token.
* `tokenDecimal` - Number of decimals of token.

Modifiers 
-----------------

```solidity
  modifier noReentrant() {
      require(_locked != _ACTIVE, "ReentrancyGuard: Re-Entrant call");
      _locked = _ACTIVE;
      _;
      _locked = _INACTIVE;
    }
```
Prevents a contract from calling itself, directly or indirectly. i.e. prevent reentrant calls to a function.

Functions 
-----------------

### Initializer

```solidity
function initialize() public 
  initializer
```
While deploying, `deployProxy` internally calls this initializer for the controller contract.

### _authorizeUpgrade

```solidity
  function _authorizeUpgrade(
    address _newImplementation
    ) internal 
    override 
    onlyOwner
```
Function responsible to internally update the smart contract, ideally it should revert when msg.sender is not authorized to upgrade the contract.

### setLiquidController

```solidity
  function setLiquidController(address _controller) external onlyOwner
```
Function responsible for setting the liquid `_controller` address in the Master contract.

### setLiquidFactory

```solidity
  function setLiquidFactory(address _factory) external onlyOwner
```
Function responsible for setting the liquid `_factory` address in the Master contract.

### setVestingController

```solidity
  function setVestingController(address _controller) external onlyOwner
```
Function responsible for setting the vesting `_controller` address in the Master contract.

### commitTransferFactory

```solidity
  function commitTransferFactory(address _newFactory) external onlyOwner 
```
Function responsible for committing new factory contract to master.

### applyTransferFactory

```solidity
  function applyTransferFactory() external onlyOwner
```
Function responsible for applying new factory contract to master.

### revertFactoryTransfer

```solidity
  function revertFactoryTransfer() external onlyOwner
```
Function responsible for reverting the committed factory contract to master.

### commitTransferProposal

```solidity
  function commitTransferProposal(address _newProposal) external onlyOwner
```
Function responsible for committing new proposal contract to master.

### applyTransferProposal

```solidity
  function applyTransferProposal() external onlyOwner
```
Function responsible for applying new proposal contract to master.

### revertProposalTransfer

```solidity
  function revertProposalTransfer() external onlyOwner 
```
Function responsible for reverting the committed proposal contract to master.

### getFactory

```solidity
  function getFactory() external view returns (address)
```
Function returns the factory contract.

### getProposal

```solidity
  function getProposal() external view returns (address)
```
Function returns the proposal contract.

### createBulkDerivative

```solidity
function createBulkDerivative(
    string memory _name,
    string memory _documentHash,
    address _tokenAddress,
    uint256[] memory _amount,
    address[] memory _liquid_distAddress,
    uint256[] memory _liquid_distTime,
    uint256[] memory _liquid_distAmount,
    bool[] memory _liquid_transferable,
    address[] memory _vesting_distAddress,
    uint256[] memory _vesting_distTime,
    uint256[] memory _vesting_distAmount
) external virtual noReentrant
```

*External function to create vests using a vesting sheet*  
   
Inputs required 
* `_name` - Name of the project
* `_documentHash` - IPFS hash of the project description
* `_tokenAddress` - The ERC20 asset the user wants to vest
* `_amount` - Array of size 2 with total amount of ERC20 tokens the user wants to create WVTs of and to lock without WVTs
* `_liquid_distAddress` - The addresses to whom the derived assets need to be distributed to
* `_liquid_distTime` - The time till which the tokens need to be vested for each particular `_liquid_distAddress`
* `_liquid_distAmount` - The amount of derived assets to be distributed to each `_liquid_distAddress`
* `_liquid_transferable` - The type of assets to be distributed(sellable or non sellable)
* `_vesting_distAddress` - The addresses to whom the locks needs to be assigned to
* `_vesting_distTime` - The time till which the tokens will be locked for each `_vesting_distAddress`
* `_vesting_distAmount` - The amount of tokens to be locked and distributed to each `_vesting_distAddress`

Input Validation 
* `_liquid_distAddress`,`_liquid_distTime`,`_liquid_distAmount` and `_liquid_transferable` should have equal length
* The `_amount` should be an array of length 2
* `_vesting_distAddress`,`_vesting_distTime` and `_vesting_distAmount` should have equal length


Functionality  
* The function calls the liquid controller and the vesting lock controller with appropriate values to execute the vesting schedule 
* The function transfers the actual ERC20 address from the calling user to either liquid controller and vesting controller.

### withdrawWrappedVestingToken

```solidity
function withdrawWrappedVestingToken(
        address _wrappedTokenAddress,
        uint256 _amount
    ) external virtual noReentrant
```
*External function which can be accessed by any user*  
   
Inputs required
* `_wrappedTokenAddress` - Address of the wrapped token the user wants to exchange for actual asset
* `_amount` - The amount of tokens the user wants to exchange

Prerequisite
* The vesting time of the `_wrappedTokenAddress` should have been elapsed

Functionality  
* Calls liquid controller with appropriate values

### withdrawVestingLock

```solidity
function withdrawVestingLock(uint256 _id) external virtual noReentrant
```
*External function which can be accessed by any user*  
   
Inputs required
* `_id` - ID of the vesting lock

Prerequisite
* The vesting time of the lock should have been elapsed

Functionality  
* Calls vesting lock controller with appropriate values

### transferVestingLock

```solidity
function transferVestingLock(uint256 _id, address _receiverAddress)
        external
        noReentrant
```
*External function which can be accessed by any user*  
   
Inputs required
* `_id` - ID of the vesting lock
* `_receiverAddress` - Address to whom the lock is to be transferred

Functionality  
* Calls vesting lock controller with appropriate values

### _safeTransferERC20

```solidity
function _safeTransferERC20(
  address _tokenAddress,
  address _from,
  address _to,
  uint256 _amount
  ) internal 
```
*Internal function*
   
Inputs required
* `_tokenAddress` - The ERC20 asset the user wants to vest
* `_from` - The Address from which the asset is to be transferred.
* `_to` - The address to which the asset is to be transferred.
* `_amount` - The quantity of ERC20 asset to be transferred.

Functionality  
* Transfers the `_tokenAddress` ERC20 asset.