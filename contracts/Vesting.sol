// SPDX-License-Identifier: GNU GPLv3
import "../node_modules/@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./UUPSUpgradeable.sol";
import "../node_modules/@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "../node_modules/@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";

import "../node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";

pragma solidity 0.8.4;

/// @title Vesting contract for creating token locks
/// @author Capx Team
/// @notice User can interact with the Vesting contract only through Master contract.
/// @dev This contract uses openzepplin Upgradable plugin. https://docs.openzeppelin.com/upgrades-plugins/1.x/
contract Vesting is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    using SafeERC20Upgradeable for IERC20Upgradeable;

    uint256 internal constant DAY = 86400;
    uint256 internal constant _ACTIVE = 2;
    uint256 internal constant _INACTIVE = 1;
    uint256 internal constant ADMIN_ACTIONS_DELAY = 3 * 86400;

    uint256 public lockId;
    uint256 internal _locked;
    uint256 public newMasterDeadline;
    address public masterController;
    address public futureMasterController;
    bool private masterSetFlag;

    mapping(uint256 => Items) public lockedToken;
    mapping(address => mapping(address => uint256)) public lockedTokenBalance;

    struct Items {
        address tokenAddress;
        address withdrawalAddress;
        uint256 tokenAmount;
        uint256 unlockTime;
        bool withdrawn;
    }

    event ProjectInfo(address indexed creator, address indexed tokenAddress);

    event CreateVest(
        uint256 vestID,
        address indexed assetAddress,
        address creator,
        address userAddress,
        uint256 userAmount,
        uint256 unlockTime
    );

    event TransferLock(
        address userAddress,
        address indexed wrappedTokenAddress,
        address receiverAddress,
        uint256 amount,
        uint256 unlockTime
    );

    event Withdraw(
        address indexed userAddress,
        uint256 amount,
        address wrappedTokenAddress,
        uint256 unlockTime
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
        masterSetFlag = false;
    }

    function setMaster(address _master) external onlyOwner {
        require(!masterSetFlag, "Master already set");
        require(_master != address(0), "Invalid Address");
        masterController = _master;
        masterSetFlag = true;
    }

    function commitTransferMaster(address _newMaster) external onlyOwner {
        require(_newMaster != address(0), "Invalid Input");
        require(newMasterDeadline == 0, "Active Master transfer");
        newMasterDeadline = block.timestamp + ADMIN_ACTIONS_DELAY;
        futureMasterController = _newMaster;
    }

    function applyTransferMaster() external onlyOwner {
        require(block.timestamp >= newMasterDeadline, "insufficient time");
        require(newMasterDeadline != 0, "No Active master transfer");
        newMasterDeadline = 0;
        masterController = futureMasterController;
    }

    function revertMasterTransfer() external onlyOwner {
        newMasterDeadline = 0;
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

    /// @notice Using this function a user can create locks of tokens.
    /// @dev Each lock has a token assigned to it.
    /// @param _tokenAddress The asset which is supposed to be locked.
    /// @param _lockOwner Address passed by master which is trying to create the lock.
    /// @param _amount The quantity of assets being locked.
    /// @param _withdrawalAddress Address of users who can withdraw the locked tokens after vest time.
    /// @param _distAmount The amount to be locked for each of the _withdrawalAddress.
    /// @param _unlockTime Vest end time stamps of locks.
    function lockTokens(
        address _tokenAddress,
        address _lockOwner,
        uint256 _amount,
        address[] calldata _withdrawalAddress,
        uint256[] memory _distAmount,
        uint256[] memory _unlockTime
    ) external virtual noReentrant {
        require(msg.sender == masterController, "Not Authorized!");
        require(_tokenAddress != address(0), "Invalid Token Address.");
        require(
            _amount > 0 &&
                _withdrawalAddress.length != 0 &&
                _withdrawalAddress.length <= 100,
            "Invalid Inputs"
        );
        require(
            _withdrawalAddress.length == _unlockTime.length &&
                _unlockTime.length == _distAmount.length,
            "Inconsistency in vesting details"
        );

        emit ProjectInfo(_lockOwner, _tokenAddress);
        uint256 _sumAmount;
        for (uint256 i = 0; i < _unlockTime.length; i++) {
            _unlockTime[i] = (_unlockTime[i] / DAY) * DAY;

            require(
                _unlockTime[i] > ((block.timestamp / DAY) * DAY),
                "Not a future Vest End Time"
            );
            require(
                _distAmount[i] > 0 && _withdrawalAddress[i] != address(0),
                "Invalid Locking Details"
            );

            lockId += 1;
            //update balance in address
            lockedTokenBalance[_tokenAddress][
                _withdrawalAddress[i]
            ] += _distAmount[i];
            lockedToken[lockId].tokenAddress = _tokenAddress;
            lockedToken[lockId].withdrawalAddress = _withdrawalAddress[i];
            lockedToken[lockId].tokenAmount = _distAmount[i];
            lockedToken[lockId].unlockTime = _unlockTime[i];
            lockedToken[lockId].withdrawn = false;

            emit CreateVest(
                lockId,
                _tokenAddress,
                _lockOwner,
                _withdrawalAddress[i],
                _distAmount[i],
                _unlockTime[i]
            );
            _sumAmount += _distAmount[i];
        }
        require(_amount == _sumAmount, "Inconsistent amount of tokens");
    }

    /// @notice Using this function a user can transfer locks.
    /// @dev New receiver address is set to existing lock.
    /// @param _id lock ID to be transferred.
    /// @param _receiverAddress Address to which the lock needs to be transferred.
    /// @param _caller Address which called the controller address and owner of the lock.
    function transferLocks(
        uint256 _id,
        address _receiverAddress,
        address _caller
    ) external virtual noReentrant {
        require(msg.sender == masterController, "Not Authorized!");
        require(block.timestamp < lockedToken[_id].unlockTime);
        require(
            _caller == lockedToken[_id].withdrawalAddress,
            "Not the lock owner"
        );
        lockedToken[_id].withdrawalAddress = _receiverAddress;

        lockedTokenBalance[lockedToken[_id].tokenAddress][_caller] =
            lockedTokenBalance[lockedToken[_id].tokenAddress][_caller] -
            lockedToken[_id].tokenAmount;

        lockedTokenBalance[lockedToken[_id].tokenAddress][_receiverAddress] =
            lockedTokenBalance[lockedToken[_id].tokenAddress][
                _receiverAddress
            ] +
            lockedToken[_id].tokenAmount;

        emit TransferLock(
            _caller,
            lockedToken[_id].tokenAddress,
            _receiverAddress,
            lockedToken[_id].tokenAmount,
            lockedToken[_id].unlockTime
        );
    }

    /// @notice Using this function a user can unlock the locked tokens.
    /// @dev Unlocked tokens are sent to the user.
    /// @param _id lock ID to be unlocked.
    /// @param _caller Address which called the controller address to unlock tokens.
    function withdrawTokens(uint256 _id, address _caller)
        external
        virtual
        noReentrant
    {
        require(msg.sender == masterController, "Not Authorized!");
        require(
            block.timestamp >= lockedToken[_id].unlockTime,
            "No withdrawl before time"
        );
        require(
            _caller == lockedToken[_id].withdrawalAddress,
            "only authorized withdrawl"
        );
        require(!lockedToken[_id].withdrawn, "already withdrawn");

        _safeTransferERC20(
            lockedToken[_id].tokenAddress,
            address(this),
            _caller,
            lockedToken[_id].tokenAmount
        );

        lockedToken[_id].withdrawn = true;

        lockedTokenBalance[lockedToken[_id].tokenAddress][_caller] =
            lockedTokenBalance[lockedToken[_id].tokenAddress][_caller] -
            lockedToken[_id].tokenAmount;

        emit Withdraw(
            _caller,
            lockedToken[_id].tokenAmount,
            lockedToken[_id].tokenAddress,
            lockedToken[_id].unlockTime
        );
    }
}
