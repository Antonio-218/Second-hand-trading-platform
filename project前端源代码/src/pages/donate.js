
import React, { useState } from 'react';
import { Modal, Button, Input, Alert } from 'antd';
import { web3, sellerListContract, SellerABI } from "../contract/second";

const Donate = () => {
  const [productId, setProductId] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false); // 控制模态框的显示
  const [transactionHash, setTransactionHash] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleProductIdChange = (event) => {
    setProductId(event.target.value);
  };

  const handleRecipientAddressChange = (event) => {
    setRecipientAddress(event.target.value);
  };

  const handleOk = async () => {
    if (!productId || isNaN(productId)) {
      setErrorMessage('Please enter a valid Product ID.');
      return;
    }

    try {
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];
      
      const SellerAddr = await sellerListContract.methods.creatorSellerMap(account).call();
      const sellerContract = await new web3.eth.Contract(SellerABI, SellerAddr);
      
      const txReceipt = await sellerContract.methods.donateProduct(productId, recipientAddress).send({ from: account });
      
      setTransactionHash(txReceipt.transactionHash);
      console.log('Product donated successfully.');
      
      // 模态框关闭
      setIsModalVisible(false);
      
      // 清空表单字段
      setProductId('');
      setRecipientAddress('');
      
      alert('Product donated successfully!');
      // window.location.href = "/donateList";
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Error occurred while donating product. Please try again.');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
   
      <Button type="primary" onClick={() => setIsModalVisible(true)}>Donate Product</Button>
      
      <Modal title="Donate Product"
             visible={isModalVisible}
             onOk={handleOk}
             onCancel={handleCancel}
      >
        <Input placeholder="Enter Product ID" value={productId} onChange={handleProductIdChange} />
        <Input placeholder="Enter Recipient Address" value={recipientAddress} onChange={handleRecipientAddressChange} />
        {errorMessage && <Alert message={errorMessage} type="error" style={{ marginBottom: 20 }} />}
      </Modal>

      {transactionHash && (
        <div>
          <p>Transaction Hash: {transactionHash}</p>
        </div>
      )}
    </div>
  );
};

export default Donate;