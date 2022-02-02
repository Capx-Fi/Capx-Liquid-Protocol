Controller Contract 
======================
The `Controller` contract is the contract which is responsible for creating wrapped assets for vesting. The controller contract has the following tasks. 
*  Keep the vested tokens.
*  Deploy new ERC20 token(s) for the vested tokens.
*  Mint new Derived asset(s) i.e. deployed ERC20 token(s).
*  After the vesting time has passed, return the actual ERC20 token in exchange of derived asset(s) which are eventually burnt.


Constants
-------------

* `uint256 DAY`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; Number of seconds in a day.

* `uint256 private constant _INACTIVE`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; Signifies the state of a function being in-active.

* `uint256 private constant _ACTIVE`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; Signifies the state of a function being active.

Structs
-------------

* `struct derivativePair`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp;  Signifies the structure of a WVT pair.
```solidity
struct derivativePair { 
        address sellable;
        address nonsellable;
    }
```

Variables
-------------
* `uint256 public lastVestID`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; Number of wrapped asset platform has generated.

* `uint256 internal _locked`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; Determines the state of the function.

* `uint256 internal _killed`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; Determines the active state of the contract.

* `uint256 internal totalAmount`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; Total Amount of tokens created in a single createBulkDerivative function.

* `address internal masterContract`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; Address of the master contract.

* `mapping(uint256 => address) public derivativeIDtoAddress`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; Stores address of the wrapped token corresponding to their tokenID.

* `mapping(address => uint256) public vestingTimeOfTokenId`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; Vesting Schedule of corresponding ERC20 Token.

* ` mapping(address => uint256) public totalDerivativeForAsset`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; Mapping of total WVTs created for an Asset.

* `mapping(address => address) public assetAddresstoProjectOwner`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; Mapping of Asset address to the corresponding project owner.

* `mapping(address => address) public derivativeAdrToActualAssetAdr`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; Mapping of Wrapped asset address to the corresponding asset token.

* `mapping(address => mapping(uint256 => derivativePair)) public assetToDerivativeMap`: <br />
    &ensp;&nbsp;&nbsp;&nbsp;&nbsp; Stores address of sellable and non sellable wrapped asset corresponding to Address of ERC20 token at a specific release day.

* `mapping(address => mapping(address => uint256)) public assetLockedForDerivative`: <br />
    &ensp;&nbsp;&nbsp;&nbsp;&nbsp; Stores amount of asset locked for correspond the wrapped token.

Events
-------------

```solidity
event ProjectInfo(
        address indexed tokenAddress,
        string tokenTicker,
        address creator,
        uint256 tokenDecimal
    );
```
Event emitted when Project is On-boarded.
* `tokenAddress` - Token address of the project.
* `tokenTicker` - Token ticker of the project.
* `creator` - Creator address of the project.
* `tokenDecimal` - Number of decimal places the Project Token has.
 
```solidity
event CreateVest(
        address indexed assetAddress,
        address creator,
        address userAddress,
        uint256 userAmount,
        uint256 unlockTime,
        address wrappedERC20Address,
        string wrappedAssetTicker,
        bool transferable
    );
```
Event emitted on Creating a New Vest Schedule for every Recipient.
* `assetAddress` - Token address of the project. 
* `creator` - Creator of this vest.
* `userAddress` - User which will receive wrapped tokens.
* `userAmount` - Amount of wrapped asset the user will be getting. 
* `unlockTime` - Time when the asset will be unlocked. 
* `wrappedERC20Address` - Address of the derived asset.
* `wrappedAssetTicker` - Ticker of the derived asset.
* `transferable` - Is this asset sellable or non sellable.

```solidity
event TransferWrapped(
        address userAddress,
        address indexed wrappedTokenAddress,
        address receiverAddress,
        uint256 amount
    );
```

