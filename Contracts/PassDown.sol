// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import Ownable from OpenZeppelin Contracts v4.x
import "@openzeppelin/contracts/access/Ownable.sol";

// ERC20 Interface with transferFrom
interface IERC20 {
    function transfer(
        address recipient,
        uint256 amount
    ) external returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    function balanceOf(address account) external view returns (uint256);

    function allowance(
        address owner,
        address spender
    ) external view returns (uint256);
}

contract CryptoWill is Ownable {
    // Structs
    struct Beneficiary {
        address beneficiaryAddress;
        uint256 percentage; // Basis points (10000 = 100%)
    }

    struct TokenDetails {
        IERC20 tokenAddress;
        Beneficiary[] beneficiaries;
    }

    struct Will {
        address user;
        TokenDetails[] tokens; // Array of tokens with their specific beneficiaries
        address[] trustedContacts;
        uint256 maxInactivity; // Seconds
        bool isActive;
        bool isCanceled;
        uint256 lastActivity;
    }

    // State Variables
    uint256 public nextWillId;
    mapping(uint256 => Will) public wills;
    mapping(uint256 => mapping(address => bool)) public trustedCertifications;
    mapping(address => uint256[]) private userWills; // Mapping from user to their wills

    address public oracleAddress;
    uint256 public requiredCertifications = 2; // Example: 2 trusted contacts

    // Events
    event WillCreated(uint256 indexed willId, address indexed user);
    event WillActivated(uint256 indexed willId, string activationMethod);
    event WillCanceled(uint256 indexed willId, address indexed user);
    event TokenDistributed(
        uint256 indexed willId,
        address indexed beneficiary,
        address token,
        uint256 amount
    );
    event InactivityReset(uint256 indexed willId, uint256 timestamp);
    event TrustedContactsCertified(uint256 indexed willId, address certifiedBy);

    // Modifiers
    modifier onlyUser(uint256 willId) {
        require(wills[willId].user == msg.sender, "Not authorized");
        _;
    }

    modifier notActive(uint256 willId) {
        require(!wills[willId].isActive, "Will is already active");
        _;
    }

    modifier notCanceled(uint256 willId) {
        require(!wills[willId].isCanceled, "Will has been canceled");
        _;
    }

    // Constructor
    constructor(address _owner) Ownable(_owner) {}

    // Functions to set oracle address and required certifications (onlyOwner)
    function setOracleAddress(address _newOracle) external onlyOwner {
        require(_newOracle != address(0), "Invalid oracle address");
        oracleAddress = _newOracle;
    }

    function setRequiredCertifications(uint256 _required) external onlyOwner {
        require(_required > 0, "At least one certification required");
        requiredCertifications = _required;
    }

    // Function to create a new will
    function createWill(
        TokenDetails[] memory _tokens,
        address[] memory _trustedContacts,
        uint256 _maxInactivity // in seconds
    ) public returns (uint256) {
        require(_tokens.length > 0, "At least one token required");
        require(
            _trustedContacts.length >= requiredCertifications,
            "Not enough trusted contacts"
        );
        require(
            _maxInactivity > 0,
            "Inactivity period must be greater than zero"
        );

        uint256 willId = nextWillId++;
        Will storage newWill = wills[willId];
        newWill.user = msg.sender;
        newWill.maxInactivity = _maxInactivity;
        newWill.lastActivity = block.timestamp;

        // Add tokens with their specific beneficiaries
        for (uint i = 0; i < _tokens.length; i++) {
            require(
                address(_tokens[i].tokenAddress) != address(0),
                "Invalid token address"
            );
            require(
                _tokens[i].beneficiaries.length > 0,
                "At least one beneficiary required per token"
            );

            TokenDetails storage tokenDetail = newWill.tokens.push();
            tokenDetail.tokenAddress = _tokens[i].tokenAddress;

            uint256 totalPercentage = 0;
            for (uint j = 0; j < _tokens[i].beneficiaries.length; j++) {
                address beneficiaryAddr = _tokens[i]
                    .beneficiaries[j]
                    .beneficiaryAddress;
                uint256 beneficiaryPerc = _tokens[i]
                    .beneficiaries[j]
                    .percentage;
                require(
                    beneficiaryAddr != address(0),
                    "Invalid beneficiary address"
                );
                require(
                    beneficiaryPerc > 0,
                    "Beneficiary percentage must be greater than zero"
                );
                tokenDetail.beneficiaries.push(
                    Beneficiary({
                        beneficiaryAddress: beneficiaryAddr,
                        percentage: beneficiaryPerc
                    })
                );
                totalPercentage += beneficiaryPerc;
            }
            require(
                totalPercentage == 10000,
                "Total percentage must be 10000 basis points for each token"
            );
        }

        // Add trusted contacts
        for (uint i = 0; i < _trustedContacts.length; i++) {
            require(
                _trustedContacts[i] != address(0),
                "Invalid trusted contact address"
            );
            newWill.trustedContacts.push(_trustedContacts[i]);
        }

        // Track the will under the user's address
        userWills[msg.sender].push(willId);

        emit WillCreated(willId, msg.sender);
        return willId;
    }

    // Function to update user activity, resetting the inactivity timer
    function updateActivity(
        uint256 willId
    ) public onlyUser(willId) notActive(willId) notCanceled(willId) {
        wills[willId].lastActivity = block.timestamp;
        emit InactivityReset(willId, block.timestamp);
    }

    // Activation via inactivity
    function activateWillInactivity(
        uint256 willId
    ) public notActive(willId) notCanceled(willId) {
        Will storage userWill = wills[willId];
        require(
            block.timestamp >= userWill.lastActivity + userWill.maxInactivity,
            "Inactivity period not yet reached"
        );

        _activateWill(willId, "Inactivity");
    }

    // Activation via trusted contacts
    function certifyDeath(
        uint256 willId
    ) public notActive(willId) notCanceled(willId) {
        Will storage userWill = wills[willId];
        require(isTrustedContact(willId, msg.sender), "Not a trusted contact");
        require(
            !trustedCertifications[willId][msg.sender],
            "Already certified"
        );

        trustedCertifications[willId][msg.sender] = true;
        emit TrustedContactsCertified(willId, msg.sender);

        uint256 count = 0;
        for (uint i = 0; i < userWill.trustedContacts.length; i++) {
            if (trustedCertifications[willId][userWill.trustedContacts[i]]) {
                count++;
            }
        }

        if (count >= requiredCertifications) {
            _activateWill(willId, "Trusted Contacts");
        }
    }

    // Activation via oracle
    function activateWillOracle(
        uint256 willId
    ) public notActive(willId) notCanceled(willId) {
        require(msg.sender == oracleAddress, "Not authorized oracle");

        _activateWill(willId, "Oracle");
    }

    // Internal function to handle activation and token distribution
    function _activateWill(
        uint256 willId,
        string memory activationMethod
    ) internal {
        Will storage userWill = wills[willId];
        require(!userWill.isActive, "Will already active");
        userWill.isActive = true;

        for (uint i = 0; i < userWill.tokens.length; i++) {
            IERC20 token = userWill.tokens[i].tokenAddress;
            uint256 userAllowance = token.allowance(
                userWill.user,
                address(this)
            );
            uint256 userBalance = token.balanceOf(userWill.user);
            uint256 totalAmount = 0;

            // Calculate total amount to transfer for this token
            for (uint j = 0; j < userWill.tokens[i].beneficiaries.length; j++) {
                Beneficiary memory beneficiary = userWill
                    .tokens[i]
                    .beneficiaries[j];
                totalAmount += (userBalance * beneficiary.percentage) / 10000;
            }

            require(
                userAllowance >= totalAmount,
                "Insufficient token allowance for distribution"
            );
            require(
                userBalance >= totalAmount,
                "Insufficient token balance for distribution"
            );

            // Transfer tokens from user to contract
            require(
                token.transferFrom(userWill.user, address(this), totalAmount),
                "TransferFrom failed"
            );

            // Distribute tokens to beneficiaries
            for (uint j = 0; j < userWill.tokens[i].beneficiaries.length; j++) {
                Beneficiary memory beneficiary = userWill
                    .tokens[i]
                    .beneficiaries[j];
                uint256 amount = (userBalance * beneficiary.percentage) / 10000;
                require(
                    token.transfer(beneficiary.beneficiaryAddress, amount),
                    "Transfer to beneficiary failed"
                );
                emit TokenDistributed(
                    willId,
                    beneficiary.beneficiaryAddress,
                    address(token),
                    amount
                );
            }
        }

        emit WillActivated(willId, activationMethod);
    }

    // Function to cancel a will
    function cancelWill(
        uint256 willId
    ) external onlyUser(willId) notActive(willId) notCanceled(willId) {
        wills[willId].isCanceled = true;
        emit WillCanceled(willId, msg.sender);
    }

    // Helper function to check if an address is a trusted contact
    function isTrustedContact(
        uint256 willId,
        address contact
    ) internal view returns (bool) {
        Will storage userWill = wills[willId];
        for (uint i = 0; i < userWill.trustedContacts.length; i++) {
            if (userWill.trustedContacts[i] == contact) {
                return true;
            }
        }
        return false;
    }

    // Getter Function: Get all wills associated with a user
    /**
     * @dev Returns all will IDs associated with the given user address.
     * @param user The address of the user.
     * @return An array of will IDs.
     */
    function getUserWills(
        address user
    ) external view returns (uint256[] memory) {
        return userWills[user];
    }

    // Getter Function: Get detailed information about a specific will
    /**
     * @dev Returns detailed information about a specific will.
     * @param willId The ID of the will.
     * @return user The owner of the will.
     * @return tokenAddresses The array of ERC20 token addresses in the will.
     * @return beneficiariesNested The nested array of beneficiaries for each token.
     * @return beneficiariesPercentages The nested array of beneficiary percentages for each token.
     * @return trustedContacts The array of trusted contact addresses.
     * @return maxInactivity The inactivity period set for the will.
     * @return isActive Whether the will is active.
     * @return isCanceled Whether the will has been canceled.
     * @return lastActivity The timestamp of the last activity.
     */
    function getWillDetails(
        uint256 willId
    )
        external
        view
        returns (
            address user,
            address[] memory tokenAddresses,
            address[][] memory beneficiariesNested,
            uint256[][] memory beneficiariesPercentages,
            address[] memory trustedContacts,
            uint256 maxInactivity,
            bool isActive,
            bool isCanceled,
            uint256 lastActivity
        )
    {
        Will storage will = wills[willId];
        require(will.user != address(0), "Will does not exist");

        // Prepare token addresses
        address[] memory tokens = new address[](will.tokens.length);
        for (uint i = 0; i < will.tokens.length; i++) {
            tokens[i] = address(will.tokens[i].tokenAddress);
        }

        // Prepare nested beneficiaries data
        address[][] memory beneficiaries = new address[][](will.tokens.length);
        uint256[][] memory percentages = new uint256[][](will.tokens.length);

        for (uint i = 0; i < will.tokens.length; i++) {
            uint256 numBeneficiaries = will.tokens[i].beneficiaries.length;
            beneficiaries[i] = new address[](numBeneficiaries);
            percentages[i] = new uint256[](numBeneficiaries);

            for (uint j = 0; j < numBeneficiaries; j++) {
                beneficiaries[i][j] = will
                    .tokens[i]
                    .beneficiaries[j]
                    .beneficiaryAddress;
                percentages[i][j] = will.tokens[i].beneficiaries[j].percentage;
            }
        }

        return (
            will.user,
            tokens,
            beneficiaries,
            percentages,
            will.trustedContacts,
            will.maxInactivity,
            will.isActive,
            will.isCanceled,
            will.lastActivity
        );
    }
}
