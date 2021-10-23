const { ethers } = require('hardhat')
describe('NFTMarket', function () {
  it('Should create and execute market sales', async function () {
    /* deploy the marketplace */
    const Market = await ethers.getContractFactory('NFTMarket')
    const market = await Market.deploy()
    await market.deployed()
    const marketAddress = market.address

    /* deploy the NFT contract */
    const NFT = await ethers.getContractFactory('NFT')
    const nft = await NFT.deploy(marketAddress)
    await nft.deployed()
    const nftContractAddress = nft.address

    let listingPrice = await market.getListingPrice()
    listingPrice = listingPrice.toString()

    const auctionPrice = ethers.utils.parseUnits('1.1', 'ether')

    console.log(ethers.utils.formatUnits(auctionPrice))

    /* create two tokens */
    await nft.createToken()
    const toke = await nft.createToken()
    const s = await nft.getTokenId()


    /* put both tokens for sale */
    const token = await market.createMarketItem(nftContractAddress, 1, auctionPrice, {
      value: listingPrice,
    })
    await market.createMarketItem(nftContractAddress, 2, auctionPrice, {
      value: listingPrice,
    })

    let items = await market.fetchMarketItems()
    // console.log(items)

    const [_, buyerAddress] = await ethers.getSigners()

    /* execute sale of token to another user */
    const price = ethers.utils.parseUnits('1.1', 'ether')
    console.log(ethers.utils.formatUnits(price))
    await market
      .connect(buyerAddress)
      .createMarketSale(nftContractAddress, 1, { value: price })

    /* query for and return the unsold items */
    items = await market.fetchMarketItems()
    items = await Promise.all(
      items.map(async (i) => {
        const tokenUri = await nft.uri(i.tokenId)
        console.log(i.tokenId)
        let item = {
          price: i.price.toString(),
          tokenId: i.tokenId.toString(),
          seller: i.seller,
          owner: i.owner,
          tokenUri,
        }
        return item
      })
    )
    console.log('items: ', items)
  })
})
