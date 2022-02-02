Model ERC20 Contract 
======================
The model ERC20 Contract is used by Factory to create clones. Clones make delegate calls to this contract to attain the functionality that of the an ERC20 Contract.

> _DelegateCall_ - Is a calling mechanism of how caller contract calls target contract function but when target contract executed its logic, the context is not on the user who execute caller contract but on caller contract.

Variables
-------------
* `mapping(address => uint256) private _balances`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; Mapping which stores the balances of which address owns how many ERC20 contracts.


* `mapping(address => mapping(address => uint256)) private _allowances`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; Mapping which stores the allowance of the token. That is which address is allowed to spend how many tokens of other address. 


* `uint256 private _totalSupply`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; Total Number of tokens in circulation of this contract.

* `uint256 private vestEndTime;`<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; The timestamp after which this token can be transferred from one address to another.

* `string private _name`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; Private string variable which stores the name of the token.


* `string private _symbol`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; Private string variable which stores the symbol of the token.


* `uint8 private _decimals`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; Private uint8 variable which stores the number of decimals this token supports.

* `address internal minter`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; Address of the minter

* `address public factory`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; Address of the factory contract

* `uint exec`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; Integer variable used to make sure the newly deployed clone can only be initialized once

* `controllerProperties controllerObject`:<br />
  &ensp;&nbsp;&nbsp;&nbsp;&nbsp; Object variable used to call controller functions.

Functions 
-----------------

### Initializer

```solidity
function initializer(
  address _minter, 
  string memory _wrappedTokenName, 
  string memory _wrappedTokenTicker, 
  uint8 _wrappedTokenDecimals,
  uint256 _vestEndTime
  ) public
```
   
Inputs required :
* `_minter` - Address of the who can mint & burn the token.
* `_wrappedTokenName` - Token Name of the Wrapped ERC20 Token.
* `_wrappedTokenTicker` - Token Ticker of the Wrapped ERC20 Token.
* `_wrappedTokenDecimals` - Decimal value of the Wrapped ERC20 Token.
* `_vestEndTime` - Timestamp after which this token can be transferred from one address to another.

On deployment of a clone by factory, the factory calls initializer to set controller address as minter so that only controller is allowed to mint or burn the tokens of clone contracts. It also updates `_name`,`_symbol`,`_decimals` private variables.

### name

```solidity
function name() public view virtual override returns (string memory)
```

*Public View function*  
Returns the name of the ERC20 token


### symbol

```solidity
function symbol() public view virtual override returns (string memory)
```

*Public View function*  
Returns the symbol of the ERC20 token


### decimals

```solidity
function decimals() public view virtual override returns (uint8)
```

*Public View function*  
Returns the decimals of the ERC20 token


### totalSupply

```solidity
function totalSupply() public view virtual override returns (uint256)
```

*Public View function*  
Returns the totalSupply of the ERC20 token


### balanceOf

```solidity
function balanceOf(
  address account
  ) public 
  view 
  virtual 
  override 
  returns (
    uint256
    ) 
```

*Public View function*   
   
Inputs required 
* `account` - Address of the account whose balance the caller wants to fetch

Functionality  
* Fetches balance of the `account` given as input


### transfer

```solidity
function transfer(
  address recipient, 
  uint256 amount
  ) public 
  virtual 
  override 
  returns (
    bool
    )
```

*Public function used to transfer tokens to another address*
   
Inputs required 
* `recipient` - Address of the account which will receive the tokens
* `amount` - Amount of tokens to be transferred

Functionality
* Calls the internal `_transfer` function to transfer the tokens


### allowance

```solidity
function allowance(
  address owner, 
  address spender
  ) public 
  view 
  virtual 
  override 
  returns (
    uint256
    )
```

*Public View function*  
   
Inputs required 
* `owner` - Address which is the owner of the tokens
* `spender` - Address which is allowed to spend the tokens

Functionality
* Returns the amount of tokens allowed to the spender which it can spend on behalf of the owner


### approve

```solidity
function approve(
  address spender, 
  uint256 amount
  ) public 
  virtual 
  override 
  returns (
    bool
    ) 
```

*Public function used to approve an address to transfer owner's tokens*
   
