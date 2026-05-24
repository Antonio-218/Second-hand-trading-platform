
import React, { useState, useEffect } from 'react';
import { Modal, Button, Input } from 'antd';
import { web3, erc20Contract,sellerListContract,customerListContract,SellerABI,CustomerABI} from '../contract/second';


function PurchaseProduct() {
  const [productId, setProductId] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tokenBalance, setTokenBalance] = useState(0);

  useEffect(() => {
    // 获取用户账户的代币余额
    const fetchTokenBalance = async () => {
      try {
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];
        const balance = await erc20Contract.methods.balanceOf(account).call();
        console.log('balanceOf  balance = ', balance);
        setTokenBalance(balance);
      } catch (error) {
        console.error('Error fetching token balance:', error);
      }
    };

    fetchTokenBalance();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const buyProduct = async () => {
    // ----------
    const accounts = await web3.eth.getAccounts();
        const account = accounts[0];
    const SellerAddr = await sellerListContract.methods.creatorSellerMap(account).call();
    const sellerContract = await new web3.eth.Contract(SellerABI, SellerAddr);
    const totalPriceInTokens = await sellerContract.methods.getProductPrice(productId).call();
    console.log('totalPriceInTokens = ', parseInt(totalPriceInTokens));
      try {
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];
        const CustomerAddr = await customerListContract.methods.creatorCustomerMap(account).call();
        const customerContract = await new web3.eth.Contract(CustomerABI, CustomerAddr);
        await customerContract.methods.buyProduct(SellerAddr, productId, quantity).send({
          from: account,
          // value: parseInt(totalPriceInTokens) * 10**18,
          gas: '5000000',
        });
        console.log('Purchase successful!');
        handleOk(); // 关闭模态弹框
      } catch (error) {
        console.error('Error purchasing product:', error);
      }
    }


  
  return (
    <div>
      {/* 触发模态弹框的按钮 */}
      <Button type="primary" onClick={showModal}>
        Purchase Product
      </Button>
      <Modal title="Purchase Product" visible={isModalVisible} onOk={handleOk} onCancel={handleOk}>
        <Input
          type="number"
          placeholder="Product ID"
          value={productId}
          onChange={(e) => setProductId(parseInt(e.target.value, 10))}
        />
        <Input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
        />
        <Button type="primary" onClick={buyProduct} block>
          Purchase
        </Button>
      </Modal>
    </div>
  );
}

export default PurchaseProduct;
