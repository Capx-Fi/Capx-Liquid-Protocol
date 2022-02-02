// SPDX-License-Identifier: GNU GPLv3
import "./timestampToDateLibrary.sol";
import "../node_modules/@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./UUPSUpgradeable.sol";
import "../node_modules/@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "../node_modules/@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";

import "../node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";

pragma solidity 0.8.4;

interface ERC20Properties {
    function symbol() external view returns (string memory);

    function name() external view returns (string memory);

    function decimals() external view returns (uint8);
}

pragma solidity 0.8.4;

interface ERC20Clone {
    function mintbyControl(address _to, uint256 _amount) external;

    function burnbyControl(address _to, uint256 _amount) external;
}

interface Master {
    function getFactory() external view returns (address);

    function getProposal() external view returns (address);
}

pragma solidity 0.8.4;

interface AbsERC20Factory {
    function createStorage(
        string memory _wrappedTokenName,
        string memory _wrappedTokenTicker,
        uint8 _wrappedTokenDecimals,
        uint256 _vestTime
    ) external returns (address);
}

pragma solidity 0.8.4;

/// @title Controller contract for creating WVTs
/// @author Capx Team
/// @notice User can interact with the Controller contract only through Master contract.
/// @dev This contract uses openzepplin Upgradable plugin. https://docs.openzeppelin.com/upgrades-plugins/1.x/
contract Controller is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    using SafeERC20Upgradeable for IERC20Upgradeable;

    uint256 internal constant DAY = 86400;
    uint256 internal constant _ACTIVE = 2;
    uint256 internal constant _INACTIVE = 1;

    uint256 public lastVestID;
    uint256 internal _locked;
    uint256 internal _killed;
    uint256 internal _limitOfDerivatives;
    address internal masterContract;

    mapping(uint256 => address) public derivativeIDtoAddress;
    mapping(address => uint256) public vestingTimeOfTokenId;
    mapping(address => uint256) public totalDerivativeForAsset;
    mapping(address => address) public assetAddresstoProjectOwner;
    mapping(address => address) public derivativeAdrToActualAssetAdr;

    struct derivativePair {
        address sellable;
        address nonsellable;
    }

    mapping(address => mapping(uint256 => derivativePair))
        public assetToDerivativeMap;
    mapping(address => mapping(address => uint256))
        public assetLockedForDerivative;

    event ProjectInfo(
        address indexed tokenAddress,
        string tokenTicker,
        address creator,
        uint256 tokenDecimal
    );

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

    event TransferWrapped(
        address userAddress,
        address indexed wrappedTokenAddress,
        address receiverAddress,
        uint256 amount
    );

    event Withdraw(
        address indexed userAddress,
        uint256 amount,
        address wrappedTokenAddress
    );

    modifier noReentrant() {
        require(_locked != _ACTIVE, "ReentrancyGuard: Re-Entrant call");
        _locked = _ACTIVE;
        _;
        _locked = _INACTIVE;
    }

    function isKilled() internal view {
        require(_killed != _ACTIVE, "FailSafeMode: ACTIVE");
    }

    /// @notice Disables the WVT Creation & Withdraw functionality of the contract.
    function kill() external onlyOwner {
        _killed = _ACTIVE;
    }

    /// @notice Enables the WVT Creation & Withdraw functionality of the contract.
    function revive() external onlyOwner {
        _killed = _INACTIVE;
    }

    function initialize(address _masterContract) public initializer {
        __Ownable_init();
        lastVestID = 0;
        _killed = _INACTIVE;
        _locked = _INACTIVE;
        require(_masterContract != address(0), "Invalid Address");
        masterContract = _masterContract;
    }

    function _authorizeUpgrade(address _newImplementation)
        internal
        override
        onlyOwner
    {}

    /// @notice Using this function a user can vest their project tokens till a specific date
    /// @dev Iterates over the vesting sheet received in params for
    /// @param _tokenAddress Address of the project token
    /// @param _amount Amount of tokens the user wants to vest
    /// @param _distAddress Array of Addresses to whome the project owner wants to distribute derived tokens.
    /// @param _distTime Array of Integer timestamps at which the derived tokens will be eligible for exchange with project tokens
    /// @param _distAmount Array of amount which determines how much of each derived tokens should be distributed to _distAddress
    /// @param _transferable Array of boolean determining which asset is sellable and which is not
    /// @param _caller Address calling this function through controller
    function createBulkDerivative(
        address _tokenAddress,
        uint256 _amount,
        address[] calldata _distAddress,
        uint256[] memory _distTime,
        uint256[] memory _distAmount,
        bool[] memory _transferable,
        address _caller
    ) external virtual noReentrant {
        require(msg.sender == masterContract, "Only master can call");
        isKilled();
        // Function variable Declaration
        uint256 totalAmount = 0;
        uint256 i = 0;
        _limitOfDerivatives = 20;

        require(
            (_distAddress.length == _distTime.length) &&
                (_distTime.length == _distAmount.length) &&
                (_distTime.length == _transferable.length) &&
                _distTime.length != 0 &&
                _amount != 0 &&
                _tokenAddress != address(0) &&
                _caller != address(0) &&
                _distTime.length <= 300,
            "Invalid Input"
        );

        // Registering the Project Asset to it's owner.
        if (assetAddresstoProjectOwner[_tokenAddress] == address(0)) {
            assetAddresstoProjectOwner[_tokenAddress] = _caller;
        }

        emit ProjectInfo(
            _tokenAddress,
            ERC20Properties(_tokenAddress).symbol(),
            assetAddresstoProjectOwner[_tokenAddress],
            ERC20Properties(_tokenAddress).decimals()
        );

        // Minting wrapped tokens by iterating on the vesting sheet
        for (i = 0; i < _distTime.length; i++) {
            _distTime[i] = (_distTime[i] / DAY) * DAY;

            require(
                _distTime[i] > ((block.timestamp / DAY) * DAY),
                "Not a future Vest End Time"
            );
            // Checking if the distribution of tokens is in consistent with the total amount of tokens.
            totalAmount += _distAmount[i];

            address _wrappedTokenAdr;
            if (_transferable[i]) {
                _wrappedTokenAdr = assetToDerivativeMap[_tokenAddress][
                    _distTime[i]
                ].sellable;
            } else {
                _wrappedTokenAdr = assetToDerivativeMap[_tokenAddress][
                    _distTime[i]
                ].nonsellable;
            }
            string memory _wrappedTokenTicker = "";
            if (_wrappedTokenAdr == address(0)) {
                //function call to deploy new ERC20 derivative
                lastVestID += 1;
                require(_limitOfDerivatives > 0, "Derivative limit exhausted");
                _limitOfDerivatives -= 1;
                (_wrappedTokenAdr, _wrappedTokenTicker) = _deployNewERC20(
                    _tokenAddress,
                    _distTime[i],
                    _transferable[i]
                );

                //update mapping
                _updateMappings(
                    _wrappedTokenAdr,
                    _tokenAddress,
                    _distTime[i],
                    _transferable[i]
                );
            } else {
                _wrappedTokenTicker = ERC20Properties(_wrappedTokenAdr).symbol();
            }
            assert(
                _mintWrappedTokens(
                    _tokenAddress,
                    _distAddress[i],
                    _distAmount[i],
                    _wrappedTokenAdr
                )
            );

            totalDerivativeForAsset[_tokenAddress] += _distAmount[i];

            emit CreateVest(
                _tokenAddress,
                assetAddresstoProjectOwner[_tokenAddress],
                _distAddress[i],
                _distAmount[i],
                _distTime[i],
                _wrappedTokenAdr,
                _wrappedTokenTicker,
                _transferable[i]
            );
        }

        require(totalAmount == _amount, "Inconsistent amount of tokens");
        assert(
            IERC20Upgradeable(_tokenAddress).balanceOf(address(this)) >=
                totalDerivativeForAsset[_tokenAddress]
        );
    }

    /// @notice Helper function to update the mappings.
    /// @dev Updates the global state variables.
    /// @param _wrappedTokenAdr Address of the WVT to be updated.
    /// @param _tokenAddress Address of the Project Token of which the WVT is created.
    /// @param _vestTime Time of unlock of the project token.
    /// @param _transferable Boolean to determine if this asset is sellable or not.
    function _updateMappings(
        address _wrappedTokenAdr,
        address _tokenAddress,
        uint256 _vestTime,
        bool _transferable
    ) internal {
        derivativeIDtoAddress[lastVestID] = _wrappedTokenAdr;

        if (_transferable) {
            assetToDerivativeMap[_tokenAddress][_vestTime]
                .sellable = _wrappedTokenAdr;
        } else {
            assetToDerivativeMap[_tokenAddress][_vestTime]
                .nonsellable = _wrappedTokenAdr;
        }

        vestingTimeOfTokenId[_wrappedTokenAdr] = _vestTime;

        derivativeAdrToActualAssetAdr[_wrappedTokenAdr] = _tokenAddress;
    }

    /// @notice Helper function to transfer the corresponding token.
    /// @dev Uses the IERC20Upgradable to transfer the asset from one user to another.
    /// @param _tokenAddress The asset of which the transfer is to take place.
    /// @param _from The address from which the asset is being transfered.
    /// @param _to The address to whom the asset is being transfered.
    /// @param _amount The quantity of the asset being transfered.
    function _safeTransferERC20(
        address _tokenAddress,
        address _from,
        address _to,
        uint256 _amount
    ) internal {
        // transfering ERC20 tokens from _projectOwner (msg.sender) to contract
        if (_from == address(this)) {
            IERC20Upgradeable(_tokenAddress).safeTransfer(_to, _amount);
        } else {
            IERC20Upgradeable(_tokenAddress).safeTransferFrom(
                _from,
                _to,
                _amount
            );
        }
    }

    /// @notice Function called by createBulkDerivative to spawn new cheap copies which make delegate call to ERC20 Model Contract
    /// @dev Uses the AbsERC20Factory interface object to call createStorage method of the factory contract
    /// @param _tokenAddress Token address for which a WVT is being created
    /// @param _vestTime The timestamp after which the token deployed can be exchanged for the project token
    /// @param _transferable The new deployed ERC20 is sellable or not
    /// @return Returns a tupple of address which contains the address of newly deployed ERC20 contract and its token ticker
    function _deployNewERC20(
        address _tokenAddress,
        uint256 _vestTime,
        bool _transferable
    ) internal virtual returns (address, string memory) {
        // Getting ERC20 token information
        string memory date = _timestampToDate(_vestTime);

        address currentContractAddress;
        string memory _wrappedTokenTicker;
        if (_transferable) {
            _wrappedTokenTicker = string(
                abi.encodePacked(
                    ERC20Properties(_tokenAddress).symbol(),
                    ".",
                    date
                    
                )
            );
            string memory wrappedTokenName = string(
                abi.encodePacked(
                    ERC20Properties(_tokenAddress).name(),
                    ".",
                    date
                )
            );
            uint8 wrappedTokenDecimals = ERC20Properties(_tokenAddress)
                .decimals();

            currentContractAddress = AbsERC20Factory(
                Master(masterContract).getFactory()
            ).createStorage(
                    wrappedTokenName,
                    _wrappedTokenTicker,
                    wrappedTokenDecimals,
                    0
                );
        } else {
            _wrappedTokenTicker = string(
                abi.encodePacked(
                    ERC20Properties(_tokenAddress).symbol(),
                    ".",
                   date,
                    "-NT"
                )
            );
            string memory wrappedTokenName = string(
                abi.encodePacked(
                    ERC20Properties(_tokenAddress).name(),
                    ".",
                    date,
                    "-NT"
                )
            );
            uint8 wrappedTokenDecimals = ERC20Properties(_tokenAddress)
                .decimals();

            currentContractAddress = AbsERC20Factory(
                Master(masterContract).getFactory()
            ).createStorage(
                    wrappedTokenName,
                    _wrappedTokenTicker,
                    wrappedTokenDecimals,
                    _vestTime
                );
        }

        // Creating new Wrapped ERC20 asset

        return (currentContractAddress, _wrappedTokenTicker);
    }

    /// @notice Function called by createBulkDerivative to mint new Derived tokens.
    /// @dev Uses the ERC20Clone interface object to instruct derived asset to mint new tokens.
    /// @param _tokenAddress Token address for which a WVT is being minted
    /// @param _distributionAddress The address to whom derived token is to be minted.
    /// @param _distributionAmount The amount of derived assets to be minted.
    /// @param _wrappedTokenAddress The address of the derived asset which is to be minted.
    function _mintWrappedTokens(
        address _tokenAddress,
        address _distributionAddress,
        uint256 _distributionAmount,
        address _wrappedTokenAddress
    ) internal virtual returns (bool _flag) {
        assetLockedForDerivative[_tokenAddress][
            _wrappedTokenAddress
        ] += _distributionAmount;

        // Minting Wrapped ERC20 token
        ERC20Clone(_wrappedTokenAddress).mintbyControl(
            _distributionAddress,
            _distributionAmount
        );
        _flag = (IERC20Upgradeable(_wrappedTokenAddress).totalSupply() ==
            assetLockedForDerivative[_tokenAddress][_wrappedTokenAddress]);
    }

    /// @notice Function called by derived asset contract when they are transferred.
    /// @param _from The address from which the token is being transferred.
    /// @param _to The address to which the token is being transferred.
    /// @param _amount The amount of tokens being transferred.
    function tokenTransfer(
        address _from,
        address _to,
        uint256 _amount
    ) external virtual {
        // This function can only be called by wrapped ERC20 token contract which are created by the controller
        require(derivativeAdrToActualAssetAdr[msg.sender] != address(0));
        emit TransferWrapped(_from, msg.sender, _to, _amount);
    }

    /// @notice Using this function a user can withdraw vested tokens in return of derived tokens held by the user address after the vest time has passed
    /// @dev This function burns the derived erc20 tokens and then transfers the project tokens to the msg.sender
    /// @param _wrappedTokenAddress Takes the address of the derived token
    /// @param _amount The amount of derived tokens the user want to withdraw
    /// @param _caller Address calling this function through controller
    function withdrawToken(
        address _wrappedTokenAddress,
        uint256 _amount,
        address _caller
    ) external virtual noReentrant {
        require(msg.sender == masterContract, "Only master can call");
        isKilled();

        require(
            derivativeAdrToActualAssetAdr[_wrappedTokenAddress] != address(0)
        );

        // Anyone other than Proposal Contract can't withdraw tokens if vest time has not passed.
        require(
            vestingTimeOfTokenId[_wrappedTokenAddress] <= block.timestamp,
            "Cannot withdraw before vest time"
        );

        address _tokenAddress = derivativeAdrToActualAssetAdr[
            _wrappedTokenAddress
        ];

        //Transfer the Wrapped Token to the controller first.
        _safeTransferERC20(
            _wrappedTokenAddress,
            _caller,
            address(this),
            _amount
        );

        totalDerivativeForAsset[_tokenAddress] -= _amount;

        // Burning wrapped tokens
        ERC20Clone(_wrappedTokenAddress).burnbyControl(address(this), _amount);

        assetLockedForDerivative[_tokenAddress][
            _wrappedTokenAddress
        ] -= _amount;

        _safeTransferERC20(_tokenAddress, address(this), _caller, _amount);
        assert(
            IERC20Upgradeable(_tokenAddress).balanceOf(address(this)) >=
                totalDerivativeForAsset[_tokenAddress]
        );

        emit Withdraw(_caller, _amount, _wrappedTokenAddress);
    }

    /// @notice This function is used by _deployNewERC20 function to set Ticker and Name of the derived asset.
    /// @dev This function uses the TimestampToDateLibrary.
    /// @param _timestamp tiemstamp which needs to be converted to date.
    /// @return finalDate as a string which the timestamp represents.
    function _timestampToDate(uint256 _timestamp)
        internal
        pure
        returns (string memory finalDate)
    {
        // Converting timestamp to Date using timestampToDateLibrary
        _timestamp = (_timestamp / DAY) * DAY;
        uint256 year;
        uint256 month;
        uint256 day;
        (year, month, day) = TimestampToDateLibrary.timestampToDate(_timestamp);
        string memory mstring;

        // Converting month component to String
        if (month == 1) mstring = "Jan";
        else if (month == 2) mstring = "Feb";
        else if (month == 3) mstring = "Mar";
        else if (month == 4) mstring = "Apr";
        else if (month == 5) mstring = "May";
        else if (month == 6) mstring = "Jun";
        else if (month == 7) mstring = "Jul";
        else if (month == 8) mstring = "Aug";
        else if (month == 9) mstring = "Sep";
        else if (month == 10) mstring = "Oct";
        else if (month == 11) mstring = "Nov";
        else if (month == 12) mstring = "Dec";

        // Putting data on finalDate
        finalDate = string(
            abi.encodePacked(_uint2str(day), mstring, _uint2str(year))
        );
    }

    /// @notice This function is used by _timestampToDate function to convert number to string.
    /// @param _i an integer.
    /// @return str which is _i as string.
    function _uint2str(uint256 _i) internal pure returns (string memory str) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 length;
        while (j != 0) {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint256 k = length;
        j = _i;
        while (j != 0) {
            bstr[--k] = bytes1(uint8(48 + (j % 10)));
            j /= 10;
        }
        str = string(bstr);
    }
}