Inputs required 
* `spender` - Address which will be allowed to spend tokens on behalf of the caller of this function
* `amount` - Amount of tokens for which the approval is given

Functionality
* `amount` - number of tokens are approved for the spender to transfer.


### transferFrom

```solidity
function transferFrom(
  address sender,
  address recipient,
  uint256 amount
  ) public 
  virtual 
  override 
  returns (
    bool
    )
```

*Public function used to transfer approved tokens of another address*
   
Inputs required 
* `sender` - owner address of the tokens whose tokens will be transferred
* `recipient` - address which receives the tokens
* `amount` - amount of tokens transferred

Functionality
* `amount` number of tokens are transferred from `sender` to `recipient` if the `sender` has given approval for the same.


### increaseAllowance

```solidity
function increaseAllowance(
  address spender, 
  uint256 addedValue
  ) public 
  virtual 
  returns (
    bool
    )
```

*Public function used to increase allowance of transfer approved tokens of another address*
   
Inputs required 
* `spender` - address which is allowed to spend money
* `addedValue` - amount of allowance the caller wants to increase

Functionality 
* Increases the allowance of the token by the amount of addedValue 


### decreaseAllowance

```solidity
function decreaseAllowance(
  address spender, 
  uint256 subtractedValue
  ) public 
  virtual 
  returns (
    bool
    ) 
```

*Public function used to increase allowance of transfer approved tokens of another address*
   
Inputs required 
* `spender` - address which is allowed to spend money
* `subtractedValue` - amount of allowance the caller wants to decrease

Functionality 
* Decrease the allowance of the token by the amount of subtractedValue 


### _transfer

```solidity
function _transfer(
  address sender,
  address recipient,
  uint256 amount
  ) internal 
  virtual
```

*Internal transfer function used by `transfer` and `transferFrom`*
   
Inputs required
* `sender` - address which is sending the tokens
* `recipient` - address which will receive the tokens
* `amount` - amount of tokens to be transferred

Functionality
* Reverts transaction if the transfer is done before the timestamp of `vestEndTime` timestamp or if it is done it can only be done if the `sender` or `recipient` would be the `lender` contract
* In case of sellable token the `vestEndTime` value is equal to 0 but in case of nonsellable token the `vestEndTime` value is equal to vest time of the asset
* Transfers ERC20 tokens from `sender` to `recipient`
* Updates the balances mapping


### _mint

```solidity
function _mint(
  address account, 
  uint256 amount
  ) internal 
  virtual
```

*Internal function which mints new tokens equivalent to `amount` to the `account`*
   
Inputs required
* `account` - address which will receive the newly minted tokens
* `amount` - the amount of tokens to be minted

Functionality
* mints `amount` number of new tokens to the `account`
* Updates balances


### _burn

```solidity
function _burn(
  address account, 
  uint256 amount
  ) internal 
  virtual 
```

*Internal function which burns new tokens equivalent to `amount` from the `account`*
   
Inputs required
* `account` - address from which tokens will be burnt
* `amount` - the amount of tokens to be burned

Functionality
* burns `amount` number of tokens from the `account`
* Updates balances


### mintbyControl

```solidity
function mintbyControl(
  address account, 
  uint256 amount
  ) public
```

*Public function can only be accessed by controller*
   
Inputs required
* `account` - address which will receive the newly minted tokens
* `amount` - the amount of tokens to be minted

Functionality
* Calls internal `_mint` function


### burnbyControl

```solidity
function burnbyControl(
  address account, 
  uint256 amount
  ) public
```

*Public function can only be accessed by controller*
   
Inputs required
* `account` - address from which tokens will be burnt
* `amount` - the amount of tokens to be burned

Functionality
* Calls internal `_burn` function


### _approve

```solidity
function _approve(
  address owner,
  address spender,
  uint256 amount
  ) internal 
  virtual 
```

*Internal function used by `approve` function*
   
Inputs required 
* `owner` - Address who owns the tokens
* `spender` - Address which will be allowed to spend tokens on behalf of the owner
* `amount` - Amount of tokens for which the approval is given

Functionality
* `amount` number of owner tokens are approved for the spender to transfer.

-----------------