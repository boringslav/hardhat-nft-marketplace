const fs = require("fs")
const { ethers, network } = require("hardhat")

const frontEndContractsFile = "../nextjs-moralis-nft-marketplace-fcc/constants/networkMapping.json"
const frontEndAbiLocation = "../nextjs-moralis-nft-marketplace-fcc/constants/"

module.exports = async () => {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Updating Front-End...")
        await updateContractAddresses()
        await updateAbi()
    }
}

async function updateAbi() {
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    fs.writeFileSync(
        `${frontEndAbiLocation}NftMarketplace.json`,
        nftMarketplace.interface.format(ethers.utils.FormatTypes.json)
    )
    const basicNft = await ethers.getContract("BasicNft")
    fs.writeFileSync(
        `${frontEndAbiLocation}BasicNft.json`,
        basicNft.interface.format(ethers.utils.FormatTypes.json)
    )
}

const updateContractAddresses = async () => {
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    const chainId = network.config.chainId

    const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf8"))
    if (chainId in contractAddresses) {
        if (!contractAddresses[chainId]["NftMarketplace"].includes(nftMarketplace.address)) {
            contractAddresses[chainId]["NftMarketplace"].push(nftMarketplace.address)
        }
    } else {
        contractAddresses[chainId] = {
            NftMarketplace: [nftMarketplace.address],
        }
    }

    fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
}

module.exports.tags = ["all", "frontend"]