Event emitted on transfer of Wrapped Asset.
* `userAddress` - Address of the user transferring the wrapped asset owned by itself.
* `wrappedTokenAddress` - Address of the wrapped asset being transferred.
* `receiverAddress` - Address of the receiver.
* `amount` - Amount of wrapped asset being transferred.

```solidity
event Withdraw(
        address indexed userAddress,
        uint256 amount,
        address wrappedTokenAddress
    );
```

Event emitted on withdrawal of Project Tokens.
* `userAddress` - Address of the user withdrawing project tokens and burning wrapped tokens.
* `amount` - Amount of project tokens user wants to claim.
* `wrappedTokenAddress` - Address of the wrapped asset being burnt to claim project tokens.

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

### isKilled

```solidity
function isKilled() internal view
```
*Internal function*.   

Used to stop execution of `createBulkDerivative` and `withdrawToken` during the kill phase.

### kill

```solidity
function kill() external onlyOwner 
```
*External function can only be accessed by owner address*.   

This function can be used by the owner to start the kill phase.

### revive

```solidity
function revive() external onlyOwner 
```
*External function can only be accessed by owner address*.   

This function can be used by the owner to stop the kill phase.

### _authorizeUpgrade

```solidity
  function _authorizeUpgrade(
    address _newImplementation
    ) internal 
    override 
    onlyOwner
```
Function responsible to internally update the smart contract, ideally it should revert when msg.sender is not authorized to upgrade the contract.

### createBulkDerivative

```solidity
function createBulkDerivative(
    address _tokenAddress,
    uint256 _amount,
    address[] calldata _distAddress,
    uint256[] memory _distTime,
    uint256[] memory _distAmount,
    bool[] memory _transferable,
    address _caller
) external virtual noReentrant
```

*Public function for master to create vests using a vesting sheet*  
   
Inputs required 
* `_tokenAddress` - The ERC20 asset the user wants to vest
* `_amount` - Total amount of ERC20 tokens the user wants to vest
* `_distAddress` - The addresses to whom the derived assets need to be distributed to
* `_distTime` - The time till which the tokens need to be vested for each particular `_distAddress`
* `_distAmount` - The amount of derived assets to be distributed to each `_distAddress`
* `_transferable` - The type of assets to be distributed(sellable or non sellable)
* `_caller` - Address of the user who called the master contract

Input Validation 
* Vesting sheet length should should be less than 300
* `_distAddress`,`_distTime`,`_distAmount` and `_transferable` should have equal length
* The `_amount` should be a non zero value
* The `_distTime` should be in the future
* The `_distAmount` should be a non zero value


Functionality  
* The function checks if the number of `_distAddress`,`_distTime`,`_distAmount` and `_transferable` given are equal. 
* The function also checks if the sum of `_distAmount` is equivalent to the `_amount` given.
* `_distAddress`,`_distTime` and `_distAmount` form a vesting sheet which is used to figure out which derived asset and how many of it needs to be distributed among `_distAddress`
* The function iterates through the vesting sheet and deploy new derived assets if needed and mints the tokens. If there is a derived asset already existing for a specific asset at a specific vest time, the contract uses already deployed derived asset contract to mint the tokens. 
* The function transfers the actual ERC20 address from the calling user to itself.

### _updateMappings

```solidity
function _updateMappings(
  address _wrappedTokenAdr,
  address _tokenAddress,
  uint256 _vestTime,
  bool _transferable
  ) internal 
```
*Internal function which is used by* `createBulkDerivative` *function*
   
Inputs required
* `_wrappedTokenAdr` - The wrapped ERC20 asset.
* `_tokenAddress` - The ERC20 asset the user wants to vest
* `_vestTime` - The time rounded of to the nearest day on which the vested tokens will be unlocked
* `_transferable` - Boolean to determine if this asset is sellable or not

Functionality  
* Updates the state variables of the contract, `derivativeIDtoAddress`, `assetToDerivativeMap`, `vestingTimeOfTokenId`, `derivativeAdrToActualAssetAdr`.

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

