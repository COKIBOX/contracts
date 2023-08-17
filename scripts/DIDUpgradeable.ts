import { ethers, upgrades, run } from "hardhat";
import { TEST_DID } from "./config";
// npx hardhat run --network opBNBTestnet scripts/DIDUpgradeable.ts 
async function main() {
    // 1.deploy
    // const DIDUpgradeable = await ethers.getContractFactory("DIDUpgradeable");
    // const df = await upgrades.deployProxy(DIDUpgradeable, [], { initializer: "initialize" });
    // await df.deployed();
    // console.log("DIDUpgradeable proxy deployed to:", df.address);
    // run("verify:verify", { address: df.address, constructorArguments: [] });

    // 2. dev upgrade
    // const didAddress = TEST_DID;
    // const DIDUpgradeable = await ethers.getContractFactory("DIDUpgradeable");
    // const did = await upgrades.upgradeProxy(didAddress, DIDUpgradeable);
    // await did.deployed();
    // console.log("DIDUpgradeable deployed to:", did.address);

    // 3. set dev1
    const agentAddress = "0xE3Bd3C1C841D2D708fCAc75eD38d6B322A96ab3b";

    const didContract = await ethers.getContractAt("DIDUpgradeable", TEST_DID);
    await didContract.setDev1(agentAddress);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

// DIDUpgradeable proxy deployed to: 0x6f030Ee4213934cB3c44eFEce87137b059D5C674
// Verifying implementation: 0xc0EE1F1573941bE0D553F01A007B22e36D4D178e