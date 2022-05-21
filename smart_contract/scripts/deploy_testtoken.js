const main = async () => {
 
  const TestToken = await hre.ethers.getContractFactory("SomeCoin");
  const testtoken = await TestToken.deploy();

  await testtoken.deployed();

  console.log("Test Token deployed to:", testtoken.address);
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
