const hre = require("hardhat");

async function main() {
  const VotingSystem = await hre.ethers.getContractFactory("VotingSystem"); // compiles our solidity program and creates artificates
  //which contains necessary files to work with contract  (ethers is preincluded with hardhat)

  const voteSystem = await VotingSystem.deploy();

  await voteSystem.deployed();

  console.log("voteSystem deployed to:", voteSystem.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
