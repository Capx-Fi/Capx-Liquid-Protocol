// SPDX-License-Identifier: GNU GPLv3

pragma solidity 0.8.4;

import "../node_modules/@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./UUPSUpgradeable.sol";
import "../node_modules/@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "../node_modules/@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";

import "../node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";

interface LiquidController {
    function createBulkDerivative(
        address _tokenAddress,
        uint256 _amount,
        address[] calldata _distAddress,
        uint256[] memory _distTime,
        uint256[] memory _distAmount,
        bool[] memory _transferable,
        address _caller
    ) external;

    function withdrawToken(
        address _wrappedTokenAddress,
        uint256 _amount,
        address _caller
    ) external;
}

interface VestingController {
    function lockTokens(
        address _tokenAddress,
        address _lockOwner,
        uint256 _amount,
        address[] calldata _withdrawalAddress,
        uint256[] memory _distAmount,
        uint256[] memory _unlockTime
    ) external;

    function transferLocks(
        uint256 _id,
        address _receiverAddress,
        address _caller
    ) external;

    function withdrawTokens(uint256 _id, address _caller) external;
}

pragma solidity 0.8.4;

interface ERC20Properties {
    function symbol() external view returns (string memory);

    function name() external view returns (string memory);

    function decimals() external view returns (uint8);
}

pragma solidity 0.8.4;

