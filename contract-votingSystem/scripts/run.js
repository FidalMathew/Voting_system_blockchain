const hre = require("hardhat");

async function main() {
  const VotingSystem = await hre.ethers.getContractFactory("VotingSystem"); // compiles our solidity program and creates artificates
  //which contains necessary files to work with contract  (ethers is preincluded with hardhat)

  const voteSystem = await VotingSystem.deploy();

  await voteSystem.deployed();

  console.log("voteSystem deployed to:", voteSystem.address);
  // Call the function.
  let txn = await voteSystem.makeAnEpicNFT("ipfs://QmNQ878devvb3ZZUWWrTpbU4ZgPH1rArr12ChL7mRJg87X")
  // Wait for it to be mined.
  await txn.wait()
  console.log(txn);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
