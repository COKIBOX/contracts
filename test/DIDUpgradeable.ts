import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

// npx hardhat test test/DIDUpgradeable.ts
describe("DID", function () {
    async function deployDIDFixture() {

        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await ethers.getSigners();

        const DIDUpgradeable = await ethers.getContractFactory("DIDUpgradeable");
        const df = await upgrades.deployProxy(DIDUpgradeable, [], { initializer: "initialize" });
        const did = await df.deployed();

        return { did, owner, otherAccount };
    }

    describe("Deployment", function () {

        it("Should set the right owner", async function () {
            const { did, owner } = await loadFixture(deployDIDFixture);

            expect(await did.owner()).to.equal(owner.address);
        });

    });

    describe("Set", function () {


        it("Should set the name", async function () {
            const { did, owner } = await loadFixture(deployDIDFixture);
            await did.setDev1(owner.address);
            const testName = ethers.utils.hexZeroPad(ethers.utils.toUtf8Bytes("hardyh@rdyhardy1"), 16);
            const testName2 = ethers.utils.hexZeroPad(ethers.utils.toUtf8Bytes("hello"), 16);
            // signer1
            let hash1 = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(
                ["string", "address", "address", "bytes16"],
                ["did", did.address, owner.address, testName]
            ));
            const messageBytes = ethers.utils.arrayify(hash1);

            const signature = await owner.signMessage(messageBytes);

            // signer2
            let hash2 = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(
                ["string", "address", "address", "bytes16"],
                ["did", did.address, owner.address, testName2]
            ));
            const messageBytes2 = ethers.utils.arrayify(hash2);

            const signature2 = await owner.signMessage(messageBytes2);

            await did.setDid(owner.address, testName, signature);
            await did.setDid(owner.address, testName2, signature2);
            const name = await did.getName(owner.address);
            console.log("name: %s", ethers.utils.toUtf8String(name));
            expect(name).to.equal(testName2);
        });

        it("set gender and avatar", async function () {
            const { did, owner } = await loadFixture(deployDIDFixture);
            const testAvatar = ethers.utils.toUtf8Bytes("png");

            await did.setInfo(1, testAvatar);

            const info = await did.getInfo(owner.address);

            console.log("info %o", info);
        });

    });


});