/// @title Master contract for vesting
/// @author Capx Team
/// @notice The Master contract is the only contract which the user will interact with for vesting.
/// @dev This contract uses openzepplin Upgradable plugin. https://docs.openzeppelin.com/upgrades-plugins/1.x/
contract Master is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    using SafeERC20Upgradeable for IERC20Upgradeable;

    uint256 internal constant _ACTIVE = 2;
    uint256 internal constant _INACTIVE = 1;
    uint256 internal constant ADMIN_ACTIONS_DELAY = 3 * 86400;

    address public liquidController;
    address public liquidFactory;
    address public liquidProposal;

    address public vestingController;
    address public futureFactory;
    address public futureProposal;

    bool private liquidControllerSetFlag;
    bool private factorySetFlag;
    bool private vestingSetFlag;

    uint256 internal _locked;

    uint256 public newFactoryDeadline;
    uint256 public newProposalDeadline;

    mapping(address => address) public assetAddresstoProjectOwner;

    event ProjectInfo(
        string name,
        address indexed tokenAddress,
        string tokenTicker,
        string documentHash,
        address creator,
        uint256 tokenDecimal
    );

    modifier noReentrant() {
        require(_locked != _ACTIVE, "ReentrancyGuard: Re-Entrant call");
        _locked = _ACTIVE;
        _;
        _locked = _INACTIVE;
    }

    function _authorizeUpgrade(address _newImplementation)
        internal
        override
        onlyOwner
    {}

    function initialize() public initializer {
        __Ownable_init();
        _locked = _INACTIVE;
        liquidControllerSetFlag = false;
        factorySetFlag = false;
        vestingSetFlag = false;
    }

    function setLiquidController(address _controller) external onlyOwner {
        require(!liquidControllerSetFlag, "Liquid Controller already set");
        require(_controller != address(0), "Invalid Address");
        liquidController = _controller;
        liquidControllerSetFlag = true;
    }

    function setLiquidFactory(address _factory) external onlyOwner {
        require(!factorySetFlag, "Factory already set");
        require(_factory != address(0), "Invalid Address");
        liquidFactory = _factory;
        factorySetFlag = true;
    }

    function setVestingController(address _controller) external onlyOwner {
        require(!vestingSetFlag, "Vesting Controller already set");
        require(_controller != address(0), "Invalid Address");
        vestingController = _controller;
        vestingSetFlag = true;
    }

    function commitTransferFactory(address _newFactory) external onlyOwner {
        require(_newFactory != address(0), "Invalid Input");
        require(newFactoryDeadline == 0, "Active factory transfer");
        newFactoryDeadline = block.timestamp + ADMIN_ACTIONS_DELAY;
        futureFactory = _newFactory;
    }

    function applyTransferFactory() external onlyOwner {
        require(block.timestamp >= newFactoryDeadline, "insufficient time");
        require(newFactoryDeadline != 0, "No Active factory transfer");
        newFactoryDeadline = 0;
        liquidFactory = futureFactory;
    }

    function revertFactoryTransfer() external onlyOwner {
        newFactoryDeadline = 0;
    }

    function commitTransferProposal(address _newProposal) external onlyOwner {
        require(_newProposal != address(0), "Invalid Input");
        require(newProposalDeadline == 0, "Active Proposal transfer");
        newProposalDeadline = block.timestamp + ADMIN_ACTIONS_DELAY;
        futureProposal = _newProposal;
    }

    function applyTransferProposal() external onlyOwner {
        require(block.timestamp >= newProposalDeadline, "insufficient time");
        require(newProposalDeadline != 0, "No Active Proposal transfer");
        newProposalDeadline = 0;
        liquidProposal = futureProposal;
    }

    function revertProposalTransfer() external onlyOwner {
        newProposalDeadline = 0;
    }

    function getFactory() external view returns (address) {
        return (liquidFactory);
    }

    function getProposal() external view returns (address) {
        return (liquidProposal);
    }

    /// @notice Using this function a user can vest their project tokens till a specific date
    /// @dev Iterates over the vesting sheet received in params for multiple arrays
    /// @param _tokenAddress Address of the project token
    /// @param _amount uint array which contains only two elements(amount to be wrapped,amount to be locked)
    /// @param _liquid_distAddress Array of Addresses to whome the project owner wants to distribute derived tokens.
    /// @param _liquid_distTime Array of Integer timestamps at which the derived tokens will be eligible for exchange with project tokens
    /// @param _liquid_distAmount Array of amount which determines how much of each derived tokens should be distributed to _distAddress
    /// @param _liquid_transferable Array of boolean determining which asset is sellable and which is not
    /// @param _vesting_distAddress Array of Addresses to whome the project owner wants to assign the lock to.
    /// @param _vesting_distTime Array of Integer timestamps at which the locks can be unlocked
    /// @param _vesting_distAmount Array of amounts of which the locks are needed to be created
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
    ) external virtual noReentrant {
        require(
            bytes(_name).length >= 2 &&
                bytes(_name).length <= 26 &&
                bytes(_documentHash).length == 46,
            "Invalid name or document length"
        );
        require(_amount.length == 2, "Only 2 amounts");
        require(
            (_liquid_distAddress.length == _liquid_distTime.length) &&
                (_liquid_distTime.length == _liquid_distAmount.length) &&
                (_liquid_distTime.length == _liquid_transferable.length) &&
                (_vesting_distAddress.length == _vesting_distTime.length) &&
                (_vesting_distTime.length == _vesting_distAmount.length),
            "Inconsistency in vesting details"
        );

        if (assetAddresstoProjectOwner[_tokenAddress] == address(0)) {
            assetAddresstoProjectOwner[_tokenAddress] = msg.sender;
        }

        require(
            _liquid_distAddress.length + _vesting_distAddress.length != 0,
            "Invalid Input"
        );
        if (_liquid_distAddress.length > 0) {
            _safeTransferERC20(
                _tokenAddress,
                msg.sender,
                liquidController,
                _amount[0]
            );
            LiquidController(liquidController).createBulkDerivative(
                _tokenAddress,
                _amount[0],
                _liquid_distAddress,
                _liquid_distTime,
                _liquid_distAmount,
                _liquid_transferable,
                msg.sender
            );
        }

        if (_vesting_distAddress.length > 0) {
            _safeTransferERC20(
                _tokenAddress,
                msg.sender,
                vestingController,
                _amount[1]
            );
            VestingController(vestingController).lockTokens(
                _tokenAddress,
                msg.sender,
                _amount[1],
                _vesting_distAddress,
                _vesting_distAmount,
                _vesting_distTime
            );
        }

        emit ProjectInfo(
            _name,
            _tokenAddress,
            ERC20Properties(_tokenAddress).symbol(),
            _documentHash,
            assetAddresstoProjectOwner[_tokenAddress],
            ERC20Properties(_tokenAddress).decimals()
        );
    }

    /// @notice Using this function a user can swap WVT tokens for underlying asset after the vest time has passed
    /// @dev Calls LiquidController's withdrawToken function
    /// @param _wrappedTokenAddress Address of the wrapped asset
    /// @param _amount Amount of WVT tokens user wants to swap for underlying asset
    function withdrawWrappedVestingToken(
        address _wrappedTokenAddress,
        uint256 _amount
    ) external virtual noReentrant {
        LiquidController(liquidController).withdrawToken(
            _wrappedTokenAddress,
            _amount,
            msg.sender
        );
    }

    /// @notice Using this function a user can unlock their vesting tokens which were locked
    /// @dev Calls VestingController's withdrawTokens function
    /// @param _id Vest ID of lock
    function withdrawVestingLock(uint256 _id) external virtual noReentrant {
        VestingController(vestingController).withdrawTokens(_id, msg.sender);
    }

    /// @notice Using this function a user can unlock their vesting tokens which were locked
    /// @dev Calls VestingController's withdrawTokens function
    /// @param _id Vest ID of lock
    function transferVestingLock(uint256 _id, address _receiverAddress)
        external
        noReentrant
    {
        VestingController(vestingController).transferLocks(
            _id,
            _receiverAddress,
            msg.sender
        );
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
}
