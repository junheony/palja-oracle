// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title PALJATalisman
 * @dev On-chain Protection Spells - NFT Talismans
 * "Ancient wards for the modern degen"
 */
contract PALJATalisman is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    // Talisman types
    enum TalismanType {
        AntiRugpull,      // 러그풀 방지
        GasOptimizer,     // 가스비 절약
        GreenCandle,      // 양봉 소환
        WhaleProtection,  // 고래 보호
        AirdropMagnet,    // 에어드랍 자석
        FudShield,        // FUD 방패
        GenesisBlessing,  // 제네시스 축복 (Legendary)
        MultichainPass,   // 멀티체인 패스포트 (Legendary)
        FounderSeal       // 파운더의 인장 (Legendary)
    }
    
    // Talisman rarity
    enum Rarity {
        Common,
        Rare,
        Legendary
    }
    
    // Talisman data
    struct Talisman {
        TalismanType talismanType;
        Rarity rarity;
        uint256 mintedAt;
        uint256 expiresAt;      // 0 for never expires
        address originalOwner;
        string incantation;     // 부적 주문
    }
    
    // Storage
    mapping(uint256 => Talisman) public talismans;
    mapping(address => mapping(TalismanType => uint256)) public activeTalisman; // One active per type per user
    
    // Pricing (set by payment contract)
    address public paymentContract;
    
    // Expiration durations
    uint256 public commonDuration = 30 days;
    uint256 public rareDuration = 90 days;
    // Legendary never expires
    
    // Base URI for metadata
    string private _baseTokenURI;
    
    // Events
    event TalismanMinted(
        address indexed to,
        uint256 indexed tokenId,
        TalismanType talismanType,
        Rarity rarity
    );
    event TalismanActivated(address indexed owner, uint256 indexed tokenId);
    event TalismanExpired(uint256 indexed tokenId);
    
    constructor() ERC721("PALJA Talisman", "TALISMAN") Ownable(msg.sender) {}
    
    /**
     * @dev Mint a new Talisman
     */
    function mintTalisman(
        address to,
        TalismanType talismanType,
        string calldata incantation
    ) external returns (uint256) {
        require(
            msg.sender == owner() || msg.sender == paymentContract,
            "Not authorized"
        );
        
        Rarity rarity = _getRarity(talismanType);
        uint256 duration = _getDuration(rarity);
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(to, tokenId);
        
        talismans[tokenId] = Talisman({
            talismanType: talismanType,
            rarity: rarity,
            mintedAt: block.timestamp,
            expiresAt: duration > 0 ? block.timestamp + duration : 0,
            originalOwner: to,
            incantation: incantation
        });
        
        // Auto-activate if no active talisman of this type
        if (activeTalisman[to][talismanType] == 0) {
            activeTalisman[to][talismanType] = tokenId;
            emit TalismanActivated(to, tokenId);
        }
        
        emit TalismanMinted(to, tokenId, talismanType, rarity);
        
        return tokenId;
    }
    
    /**
     * @dev Check if a talisman is still active (not expired)
     */
    function isActive(uint256 tokenId) public view returns (bool) {
        Talisman memory t = talismans[tokenId];
        if (t.expiresAt == 0) return true; // Never expires
        return block.timestamp < t.expiresAt;
    }
    
    /**
     * @dev Check if user has active protection of a type
     */
    function hasProtection(address user, TalismanType talismanType) public view returns (bool) {
        uint256 tokenId = activeTalisman[user][talismanType];
        if (tokenId == 0) return false;
        if (ownerOf(tokenId) != user) return false;
        return isActive(tokenId);
    }
    
    /**
     * @dev Activate a talisman (set as active for its type)
     */
    function activate(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        require(isActive(tokenId), "Talisman expired");
        
        TalismanType t = talismans[tokenId].talismanType;
        activeTalisman[msg.sender][t] = tokenId;
        
        emit TalismanActivated(msg.sender, tokenId);
    }
    
    /**
     * @dev Get talisman details
     */
    function getTalisman(uint256 tokenId) external view returns (
        TalismanType talismanType,
        Rarity rarity,
        uint256 mintedAt,
        uint256 expiresAt,
        bool active,
        string memory incantation
    ) {
        Talisman memory t = talismans[tokenId];
        return (
            t.talismanType,
            t.rarity,
            t.mintedAt,
            t.expiresAt,
            isActive(tokenId),
            t.incantation
        );
    }
    
    /**
     * @dev Get rarity based on talisman type
     */
    function _getRarity(TalismanType t) internal pure returns (Rarity) {
        if (t == TalismanType.GenesisBlessing || 
            t == TalismanType.MultichainPass || 
            t == TalismanType.FounderSeal) {
            return Rarity.Legendary;
        }
        if (t == TalismanType.WhaleProtection || 
            t == TalismanType.AirdropMagnet || 
            t == TalismanType.FudShield) {
            return Rarity.Rare;
        }
        return Rarity.Common;
    }
    
    /**
     * @dev Get duration based on rarity
     */
    function _getDuration(Rarity r) internal view returns (uint256) {
        if (r == Rarity.Legendary) return 0; // Never expires
        if (r == Rarity.Rare) return rareDuration;
        return commonDuration;
    }
    
    // Admin functions
    
    function setPaymentContract(address _payment) external onlyOwner {
        paymentContract = _payment;
    }
    
    function setBaseURI(string calldata baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }
    
    function setDurations(uint256 _common, uint256 _rare) external onlyOwner {
        commonDuration = _common;
        rareDuration = _rare;
    }
    
    // Overrides
    
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
    
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
