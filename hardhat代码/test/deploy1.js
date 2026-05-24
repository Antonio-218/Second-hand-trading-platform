// 引入Chai断言库，用于测试断言
const { expect } = require('chai');
// 引入Ethers.js库，用于与以太坊进行交互
const { ethers } = require('hardhat');
// 引入Web3库
var Web3 = require('web3');
// // 设置Web3的提供者，如果没有提供则默认为本地区块链服务
// let web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:8545");
const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");


describe("Purchase Functionality", function () {
  let sellerList, customerList, erc20Token, sellerContract, customerContract,owners;
let sellerabi;
let customerabi;
  console.log(1)
  beforeEach(async function () {
    // Deploy ERC20 Token
    console.log(2)
    const ERC20 = await ethers.getContractFactory("ERC20");

    erc20Token = await ERC20.deploy("mytoken", "tlw", 18);
    const Seller = await ethers.getContractFactory("Seller");
     sellerabi=Seller.interface.format();
     const Customer = await ethers.getContractFactory("Customer");
      customerabi= Customer.interface.format();
    // 部署并初始化一些测试账户
    const accounts = await ethers.getSigners();
     owners = accounts[0];
    const customer = accounts[1];
    const value = await erc20Token.balanceOf(customer);
    console.log(value);

    const SellerList = await ethers.getContractFactory("SellerList");
    sellerList = await SellerList.deploy();
console.log(SellerList);
    const CustomerList = await ethers.getContractFactory("CustomerList");
    customerList = await CustomerList.deploy();


    await sellerList.createSeller("SellerUserName", "SellerPassword", "123456789", "seller@example.com", "S1", erc20Token.target);

    const sellerAddress = await sellerList.creatorSellerMap(owners.address);

    await customerList.createCustomer("CustomerUserName", "CustomerPassword", "987654321", "customer@example.com", "Male", erc20Token.target);
    const customerAddress = await customerList.creatorCustomerMap(owners.address);

    sellerContract =new ethers.Contract(sellerAddress,sellerabi,owners);
    customerContract = new ethers.Contract(customerAddress,customerabi,owners);

    await sellerContract.publishProduct("Product 1", 1, "Description", 10, "imageHash", "Category");


    // 顾客通过调用 swapTokensForEth 方法来兑换代币
      const ethValue = ethers.parseEther("10"); // 顾客发送1 ETH来兑换代币
      await erc20Token.connect(customer).swapTokensForEth({ value: ethValue });

    //   // 检查顾客是否收到代币
      const customerBalance = await erc20Token.balanceOf(customer.address);
    });
    it("---------", async function () {
      const customerAddress = await customerList.creatorCustomerMap(owners.address);
console.log(customerAddress);
const sellerAddress = await sellerList.creatorSellerMap(owners.address);
  //   //   // 假设产品价格为1000单位的ERC20代币
      const productPrice = ethers.parseUnits("1",16); // 18是ERC20代币的decimals


    //   // 确保顾客有足够的ERC20代币进行购买
      const customerInitialTokens = ethers.parseEther("1");
      console.log(customerInitialTokens)
      const value=parseInt(customerInitialTokens)
     
     
    //   // 顾客购买产品
      await customerContract.buyProduct(sellerAddress,1, 1);

    //   // 检查顾客的ERC20代币余额是否减少
      const customerBalance = await erc20Token.balanceOf(customerAddress);

   
      const sellerBalance = await erc20Token.balanceOf(sellerAddress);
   
    //   // 检查产品库存是否减少
      const product = await sellerContract.getAvailableProducts();
      console.log(product)
      // expect(product.quantity).to.equal(9);
  });
});



