// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title KarmaRegistry
 * @dev On-chain Karma Score tracking for PALJA Oracle
 * "Your past trades are written in the blockchain. The Oracle sees all."
 *
 * Karma Score = Base PALJA Score + On-chain Modifier
 *
 * Grades:
 * 900+ (SSS): Enlightened - Free readings, special talisman access
 * 700-899 (S): Blessed - 20% discount
 * 500-699 (A): Favored - 10% discount
 * 300-499 (B): Neutral - Base price
 * 100-299 (C): Burdened - Warning messages
 * 0-99 (D): Cursed - "Cleanse required"
 */
contract KarmaRegistry is Ownable {
    // Karma score storage
    mapping(address => int256) public karmaScores;
    mapping(address => uint256) public lastUpdated;

    // Karma modifiers (can be updated by Oracle)
    mapping(address => bool) public authorizedOracles;

    // BOKBI token for cleansing
    IERC20 public bokbiToken;

    // Cleansing rates (in BOKBI tokens - 18 decimals)
    uint256 public constant MINOR_CLEANSE_AMOUNT = 1_000 * 10**18;    // +50 Karma
    uint256 public constant MAJOR_CLEANSE_AMOUNT = 5_000 * 10**18;    // +200 Karma
    uint256 public constant FULL_RESET_AMOUNT = 10_000 * 10**18;      // Full Reset + Rare Talisman eligibility

    uint256 public constant MINOR_CLEANSE_KARMA = 50;
    uint256 public constant MAJOR_CLEANSE_KARMA = 200;
    uint256 public constant BASE_KARMA = 500;  // Starting karma for new wallets

    // Events
    event KarmaUpdated(address indexed wallet, int256 oldKarma, int256 newKarma, string reason);
    event KarmaCleansed(address indexed wallet, uint256 bokbiBurned, uint256 karmaGained);
    event KarmaReset(address indexed wallet, uint256 bokbiBurned);
    event OracleAuthorized(address indexed oracle, bool status);

    // Karma grades
    enum KarmaGrade { CURSED, BURDENED, NEUTRAL, FAVORED, BLESSED, ENLIGHTENED }

    constructor(address _bokbiToken) Ownable(msg.sender) {
        bokbiToken = IERC20(_bokbiToken);
    }

    // ============ VIEW FUNCTIONS ============

    /**
     * @dev Get karma score for a wallet (returns BASE_KARMA if never set)
     */
    function getKarma(address wallet) public view returns (int256) {
        if (lastUpdated[wallet] == 0) {
            return int256(BASE_KARMA);
        }
        return karmaScores[wallet];
    }

    /**
     * @dev Get karma grade for a wallet
     */
    function getKarmaGrade(address wallet) public view returns (KarmaGrade, string memory) {
        int256 karma = getKarma(wallet);

        if (karma >= 900) return (KarmaGrade.ENLIGHTENED, "SSS - Enlightened");
        if (karma >= 700) return (KarmaGrade.BLESSED, "S - Blessed");
        if (karma >= 500) return (KarmaGrade.FAVORED, "A - Favored");
        if (karma >= 300) return (KarmaGrade.NEUTRAL, "B - Neutral");
        if (karma >= 100) return (KarmaGrade.BURDENED, "C - Burdened");
        return (KarmaGrade.CURSED, "D - Cursed");
    }

    /**
     * @dev Get discount percentage based on karma grade (in basis points)
     */
    function getDiscountBps(address wallet) public view returns (uint256) {
        (KarmaGrade grade, ) = getKarmaGrade(wallet);

        if (grade == KarmaGrade.ENLIGHTENED) return 10000; // 100% (free)
        if (grade == KarmaGrade.BLESSED) return 2000;      // 20%
        if (grade == KarmaGrade.FAVORED) return 1000;      // 10%
        return 0;
    }

    // ============ ORACLE FUNCTIONS ============

    /**
     * @dev Modify karma score (only authorized oracles)
     */
    function modifyKarma(
        address wallet,
        int256 modifier,
        string calldata reason
    ) external onlyAuthorized {
        int256 oldKarma = getKarma(wallet);
        int256 newKarma = oldKarma + modifier;

        // Clamp between 0 and 1000
        if (newKarma < 0) newKarma = 0;
        if (newKarma > 1000) newKarma = 1000;

        karmaScores[wallet] = newKarma;
        lastUpdated[wallet] = block.timestamp;

        emit KarmaUpdated(wallet, oldKarma, newKarma, reason);
    }

    /**
     * @dev Batch modify karma for multiple wallets
     */
    function batchModifyKarma(
        address[] calldata wallets,
        int256[] calldata modifiers,
        string calldata reason
    ) external onlyAuthorized {
        require(wallets.length == modifiers.length, "Length mismatch");

        for (uint i = 0; i < wallets.length; i++) {
            int256 oldKarma = getKarma(wallets[i]);
            int256 newKarma = oldKarma + modifiers[i];

            if (newKarma < 0) newKarma = 0;
            if (newKarma > 1000) newKarma = 1000;

            karmaScores[wallets[i]] = newKarma;
            lastUpdated[wallets[i]] = block.timestamp;

            emit KarmaUpdated(wallets[i], oldKarma, newKarma, reason);
        }
    }

    // ============ CLEANSING FUNCTIONS ============

    /**
     * @dev Minor cleanse - burn 1,000 BOKBI for +50 Karma
     */
    function minorCleanse() external {
        require(
            bokbiToken.transferFrom(msg.sender, address(0xdead), MINOR_CLEANSE_AMOUNT),
            "BOKBI transfer failed"
        );

        int256 oldKarma = getKarma(msg.sender);
        int256 newKarma = oldKarma + int256(MINOR_CLEANSE_KARMA);
        if (newKarma > 1000) newKarma = 1000;

        karmaScores[msg.sender] = newKarma;
        lastUpdated[msg.sender] = block.timestamp;

        emit KarmaCleansed(msg.sender, MINOR_CLEANSE_AMOUNT, MINOR_CLEANSE_KARMA);
        emit KarmaUpdated(msg.sender, oldKarma, newKarma, "Minor cleansing ritual");
    }

    /**
     * @dev Major cleanse - burn 5,000 BOKBI for +200 Karma
     */
    function majorCleanse() external {
        require(
            bokbiToken.transferFrom(msg.sender, address(0xdead), MAJOR_CLEANSE_AMOUNT),
            "BOKBI transfer failed"
        );

        int256 oldKarma = getKarma(msg.sender);
        int256 newKarma = oldKarma + int256(MAJOR_CLEANSE_KARMA);
        if (newKarma > 1000) newKarma = 1000;

        karmaScores[msg.sender] = newKarma;
        lastUpdated[msg.sender] = block.timestamp;

        emit KarmaCleansed(msg.sender, MAJOR_CLEANSE_AMOUNT, MAJOR_CLEANSE_KARMA);
        emit KarmaUpdated(msg.sender, oldKarma, newKarma, "Major cleansing ritual");
    }

    /**
     * @dev Full reset - burn 10,000 BOKBI for karma reset to 500 + rare talisman eligibility
     */
    function fullReset() external {
        require(
            bokbiToken.transferFrom(msg.sender, address(0xdead), FULL_RESET_AMOUNT),
            "BOKBI transfer failed"
        );

        int256 oldKarma = getKarma(msg.sender);
        karmaScores[msg.sender] = int256(BASE_KARMA);
        lastUpdated[msg.sender] = block.timestamp;

        emit KarmaReset(msg.sender, FULL_RESET_AMOUNT);
        emit KarmaUpdated(msg.sender, oldKarma, int256(BASE_KARMA), "Full karmic reset - soul cleansed");
    }

    // ============ ADMIN FUNCTIONS ============

    /**
     * @dev Authorize or revoke oracle address
     */
    function setOracle(address oracle, bool authorized) external onlyOwner {
        authorizedOracles[oracle] = authorized;
        emit OracleAuthorized(oracle, authorized);
    }

    /**
     * @dev Update BOKBI token address
     */
    function setBokbiToken(address _bokbiToken) external onlyOwner {
        bokbiToken = IERC20(_bokbiToken);
    }

    // ============ MODIFIERS ============

    modifier onlyAuthorized() {
        require(
            msg.sender == owner() || authorizedOracles[msg.sender],
            "Not authorized"
        );
        _;
    }
}
