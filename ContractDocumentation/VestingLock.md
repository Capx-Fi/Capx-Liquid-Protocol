Vesting Lock Contract 
======================
The `Vesting` contract is the contract which is responsible for creating vesting locks. The controller contract has the following tasks. 
*  Keep the vested tokens.
*  After the vesting time has passed, return the actual ERC20 token.


Constants
-------------

* `uint256 DAY`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; Number of seconds in a day.

* `uint256 private constant _INACTIVE`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; Signifies the state of a function being in-active.

* `uint256 private constant _ACTIVE`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; Signifies the state of a function being active.

* `uint256 ADMIN_ACTIONS_DELAY`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; Number of seconds in three days.

Structs
-------------

* `struct Items`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp;  Signifies a lock.
```solidity
struct Items {
        address tokenAddress;
        address withdrawalAddress;
        uint256 tokenAmount;
        uint256 unlockTime;
        bool withdrawn;
    }
```

Variables
-------------
* `uint256 public lockId`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; Number of locks created till date by the contract.

* `uint256 internal _locked`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; Determines the state of the function.

* `uint256 public newMasterDeadline`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; Timestamp at which the new master address will be updated.

* `address public masterController`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; Address of the master contract.

* `address public futureMasterController`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; future master address.

* `bool private masterSetFlag`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; Boolean flag which prevents setting of master for vesting lock controller again immediately.

* `mapping(uint256 => Items) public lockedToken`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; Mapping of locked items created for a lock id.

* `mapping(address => mapping(address => uint256)) public lockedTokenBalance`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; Mapping of amount of tokens locked pre address per token address.

Events
-------------

```solidity
event ProjectInfo(address indexed creator, address indexed tokenAddress);
```
Event emitted when Project is On-boarded.
* `creator` - Creator address of the project.
* `tokenAddress` - Token address of the project.
 
```solidity
event CreateVest(
        uint256 vestID,
        address indexed assetAddress,
        address creator,
        address userAddress,
        uint256 userAmount,
        uint256 unlockTime
    );
```
Event emitted on Creating a New Vest Lock for every Recipient.
* `vestID` - ID assigned to the lock.
* `assetAddress` - Token address of the project. 
* `creator` - Creator of this vest.
* `userAddress` - User which will receive tokens on unlock.
* `userAmount` - Amount of tokens locked. 
* `unlockTime` - Time when the asset will be unlocked. 

```solidity
event TransferLock(
        address userAddress,
        address indexed wrappedTokenAddress,
        address receiverAddress,
        uint256 amount,
        uint256 unlockTime
    );
```

Event emitted on transfer of Wrapped Asset.
* `userAddress` - Address of the user transferring the lock ownership.
* `wrappedTokenAddress` - Address of the asset of the lock.
* `receiverAddress` - Address of the receiver.
* `amount` - Amount of tokens in the lock.
* `unlockTime` - Time when lock is unlocked.

```solidity
event Withdraw(
        address indexed userAddress,
        uint256 amount,
        address wrappedTokenAddress,
        uint256 unlockTime
    );
```

Event emitted on withdrawal of Project Tokens.
* `userAddress` - Address of the user withdrawing project tokens.
* `amount` - Amount of project tokens unlocked.
* `wrappedTokenAddress` - Address of the project tokens.
* `unlockTime` - Time when the tokens were unlocked.

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
While deploying, `deployProxy` internally calls this initializer for the vesting controller contract.

### _authorizeUpgrade

```solidity
  function _authorizeUpgrade(
    address _newImplementation
    ) internal 
    override 
    onlyOwner
```
Function responsible to internally update the smart contract, ideally it should revert when msg.sender is not authorized to upgrade the contract.

### setMaster

```solidity
function setMaster(address _master) external onlyOwner 
  initializer
```
Function responsible for setting the `master` address in the Vesting Lock contract.

### commitTransferMaster

```solidity
  function commitTransferMaster(address _newMaster) external onlyOwner
```
Function responsible for committing new master contract to vesting lock controller.

### applyTransferMaster

```solidity
  function applyTransferMaster() external onlyOwner
```
Function responsible for applying new master contract to vesting lock controller.

### revertMasterTransfer

```solidity
  function revertMasterTransfer() external onlyOwner 
```
Function responsible for reverting the committed master contract to vesting lock controller.


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


### lockTokens

```solidity
function lockTokens(
    address _tokenAddress,
    address _lockOwner,
    uint256 _amount,
    address[] calldata _withdrawalAddress,
    uint256[] memory _distAmount,
    uint256[] memory _unlockTime
) external virtual noReentrant
```

*External function for master to create vests using a vesting sheet*  
   
Inputs required 
* `_tokenAddress` - The ERC20 asset the user wants to vest
* `_lockOwner` - The address which called the master contract
* `_amount` - Total amount of ERC20 tokens the user wants to vest
* `_withdrawalAddress` - The addresses to whom the locks are to be assigned to
* `_distAmount` - The amount of locks to be assigned to `_withdrawalAddress`
* `_unlockTime` - The time when the locks will unlock

Input Validation 
* Vesting sheet length should should be less than 100
* `_withdrawalAddress`,`_unlockTime` and `_distAmount` should have equal length
* The `_amount` should be a non zero value


Functionality  
* `_withdrawalAddress`,`_unlockTime` and `_distAmount` form a vesting sheet which is used to figure out whom the token locks are needed to be assigned to.
* The function iterates through the vesting sheet and create the locks.

### transferLocks

```solidity
function transferLocks(
        uint256 _id,
        address _receiverAddress,
        address _caller
    ) external virtual noReentrant
```
*External function for master to transfer locks* 
   
Inputs required
* `_id` - ID of the lock.
* `_receiverAddress` - Address which will become the owner of the lock.
* `_caller` - Address which called the vesting contract.

Functionality  
* Transfers the ownership of the lock.

### withdrawTokens

```solidity
function withdrawTokens(uint256 _id, address _caller)
        external
        virtual
        noReentrant
```

*External function used to withdraw unlocked tokens*  
   
Inputs required 
* `_id` - ID of the lock.
* `_caller` - Address which called the vesting contract.

Functionality  
* The function checks if the lock is unlocked and is called by the owner of the lock.
* The function transfers the project tokens back to the user.

