// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BOKBI Token
 * @dev $BOKBI - The tribute token for PALJA Oracle
 * "Pay the Tribute, Get the Alpha"
 * 
 * Total Supply: 888,888,888 (8 is lucky in Eastern culture)
 */
contract BOKBI is ERC20, ERC20Burnable, Ownable {
    uint256 public constant MAX_SUPPLY = 888_888_888 * 10**18;
    
    // Treasury address for protocol revenue
    address public treasury;
    
    // Staking contract address
    address public stakingContract;
    
    // Events
    event TreasuryUpdated(address indexed oldTreasury, address indexed newTreasury);
    event StakingContractUpdated(address indexed oldStaking, address indexed newStaking);
    event KarmaBurn(address indexed burner, uint256 amount, string reason);
    
    constructor(
        address _treasury,
        address _initialHolder
    ) ERC20("BOKBI", "BOKBI") Ownable(msg.sender) {
        require(_treasury != address(0), "Invalid treasury");
        require(_initialHolder != address(0), "Invalid initial holder");
        
        treasury = _treasury;
        
        // Mint total supply to initial holder for distribution
        _mint(_initialHolder, MAX_SUPPLY);
    }
    
    /**
     * @dev Burn tokens for Karma cleansing
     * @param amount Amount to burn
     * @param reason Reason for burning (stored in event)
     */
    function karmaBurn(uint256 amount, string calldata reason) external {
        _burn(msg.sender, amount);
        emit KarmaBurn(msg.sender, amount, reason);
    }
    
    /**
     * @dev Update treasury address
     */
    function setTreasury(address _treasury) external onlyOwner {
        require(_treasury != address(0), "Invalid treasury");
        address oldTreasury = treasury;
        treasury = _treasury;
        emit TreasuryUpdated(oldTreasury, _treasury);
    }
    
    /**
     * @dev Update staking contract address
     */
    function setStakingContract(address _stakingContract) external onlyOwner {
        address oldStaking = stakingContract;
        stakingContract = _stakingContract;
        emit StakingContractUpdated(oldStaking, _stakingContract);
    }
}
