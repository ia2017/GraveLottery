const { expect } = require("chai");
const { ethers } = require("hardhat");
const { hrtime } = require("process");

describe("Lottery contract", function () {

  let LotteryToken;
  let lotteryToken;
  let Token;
  let token;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    LotteryToken = await hre.ethers.getContractFactory("LotteryToken");
    Token = await hre.ethers.getContractFactory("GraveTestToken");

    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens once its transaction has been
    // mined.
    lotteryToken = await LotteryToken.deploy();
    token = await Token.deploy();
  });

  // You can nest describe calls to create subsections.
  describe("Deployment", function () {
    // `it` is another Mocha function. This is the one you use to define your
    // tests. It receives the test name, and a callback function.

    // If the callback function is async, Mocha will `await` it.
    it("Should set the right owner", async function () {
      // Expect receives a value, and wraps it in an Assertion object. These
      // objects have a lot of utility methods to assert values.

      // This test expects the owner variable stored in the contract to be equal
      // to our Signer's owner.
      expect(await lotteryToken.owner()).to.equal(owner.address);
      //expect(await token.owner()).to.equal(owner.address);

    });
  });

  describe("Entering lottery", function () {
    it("Should enter lottery and sending tokens", async function () {
      // Transfer 50 tokens from owner to addr1
      const amount = 1;
      const tokenAddress_test = token.address;

      const lottery = await lotteryToken.joinLottery(tokenAddress_test, amount);
      const balance = await lotteryToken.tokenBalance();
      expect(balance).to.equal(amount);

    });

    it("Should burn and send correct prize amount", async function () {
      // Transfer 50 tokens from owner to addr1
      const amount = 1;
      const tokenAddress_test = '0x1C20304753167E0fabe0aC3Aad3e2f18bDa5A3BD';
      const lottery = await lotteryContract.joinLottery(tokenAddress_test, amount);
      const balance = await lotteryContract.tokenBalance();
      expect(balance).to.equal(0);
      expect(balance).to.equal(amount);

    });

  });




});
