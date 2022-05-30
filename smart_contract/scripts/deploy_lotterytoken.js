const main = async () => {
 
  const ticketPrice = 1;
  const players = 5;
  const tokenAddress = "0x1C20304753167E0fabe0aC3Aad3e2f18bDa5A3BD";
  const burnPercent = 20;
  const round = true;
  const LotteryToken = await hre.ethers.getContractFactory("LotteryToken");
  const lotterytoken = await LotteryToken.deploy(ticketPrice, players, tokenAddress, burnPercent, round);
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
