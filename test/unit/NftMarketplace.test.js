const { assert, expect } = require("chai")
const { network, deployments, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Nft Marketplace Tests", async () => {
          let nftMarketplace, basicNft, deployer, player
          const PRICE = ethers.utils.parseEther("0.1")
          const TOKEN_ID = 0

          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              const accounts = await ethers.getSigners()
              player = accounts[1]
              await deployments.fixture(["all"])

              //By default connects to the 0 index account (Deployer)
              nftMarketplace = await ethers.getContract("NftMarketplace")

              //Connected to the Deployer
              basicNft = await ethers.getContract("BasicNft")
              await basicNft.mintNft()
              await basicNft.approve(nftMarketplace.address, TOKEN_ID)
          })

          it("Lists and withdraws", async () => {
              await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
              const playerConnectedNftMarketplace = nftMarketplace.connect(player)
              await playerConnectedNftMarketplace.buyItem(basicNft.address, TOKEN_ID, {
                  value: PRICE,
              })

              const newOwner = await basicNft.ownerOf(TOKEN_ID)
              const deployerProceeds = await nftMarketplace.getProceeds(deployer)

              assert(newOwner.toString() == player.address)
              assert(deployerProceeds.toString() == PRICE.toString())
          })

          describe("Withdraw Proceeds", () => {
              it("Should revert with NoProceeds if the amount of the money for the address <=0", async () => {
                  expect(await nftMarketplace.withdrawProceeds()).to.be.revertedWithCustomError(
                      nftMarketplace,
                      "NftMarketplace__NoProceeds"
                  )
              })
              it("Should revert with NoProceeds if the amount of the money for the address <=0 Pt2", async () => {
                  expect(await nftMarketplace.withdrawProceeds()).to.be.revertedWith(
                      "NftMarketplace__NoProceeds"
                  )
              })
          })
      })
