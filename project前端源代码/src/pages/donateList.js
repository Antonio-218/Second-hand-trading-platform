import React, { useState, useEffect } from 'react';
import { Card, List, Spin } from 'antd';
import { web3, SellerABI,sellerListContract } from "../contract/second"; // 根据实际路径调整

const { Meta } = Card;

const DonatedProductsList = () => {
    const [donatedProducts, setDonatedProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDonatedProducts = async () => {
            setLoading(true);
            try {
                const accounts = await web3.eth.getAccounts();
                const account = accounts[0];
                const SellerAddr = await sellerListContract.methods.creatorSellerMap(account).call();
                const sellerContract = await new web3.eth.Contract(SellerABI, SellerAddr);

            
                const donatedProductsList = await sellerContract.methods.getDonatedProducts().call({ from: account });
                setDonatedProducts(donatedProductsList);
            } catch (error) {
                console.error("Error fetching donated products:", error);
                // 可以设置一个状态来显示错误信息
            } finally {
                setLoading(false);
            }
        };

        fetchDonatedProducts();
    }, []);

    if (loading) {
        return <Spin size="large" style={{ display: 'block', margin: 'auto' }} />;
    }

    return (
        <div>
            <h2>Donated Products</h2>
            <List
                itemLayout="vertical"
                dataSource={donatedProducts}
                renderItem={(product, index) => (
                    <List.Item key={index}>
                        <Card>
                            <Meta
                                title={`Product ID: ${product.id}`}
                                description={
                                    <div>
                                        <p>Product Name_tlw: {product.productName}</p>
                                        <p>Price_tlw: {product.price.toString()}</p>
                                        <p>Description_tlw: {product.description}</p>
                                        {/* <p>Quantity: {product.quantity.toString()}</p> */}
                                        {/* <p>PayOut: {product.payOut}</p> */}
                                        <p>On Sale_tlw: {product.onSale ? 'Yes' : 'No'}</p>
                                        <p>Image Hash_tlw: {product.imageHash}</p>
                                        <p>Seller Address_tlw: {product.sellerAddress}</p>
                                        <p>Donated_tlw: {product.donated ? 'Yes' : 'No'}</p>
                                        <p>Category_tlw: {product.category}</p>
                                        <p>Timestamp_tlw: {product.timestamp.toString()}</p>
                                    </div>
                                }
                            />
                        </Card>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default DonatedProductsList;