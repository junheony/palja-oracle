// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title PALJAPayment
 * @dev Payment router for PALJA Oracle services
 * Accepts USDC or $BOKBI with discount
 */
contract PALJAPayment is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    
    // Token addresses
    IERC20 public immutable bokbi;
    IERC20 public immutable usdc;
    
    // Treasury address
    address public treasury;
    
    // Pricing (in USDC decimals - 6)
    uint256 public basicReadingPrice = 3 * 10**6;      // $3
    uint256 public fullReadingPrice = 10 * 10**6;      // $10
    uint256 public nftMintPrice = 15 * 10**6;          // $15

    // Talisman tier pricing (in USDC)
    uint256 public commonTalismanPrice = 5 * 10**6;    // $5 (0.001 ETH equivalent)
    uint256 public rareTalismanPrice = 20 * 10**6;     // $20 (0.01 ETH equivalent)
    uint256 public legendaryTalismanPrice = 100 * 10**6; // $100 (0.1 ETH equivalent)

    // Talisman BOKBI pricing (alternative payment)
    uint256 public commonTalismanBokbi = 100 * 10**18;    // 100 BOKBI
    uint256 public rareTalismanBokbi = 1_000 * 10**18;    // 1,000 BOKBI
    uint256 public legendaryTalismanBokbi = 10_000 * 10**18; // 10,000 BOKBI

    // Karma cleansing tiers
    uint256 public minorCleansePrice = 5 * 10**6;      // $5 (+50 Karma)
    uint256 public majorCleansePrice = 25 * 10**6;     // $25 (+200 Karma)
    uint256 public fullResetPrice = 50 * 10**6;        // $50 (Full Reset)

    // BOKBI discount (20% = 8000 basis points means pay 80%)
    uint256 public bokbiDiscountBps = 8000;
    
    // BOKBI burn rate (30% of BOKBI payments get burned)
    uint256 public bokbiBurnBps = 3000;
    
    // BOKBI price oracle (simplified - tokens per USDC)
    uint256 public bokbiPerUsdc = 100 * 10**18; // 100 BOKBI = 1 USDC
    
    // Service types
    enum ServiceType {
        BasicReading,
        FullReading,
        NFTMint,
        KarmaCleanse,
        Talisman
    }
    
    // Payment tracking
    mapping(address => uint256) public totalPaidUsdc;
    mapping(address => uint256) public totalPaidBokbi;
    mapping(address => uint256) public readingsCount;
    
    // Events
    event PaymentReceived(
        address indexed payer,
        ServiceType serviceType,
        address token,
        uint256 amount,
        uint256 burned
    );
    event PriceUpdated(ServiceType serviceType, uint256 newPrice);
    event BokbiRateUpdated(uint256 newRate);
    
    constructor(
        address _bokbi,
        address _usdc,
        address _treasury
    ) Ownable(msg.sender) {
        require(_bokbi != address(0), "Invalid BOKBI");
        require(_usdc != address(0), "Invalid USDC");
        require(_treasury != address(0), "Invalid treasury");
        
        bokbi = IERC20(_bokbi);
        usdc = IERC20(_usdc);
        treasury = _treasury;
    }
    
    /**
     * @dev Get price for a service in USDC
     */
    function getUsdcPrice(ServiceType serviceType) public view returns (uint256) {
        if (serviceType == ServiceType.BasicReading) return basicReadingPrice;
        if (serviceType == ServiceType.FullReading) return fullReadingPrice;
        if (serviceType == ServiceType.NFTMint) return nftMintPrice;
        if (serviceType == ServiceType.KarmaCleanse) return 5 * 10**6; // $5 base
        if (serviceType == ServiceType.Talisman) return 5 * 10**6; // $5 base
        return 0;
    }
    
    /**
     * @dev Get price for a service in BOKBI (with discount)
     */
    function getBokbiPrice(ServiceType serviceType) public view returns (uint256) {
        uint256 usdcPrice = getUsdcPrice(serviceType);
        // Apply discount and convert to BOKBI
        uint256 discountedUsdc = (usdcPrice * bokbiDiscountBps) / 10000;
        return (discountedUsdc * bokbiPerUsdc) / 10**6;
    }
    
    /**
     * @dev Pay with USDC
     */
    function payWithUsdc(ServiceType serviceType) external nonReentrant {
        uint256 price = getUsdcPrice(serviceType);
        require(price > 0, "Invalid service");
        
        usdc.safeTransferFrom(msg.sender, treasury, price);
        
        totalPaidUsdc[msg.sender] += price;
        if (serviceType == ServiceType.BasicReading || serviceType == ServiceType.FullReading) {
            readingsCount[msg.sender]++;
        }
        
        emit PaymentReceived(msg.sender, serviceType, address(usdc), price, 0);
    }
    
    /**
     * @dev Pay with BOKBI (includes burn mechanism)
     */
    function payWithBokbi(ServiceType serviceType) external nonReentrant {
        uint256 price = getBokbiPrice(serviceType);
        require(price > 0, "Invalid service");
        
        // Calculate burn amount
        uint256 burnAmount = (price * bokbiBurnBps) / 10000;
        uint256 treasuryAmount = price - burnAmount;
        
        // Transfer to treasury
        bokbi.safeTransferFrom(msg.sender, treasury, treasuryAmount);
        
        // Burn portion
        if (burnAmount > 0) {
            bokbi.safeTransferFrom(msg.sender, address(0xdead), burnAmount);
        }
        
        totalPaidBokbi[msg.sender] += price;
        if (serviceType == ServiceType.BasicReading || serviceType == ServiceType.FullReading) {
            readingsCount[msg.sender]++;
        }
        
        emit PaymentReceived(msg.sender, serviceType, address(bokbi), price, burnAmount);
    }
    
    /**
     * @dev Pay for Karma cleansing (variable amount)
     */
    function payKarmaCleanse(uint256 bokbiAmount) external nonReentrant {
        require(bokbiAmount >= 1000 * 10**18, "Minimum 1000 BOKBI");
        
        // 50% gets burned for karma cleansing
        uint256 burnAmount = bokbiAmount / 2;
        uint256 treasuryAmount = bokbiAmount - burnAmount;
        
        bokbi.safeTransferFrom(msg.sender, treasury, treasuryAmount);
        bokbi.safeTransferFrom(msg.sender, address(0xdead), burnAmount);
        
        totalPaidBokbi[msg.sender] += bokbiAmount;
        
        emit PaymentReceived(msg.sender, ServiceType.KarmaCleanse, address(bokbi), bokbiAmount, burnAmount);
    }
    
    // Admin functions
    
    function setBasicReadingPrice(uint256 _price) external onlyOwner {
        basicReadingPrice = _price;
        emit PriceUpdated(ServiceType.BasicReading, _price);
    }
    
    function setFullReadingPrice(uint256 _price) external onlyOwner {
        fullReadingPrice = _price;
        emit PriceUpdated(ServiceType.FullReading, _price);
    }
    
    function setNftMintPrice(uint256 _price) external onlyOwner {
        nftMintPrice = _price;
        emit PriceUpdated(ServiceType.NFTMint, _price);
    }
    
    function setBokbiPerUsdc(uint256 _rate) external onlyOwner {
        bokbiPerUsdc = _rate;
        emit BokbiRateUpdated(_rate);
    }
    
    function setTreasury(address _treasury) external onlyOwner {
        require(_treasury != address(0), "Invalid treasury");
        treasury = _treasury;
    }
    
    function setBokbiDiscountBps(uint256 _bps) external onlyOwner {
        require(_bps <= 10000, "Invalid bps");
        bokbiDiscountBps = _bps;
    }
    
    function setBokbiBurnBps(uint256 _bps) external onlyOwner {
        require(_bps <= 10000, "Invalid bps");
        bokbiBurnBps = _bps;
    }
}
