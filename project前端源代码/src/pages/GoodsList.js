
import React, { useState, useEffect } from 'react';
import { Card, List, Spin, Image, Button, Pagination, Flex, Input } from 'antd'; // Import Input from antd
import { useNavigate } from 'react-router-dom';
import { web3, sellerListContract, SellerABI } from "../contract/second";
const { Meta } = Card;

const GoodsListWrapper = () => {
    const [data, setData] = useState(null);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [filterCategory, setFilterCategory] = useState(""); // State to hold filter category input
    const [filteredData, setFilteredData] = useState(null); // State to hold filtered data

    useEffect(() => {
        getGoodsList();
    }, []);

    const getGoodsList = async () => {
        const data = [];
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];
    
        const sellerList = await sellerListContract.methods.getSellerList().call({ from: account });
    
        for (let i = 0; i < sellerList.length; i++) {
            const SellerContract = new web3.eth.Contract(SellerABI, sellerList[i]);
            const sellerName = await SellerContract.methods.sellerName().call({ from: account });
    
            const availableProducts = await SellerContract.methods.getAvailableProducts().call({ from: account });
    
            for (let j = 0; j < availableProducts.length; j++) {
                const product = availableProducts[j];
                data.push({
                    title: sellerName,
                    productId: product.id.toString(),
                    productName: product.productName,
                    price: product.price,
                    imageHash: product.imageHash,
                    owner: sellerList[i],
                    description: product.description,
                    quantity: product.quantity,
                    category: product.category
                });
            }
        }
    
        setData(data);
        setFilteredData(data); // Initialize filteredData with all data
    };

    const onPageChange = (page, pageSize) => {
        setCurrentPage(page);
    };

    const onShowSizeChange = (current, size) => {
        setPageSize(size);
    };

    const handleCategoryInputChange = (e) => {
        setFilterCategory(e.target.value); // Update filter category state with input value
    };

    const filterByCategory = () => {
        if (filterCategory.trim() === "") {
            setFilteredData(data); // If filter category is empty, show all data
        } else {
            const filtered = data.filter(item => item.category.toLowerCase().includes(filterCategory.toLowerCase()));
            setFilteredData(filtered); // Filter data based on input category
        }
    };

    const resetFilters = () => {
        setFilterCategory(""); // Reset filter category input
        setFilteredData(data); // Reset filtered data to show all data
    };

    if (!data) {
        return (
            <Flex align="center" justify="center" gap="middle" style={{ height: '100vh' }}>
                <Spin size="large" />
            </Flex>
        );
    }

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentData = filteredData.slice(startIndex, endIndex);

    return (
        <>
            <Input placeholder="Enter category..." value={filterCategory} onChange={handleCategoryInputChange} style={{ width: 200, marginBottom: 10 }} />
            <Button onClick={filterByCategory} style={{ marginBottom: 10 }}>查询_tlw</Button>
            <Button onClick={resetFilters} style={{ marginBottom: 10, marginLeft: 10 }}>全部商品_tlw</Button>

            <List
                grid={{
                    gutter: 16,
                    column: 4,
                }}
                dataSource={currentData}
                renderItem={(item) => (
                    <List.Item>
                        <Card
                            hoverable
                            style={{ width: 280 }}
                            cover={
                                <Image
                                    src={`https://gateway.pinata.cloud/ipfs/${item.imageHash}`}
                                    style={{
                                        objectFit: 'cover',
                                        width: '100%',
                                        height: '240px',
                                    }}
                                />
                            }
                            onClick={() => navigate(`/api/goodInfo/${item.productId}/${item.owner}/${item.productName}/${item.price}/${item.imageHash}/${item.description}/${item.quantity}/${item.category}`)}
                        >
                            <Meta
                                title={`商家名称_tlw：${item.title}`}
                                description={
                                    <div>
                                        {`名称_tlw：${item.productName}`}
                                        <br />
                                        {`价格_tlw：${item.price}`}
                                        <br />
                                        {`描述_tlw: ${item.description}`}
                                        <br />
                                        {`类别_tlw: ${item.category}`}
                                    </div>
                                }
                            />
                            <Button onClick={() => { navigate(`/api/zhuishu/${item.owner}/${item.productId}`) }}>产品信息追溯_tlw</Button>
                        </Card>
                    </List.Item>
                )}
            />
            <Pagination
                style={{ marginTop: 20, textAlign: 'center' }}
                current={currentPage}
                pageSize={pageSize}
                total={filteredData.length}
                showSizeChanger
                showQuickJumper
                pageSizeOptions={['5', '10', '20', '50']}
                onChange={onPageChange}
                onShowSizeChange={onShowSizeChange}
            />
        </>
    );
};

export default GoodsListWrapper;