### _deployNewERC20

```solidity
function _deployNewERC20(
  address _tokenAddress,
  uint256 _vestTime ,
  bool _transferable
  ) internal 
  virtual 
  returns (
    address, 
    string memory
    )
```

*Internal function which is used by* `createBulkDerivative` *function*  
   
Inputs required 
* `_tokenAddress` - The ERC20 asset the user wants to vest
* `_vestTime` - The time rounded of to the nearest day on which the vested tokens will be unlocked
* `_transferable` - The new deployed ERC20 is sellable or not

Functionality  
* The function fetches the tokenName, tokenTicker, tokenDecimals of the `_tokenAddress` and then instructs the factory contract to deploy a new copy of ERC20 contract with the naming convention of `<TokenName>.<DateOfExpiry>-<typeOfToken>` and symbol of `<TokenSymbol>.<DateOfExpiry>-<typeOfToken>` and decimal equal to `<TokenDecimal>`. `<typeOfToken>` only occurs as `NT` if the token is non sellable(tradable). If the token is sellable(tradable)  then the naming convention has no `<typeOfToken>`.
* If the newly deployed WVT is sellable then it can be transferred from one wallet to another before the vest time, else it cannot be transferred from one wallet to another.

### _mintWrappedTokens

```solidity
function _mintWrappedTokens(
        address _tokenAddress,
        address _distributionAddress,
        uint256 _distributionAmount,
        address _wrappedTokenAddress
    ) internal virtual returns (bool _flag)
```
*Internal function which is used by* `createBulkDerivative` *function*  
   
Inputs required 
* `_tokenAddress` - Token address for which a WVT is being minted
* `_distributionAddress` - The address to whom derived token is to be minted
* `_distributionAmount` - The amount of derived assets to be minted
* `_wrappedTokenAddress` - The address of the derived asset which is to be minted

Functionality  
* Mint the tokens of derived asset to `_distributionAddress`

### tokenTransfer

```solidity
function tokenTransfer(
  address _from, 
  address _to,
  uint256 _amount
  ) external 
  virtual
```

*External function which can only be accessed by derived assets contracts*  
   
Inputs required
* `_from` - From the address the tokens are being transferred to.
* `_to` - The address to which the tokens are being transferred to.
* `_amount` - The amount of tokens being transferred.

Functionality  
* Emits the `TransferWrapped` function

### withdrawToken

```solidity
function withdrawToken(
    address _wrappedTokenAddress,
    uint256 _amount,
    address _caller
) external virtual noReentrant
```
*Public function which can be accessed by any user*  
   
Inputs required
* `_wrappedTokenAddress` - Address of the wrapped token the user wants to exchange for actual asset
* `_amount` - The amount of tokens the user wants to exchange
* `_caller` - Address of the caller who called the master contract

Input Validation
* `_wrappedTokenAddress` should be a non zero address and a valid wrapped asset address created by the controller contract
* `_amount` should be non zero value

Prerequisite
* The vesting time of the `_wrappedAsset` should have been elapsed

Functionality  
* Checks if the vesting time corresponding to this token has passed
* Burns the derived asset tokens
* Transfer back the actual asset tokens

### _timestampToDate

```solidity
function _timestampToDate(
  uint timestamp
  ) internal 
  view 
  returns (
    string memory
    ) 
```

*Internal View function which is used by the smart contract and can be used by any user*  
   
Inputs required
* `timestamp` - Timestamp which needs to be converted to date

Functionality  
* Rounds of the timestamp to nearest day and returns the date as string
* Given a timestamp this function returns on which date the unlock of the token will happen

### _uint2str

```solidity
function _uint2str(
  uint256 _i
  ) internal 
  pure 
  returns (
    string memory str
    )
```

*Internal function which is used to convert uint256 integer to string*  
   
Inputs required
* `_i` - a uint256 integer

Functionality  
* Convert integer to string and return the string

