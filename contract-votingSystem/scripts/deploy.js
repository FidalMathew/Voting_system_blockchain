
async function main() {
    const VotingSystem = await hre.ethers.getContractFactory("VotingSystem");
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
