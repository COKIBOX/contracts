// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract DIDUpgradeable is OwnableUpgradeable {
    function initialize() public initializer {
        __Ownable_init();
    }

    address public signer1;
    address public signer2;

    mapping(address => bytes16) names;
    mapping(bytes16 => address) addresses;
    mapping(address => bytes) avatars;
    mapping(address => uint256) genders;
    mapping(address => address) inviters;


    event SetInfo(uint256 gender, bytes avatar);
    event Withdrawn(
        address indexed account,
        address indexed token,
        uint256 amount
    );

    event SetDid(address addr, bytes16 name);
    event BindInviter(address account, address inviter);

    receive() external payable {}

    function withdraw(address payable account, uint256 amount)
        external
        onlyOwner
    {
        uint256 balance = address(this).balance;
        require(amount <= balance, "Insufficient balance");

        (bool success, ) = account.call{value: amount}("");
        require(success, "Transfer failed!");

        emit Withdrawn(account, address(0), amount);
    }

    function setDid(
        address addr,
        bytes16 name,
        bytes memory signature
    ) public {
        require(addresses[name] == address(0), "name exist");

        bytes32 hash1 = keccak256(
            abi.encode("did", address(this), msg.sender, name)
        );

        bytes32 hash2 = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", hash1)
        );

        address signer = recover(hash2, signature);

        require(signer == signer1 || signer == signer2, "invalid signer");

        names[addr] = name;
        addresses[name] = addr;
    }

    function bindInviter(address inviter) external{
        address account = msg.sender;
        require(inviters[account] == address(0), 'Has binded');
        inviters[account] = inviter;
        emit BindInviter(account, inviter);
    }

    function getInviter(address account) public view returns (address){
        return inviters[account];
    }

    function getName(address addr) public view returns (bytes16) {
        return names[addr];
    }

    function getAddress(bytes16 name) public view returns (address) {
        return addresses[name];
    }

    function getInfo(address account) external view returns (bytes16, uint256, bytes memory) {
        
        return (names[account],  genders[account], avatars[account]);
    }

    function getAvatar(address account) external view returns (bytes memory){
        
        return avatars[account];
    }    

    function setInfo(uint256 gender, bytes memory avatar) external {
        
        if(gender > 0){
            genders[_msgSender()] = gender;
        }
        if(avatar.length > 0){
            avatars[_msgSender()] = avatar;
        }

        emit SetInfo(gender, avatar);
    }

    function setDev1(address _signer) public onlyOwner {
        signer1 = _signer;
    }

    function setDev2(address _signer) public onlyOwner {
        signer2 = _signer;
    }

    /**
     * @dev Returns the address that signed a hashed message (`hash`) with
     * `signature`. This address can then be used for verification purposes.
     *
     * The `ecrecover` EVM opcode allows for malleable (non-unique) signatures:
     * this function rejects them by requiring the `s` value to be in the lower
     * half order, and the `v` value to be either 27 or 28.
     *
     * IMPORTANT: `hash` _must_ be the result of a hash operation for the
     * verification to be secure: it is possible to craft signatures that
     * recover to arbitrary addresses for non-hashed data. A safe way to ensure
     * this is by receiving a hash of the original message (which may otherwise
     * be too long), and then calling {toEthSignedMessageHash} on it.
     */
    function recover(bytes32 hash, bytes memory signature)
        internal
        pure
        returns (address)
    {
        // Check the signature length
        if (signature.length != 65) {
            revert("ECDSA: invalid signature length");
        }

        // Divide the signature in r, s and v variables
        bytes32 r;
        bytes32 s;
        uint8 v;

        // ecrecover takes the signature parameters, and the only way to get them
        // currently is to use assembly.
        // solhint-disable-next-line no-inline-assembly
        assembly {
            r := mload(add(signature, 0x20))
            s := mload(add(signature, 0x40))
            v := byte(0, mload(add(signature, 0x60)))
        }

        return recover(hash, v, r, s);
    }

    /**
     * @dev Overload of {ECDSA-recover-bytes32-bytes-} that receives the `v`,
     * `r` and `s` signature fields separately.
     */
    function recover(
        bytes32 hash,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) internal pure returns (address) {
        // EIP-2 still allows signature malleability for ecrecover(). Remove this possibility and make the signature
        // unique. Appendix F in the Ethereum Yellow paper (https://ethereum.github.io/yellowpaper/paper.pdf), defines
        // the valid range for s in (281): 0 < s < secp256k1n ÷ 2 + 1, and for v in (282): v ∈ {27, 28}. Most
        // signatures from current libraries generate a unique signature with an s-value in the lower half order.
        //
        // If your library generates malleable signatures, such as s-values in the upper range, calculate a new s-value
        // with 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141 - s1 and flip v from 27 to 28 or
        // vice versa. If your library also generates signatures with 0/1 for v instead 27/28, add 27 to v to accept
        // these malleable signatures as well.
        require(
            uint256(s) <=
                0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0,
            "ECDSA: invalid signature 's' value"
        );
        require(v == 27 || v == 28, "ECDSA: invalid signature 'v' value");

        // If the signature is valid (and not malleable), return the signer address
        address signer = ecrecover(hash, v, r, s);
        require(signer != address(0), "ECDSA: invalid signature");

        return signer;
    }
}
