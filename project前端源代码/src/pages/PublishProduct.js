
import React, { useState } from 'react';
import { web3,sellerListContract,SellerABI} from '../contract/second';
import { Button, Form, Input, InputNumber, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI0OGIxZjFkNS1lNzg3LTQ1MTUtYmJlNS1mODg5MTZhODYzZTIiLCJlbWFpbCI6IjI0MzQ0MjI0NjhAcXEuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjIwNWE3ZTE0NDkzY2RlMWZhM2IwIiwic2NvcGVkS2V5U2VjcmV0IjoiMDU4ZjBiYTFiYzQ5OWQ3ZTBjOGQxMWI1NTMyZjcyNmRiZTgxNTQ5YmU5NjE3ZmQ0YTY1OWRhYzY5NjgzOGJhZiIsImlhdCI6MTcxODI0NDk0MH0.gIkZBM0oBJZAhhksax7kWT3J5id9yFdsSbaF4SX1GP0"; // 请确保这是有效的JWT

function PublishProduct() {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [imageHash, setImageHash] = useState('');
  const [category, setCategory] = useState(''); // 新增类别状态

  const handleUploadChange = (info) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 上传成功`);
      setImageHash(info.file.response.IpfsHash); // 假设返回的数据中有IpfsHash字段
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败`);
    }
  };


  
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const handlePublishProduct = async () => {
    let success = false;

    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];

    try {
     const SellerAddr = await sellerListContract.methods.creatorSellerMap(account).call();
    const sellerContract = await new web3.eth.Contract(SellerABI, SellerAddr);
      // 调用合约的publishProduct函数
      await sellerContract.methods.publishProduct(productName, price, description, quantity, imageHash,category).send({ from: account, gas: 5000000 });
      success = true;
    } catch (error) {
      console.error('Error publishing product:', error);
      alert('Failed to publish product. Please check the console for errors.');
      return;
    }

    if (success) {
      // 清空表单字段
      setProductName('');
      setPrice(0);
      setDescription('');
      setQuantity(0);
      setImageHash('');
      setCategory(''); // 清空类别字段
      alert('Product published successfully!');
    }
  };
  const handleUpload = async (options) => {
    const { onSuccess, onError, file } = options;
    const formData = new FormData();
    formData.append("file", file);

    const pinataMetadata = JSON.stringify({
      name: file.name, // 使用文件原始名称或自定义名称
    });
    formData.append("pinataMetadata", pinataMetadata);

    const pinataOptions = JSON.stringify({
      cidVersion: 1,
    });
    formData.append("pinataOptions", pinataOptions);

    try {
      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${JWT}`,
          },
        }
      );

      // 假设 Pinata 返回了一个包含 IPFS hash 的对象
      // 您需要根据 Pinata 的实际 API 响应来解析数据
      const ipfsHash = response.data.IpfsHash; // 示例字段，请根据实际情况修改
      // 通知上传成功，并可以选择性地更新 fileList
      onSuccess(ipfsHash);
      setImageHash(ipfsHash);
    } catch (error) {
      onError(error);
    }
  };

  const customRequest = async (options) => {
    handleUpload(options);
  };
  return (
    <div className="PublishProduct">
      <h1>Publish Product</h1>
      <Form onFinish={handlePublishProduct}>
        <Form.Item label="Product Name">
         <Input value={productName} onChange={(e) => setProductName(e.target.value)} />
        </Form.Item>
        <Form.Item label="Price">
         <InputNumber value={price} onChange={(value) => setPrice(value)} />
        </Form.Item>
        <Form.Item label="Description">
         <Input.TextArea value={description} onChange={(e) => setDescription(e.target.value)} />
        </Form.Item>
        <Form.Item label="Quantity">
         <InputNumber value={quantity} onChange={(value) => setQuantity(value)} />
        </Form.Item>
        <Form.Item label="Category">
         <Input value={category} onChange={(e) => setCategory(e.target.value)} />
        </Form.Item>
        <Form.Item label="Upload Image">
         <Upload
            customRequest={customRequest}
            showUploadList={true}
          >
           <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
         <Button type="primary" htmlType="submit">
            Publish Product
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default PublishProduct;