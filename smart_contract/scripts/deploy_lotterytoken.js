const main = async () => {
 
  const LotteryToken = await hre.ethers.getContractFactory("LotteryToken");
  const lotterytoken = await LotteryToken.deploy();

  await lotterytoken.deployed();

  console.log("Lottery Token deployed to:", lotterytoken.address);
}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

runMain();
