import React, { useState } from 'react';
import { Upload, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import axios from 'axios';

const AddProduct = () => {
    const JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI0OGIxZjFkNS1lNzg3LTQ1MTUtYmJlNS1mODg5MTZhODYzZTIiLCJlbWFpbCI6IjI0MzQ0MjI0NjhAcXEuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjIwNWE3ZTE0NDkzY2RlMWZhM2IwIiwic2NvcGVkS2V5U2VjcmV0IjoiMDU4ZjBiYTFiYzQ5OWQ3ZTBjOGQxMWI1NTMyZjcyNmRiZTgxNTQ5YmU5NjE3ZmQ0YTY1OWRhYzY5NjgzOGJhZiIsImlhdCI6MTcxODI0NDk0MH0.gIkZBM0oBJZAhhksax7kWT3J5id9yFdsSbaF4SX1GP0.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJjYWUwM2IxZS02ODE0LTQ5NjgtYmViMC05MjQxNWU4OTNmMGEiLCJlbWFpbCI6IjEzOTU2MDE0ODNAcXEuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImJlNTczMWRhNmVmMWQ0ODNiZTkxIiwic2NvcGVkS2V5U2VjcmV0IjoiZjdkNzU5NjNjYjY0MGIwYzhlYTg5ZjIzZmQzZTA2ZjMwZTc2NDI3YTg5MjVkMWQ2YjRhMGExMmUzNTI1M2Y4YiIsImlhdCI6MTcxNTY5ODUzOX0.kh7Q1E8xUMV_rGTHY2UNN472Yw7roTpAOVkExMJ4i9o"; // 请确保这是有效的JWT  
    const [fileList, setFileList] = useState([]);

    const beforeUpload = (file) => {
        // 这里只是检查文件类型，实际上传逻辑在 handleUpload 中  
        const isJPGorPNG = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJPGorPNG) {
            alert('You can only upload JPG or PNG file!');
            return false;
        }
        return true;
    };

    const handleUpload = async (options) => {
        const { onSuccess, onError, file } = options;
        const formData = new FormData();
        formData.append("file", file);

        // 假设您已经有了一个方法来生成或获取 pinataMetadata 和 pinataOptions  
        // 这里只是示例数据，您需要根据实际情况填写  
        const pinataMetadata = JSON.stringify({
            name: file.name, // 使用文件原始名称或自定义名称  
            // ... 其他 metadata  
        });
        formData.append("pinataMetadata", pinataMetadata);

        const pinataOptions = JSON.stringify({
            cidVersion: 1,
            // ... 其他 options  
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
        } catch (error) {
            onError(error);
        }
    };

    const customRequest = async (options) => {
        handleUpload(options);
    };
    const onPreview = async (file) => {
        
        let src = file.url;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    }
    const onChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
      };
    return (
        <ImgCrop rotationSlider>
            <Upload
                customRequest={customRequest}
                beforeUpload={beforeUpload}
                listType="picture-card"
                fileList={fileList}
                onPreview={onPreview}
                onChange={onChange}
            >
                {fileList.length < 5 && <div>
                   <Button icon={<PlusOutlined />}>
                         Upload
                    </Button>
                </div>} 
            </Upload>
        </ImgCrop>
    );
};

export default AddProduct; 
