import { IncrementalMerkleTree } from "@zk-kit/incremental-merkle-tree"
import { poseidon } from "circomlibjs"
import identityCommitments from "../public/identityCommitments.json"
import { ethers } from "hardhat";

async function main() {
    const VerifierContract = await ethers.getContractFactory("Verifier")
    const verifier = await VerifierContract.deploy()

    await verifier.deployed()

    console.log(`Verifier contract has been deployed to: ${verifier.address}`)

    const GreetersContract = await ethers.getContractFactory("Greeters")

    const tree = new IncrementalMerkleTree(poseidon, 20, BigInt(0), 2)

    for (const identityCommitment of identityCommitments) {
        tree.insert(identityCommitment)
    }

    const greeters = await GreetersContract.deploy(tree.root, verifier.address)

    await greeters.deployed()

    console.log(`Greeters contract has been deployed to: ${greeters.address}`)

    return greeters
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
