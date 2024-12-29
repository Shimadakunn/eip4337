// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "account-abstraction/core/BaseAccount.sol";
import "account-abstraction/interfaces/IEntryPoint.sol";
import "account-abstraction/core/Helpers.sol";
import "openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract Account is BaseAccount {
    using ECDSA for bytes32;
    using EnumerableSet for EnumerableSet.AddressSet;

    // Storage for owners
    EnumerableSet.AddressSet private _owners;
    uint256 public OWNERS_REQUIRED; // Number of owners required for operations

    // Session keys
    struct SessionKey {
        address key;
        uint256 expires;
        bytes4[] allowedFunctions;
    }
    mapping(bytes32 => SessionKey) public sessionKeys;

    // Social recovery
    mapping(address => bool) public guardians;
    uint256 public GUARDIANS_REQUIRED;
    uint256 public recoveryRequestTimestamp;
    address public proposedNewOwner;
    mapping(address => bool) public guardianApprovals;

    // Constants
    uint256 private constant RECOVERY_DELAY = 3 days;

    IEntryPoint private immutable _entryPoint;

    constructor(
        IEntryPoint anEntryPoint,
        address[] memory initialOwners,
        uint256 ownersRequired,
        address[] memory initialGuardians,
        uint256 guardiansRequired
    ) {
        _entryPoint = anEntryPoint;
        require(initialOwners.length >= ownersRequired, "Not enough initial owners");
        require(initialGuardians.length >= guardiansRequired, "Not enough initial guardians");
        
        for (uint256 i = 0; i < initialOwners.length; i++) {
            _owners.add(initialOwners[i]);
        }
        OWNERS_REQUIRED = ownersRequired;

        for (uint256 i = 0; i < initialGuardians.length; i++) {
            guardians[initialGuardians[i]] = true;
        }
        GUARDIANS_REQUIRED = guardiansRequired;
    }

    function initialize(bytes32[2] memory publicKey) external {
        require(address(_entryPoint) == address(0), "Already initialized");
        
        // Initialize with the first owner being derived from the public key
        address owner = address(uint160(uint256(keccak256(abi.encodePacked(publicKey)))));
        _owners.add(owner);
        OWNERS_REQUIRED = 1;
        
        // Set self as guardian initially
        guardians[address(this)] = true;
        GUARDIANS_REQUIRED = 1;
    }

    // Required override
    function entryPoint() public view virtual override returns (IEntryPoint) {
        return _entryPoint;
    }

    // Validate user operation
    function _validateSignature(
        PackedUserOperation calldata userOp,
        bytes32 userOpHash
    ) internal virtual override returns (uint256 validationData) {
        bytes32 hash = userOpHash;
        
        // Check session keys first
        if (isValidSessionKeySignature(userOp, hash)) {
            return 0;
        }

        // Check owner signatures
        if (!isValidOwnerSignature(hash, userOp.signature)) {
            return SIG_VALIDATION_FAILED;
        }
        return 0;
    }

    // Session key validation
    function isValidSessionKeySignature(
        PackedUserOperation calldata userOp,
        bytes32 hash
    ) internal view returns (bool) {
        // Extract session key data from signature if present
        if (userOp.signature.length < 65) return false;
        
        address recoveredAddr = hash.recover(userOp.signature);
        bytes32 sessionKeyHash = keccak256(abi.encodePacked(recoveredAddr));
        SessionKey storage sessionKey = sessionKeys[sessionKeyHash];
        
        if (sessionKey.expires < block.timestamp) return false;
        
        // Check if function is allowed for this session key
        bytes4 functionSelector = bytes4(userOp.callData[:4]);
        for (uint256 i = 0; i < sessionKey.allowedFunctions.length; i++) {
            if (sessionKey.allowedFunctions[i] == functionSelector) {
                return true;
            }
        }
        return false;
    }

    // Owner signature validation
    function isValidOwnerSignature(
        bytes32 hash,
        bytes memory signature
    ) internal view returns (bool) {
        address recoveredAddr = hash.recover(signature);
        return _owners.contains(recoveredAddr);
    }

    // Add session key
    function addSessionKey(
        address key,
        uint256 duration,
        bytes4[] calldata allowedFunctions
    ) external onlyOwner {
        bytes32 sessionKeyHash = keccak256(abi.encodePacked(key));
        sessionKeys[sessionKeyHash] = SessionKey({
            key: key,
            expires: block.timestamp + duration,
            allowedFunctions: allowedFunctions
        });
    }

    // Batch transactions
    function executeBatch(
        address[] calldata targets,
        uint256[] calldata values,
        bytes[] calldata callData
    ) external onlyOwner {
        require(
            targets.length == values.length &&
            values.length == callData.length,
            "Arrays length mismatch"
        );

        for (uint256 i = 0; i < targets.length; i++) {
            (bool success, ) = targets[i].call{value: values[i]}(callData[i]);
            require(success, "Transaction failed");
        }
    }

    // Social recovery functions
    function initiateRecovery(address newOwner) external {
        require(guardians[msg.sender], "Not a guardian");
        require(proposedNewOwner == address(0), "Recovery already in progress");
        
        proposedNewOwner = newOwner;
        recoveryRequestTimestamp = block.timestamp;
        guardianApprovals[msg.sender] = true;
    }

    function approveRecovery() external {
        require(guardians[msg.sender], "Not a guardian");
        require(proposedNewOwner != address(0), "No recovery in progress");
        require(!guardianApprovals[msg.sender], "Already approved");

        guardianApprovals[msg.sender] = true;
    }

    function executeRecovery() external {
        require(proposedNewOwner != address(0), "No recovery in progress");
        require(
            block.timestamp >= recoveryRequestTimestamp + RECOVERY_DELAY,
            "Recovery delay not passed"
        );

        uint256 approvals = 0;
        for (address guardian; guardians[guardian];) {
            if (guardianApprovals[guardian]) approvals++;
        }

        require(approvals >= GUARDIANS_REQUIRED, "Not enough guardian approvals");

        // Reset owners and add new owner
        while (_owners.length() > 0) {
            _owners.remove(_owners.at(0));
        }
        _owners.add(proposedNewOwner);

        // Reset recovery state
        proposedNewOwner = address(0);
        recoveryRequestTimestamp = 0;
    }

    // Modifiers
    modifier onlyOwner() {
        require(_owners.contains(msg.sender), "Not an owner");
        _;
    }

    // Receive function
    receive() external payable {}
}
