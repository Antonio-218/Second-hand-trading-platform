
import React, { useState, useEffect } from 'react';
import { Modal, Button, Input } from 'antd';
import { web3, sellerListContract, SellerABI } from '../contract/second';

function UnlistProduct() {
  const [productId, setProductId] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    setProductId('');
    setTransactionHash('');
    setErrorMessage('');
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setProductId('');
  };

  const unlistProduct = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      const SellerAddr = await sellerListContract.methods.creatorSellerMap(account).call();
      const sellerContract = await new web3.eth.Contract(SellerABI, SellerAddr);
      const txReceipt = await sellerContract.methods.unlistProduct(productId).send({ from: account, gas: 5000000 });
      console.log('Product successfully unlisted.');
      setTransactionHash(txReceipt.transactionHash);
      handleOk(); // 关闭模态弹框并清空输入
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Error occurred while unlisting product. Please try again.');
    }
  };

  return (
    <div>
      <Button type="primary" onClick={showModal}>
      tlw_Unlist Product
      </Button>
      <Modal title="Unlist Product" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Input
          placeholder="Product ID"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        />
        <Button type="primary" onClick={unlistProduct} block>
          Unlist
        </Button>
      </Modal>
      {transactionHash && (
        <div>
          <p>Transaction Hash: {transactionHash}</p>
        </div>
      )}
      {errorMessage && (
        <div>
          <p>Error: {errorMessage}</p>
      </div>
      )}
    </div>
  );
}

export default UnlistProduct;