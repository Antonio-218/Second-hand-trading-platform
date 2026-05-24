
import React, { useState, useEffect } from 'react';
import { Card, List, Spin, Modal, Button, Input, Form } from 'antd';
import { useNavigate } from 'react-router-dom';
import { web3, CustomerABI, customerListContract } from "../contract/second"; // Adjust path as needed
const { TextArea } = Input;
const { Meta } = Card;

const Order = () => {
    const [data, setData] = useState(null);
    const [purchaseOrders, setPurchaseOrders] = useState([]); // 初始化为空数组
    const [visible, setVisible] = useState(false); // 控制模态框的显示和隐藏
    const [selectedOrder, setSelectedOrder] = useState(null); // 存储当前选中的订单项
    const [content, setContent] = useState(''); // 评论内容
    const navigate = useNavigate();
    const [rating, setRating] = useState('');
    const [imageHash, setImageHash] = useState('');
    const [customerReviews, setCustomerReviews] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const accounts = await web3.eth.getAccounts();
                const account = accounts[0];
                const CustomerAddr = await customerListContract.methods.creatorCustomerMap(account).call();
                const customerContract = new web3.eth.Contract(CustomerABI, CustomerAddr);
                const orders = await customerContract.methods.getPurchaseOrders().call({ from: account });
                const reviews = await customerContract.methods.getCustomerReviews().call({ from: account });
                console.log(reviews[0])
                // alert(Number(reviews[0][2]))
                // alert(String(reviews[0][1]))
                // // console.log("review"+ reviews)
               

                setPurchaseOrders(orders); // 更新状态
                setData(orders); // 更新data状态 
                setCustomerReviews(reviews);
            } catch (error) {
                console.error("Error fetching data:", error);
                alert("Failed to  fetch data. Please check console for details.");
            }
            console.log(1)
        };

        fetchData();
    }, []);

    const showModal = (order) => {
        setSelectedOrder(order);
        setVisible(true);
    };

    const handleFormFinish = async (values) => {
       
        try {
            const accounts = await web3.eth.getAccounts();
            const account = accounts[0];
            const CustomerAddr = await customerListContract.methods.creatorCustomerMap(account).call();
            const customerContract = new web3.eth.Contract(CustomerABI, CustomerAddr);
            // console.log(selectedOrder.seller, content, rating, imageHash)
            
            await customerContract.methods.submitCustomerReview(selectedOrder.seller, values.content, Number(values.rating),'12345678900').send({ from: account });
            
            alert('Review submitted successfully!');
            
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Error submitting review. Please try again.');
        }
    };

    const handleCancel = () => {
        console.log("asdasdas")
        setVisible(false);
    };

    if (!data) {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div>
            {data && (
                <div style={{ marginTop: '20px' }}>
                    <h2>Purchase Orders</h2>
                    <List
                        itemLayout="vertical"
                        dataSource={data}
                        renderItem={(order, index) => (
                            <List.Item key={index}>
                                <Card>
                                    <Meta
                                        title={`Purchase Order ${index + 1}`}
                                        description={
                                            <div>
                                                <p>tlw_Seller: {order.seller}</p>
                                                <p>tlw_Product ID: {order.productId.toString()}</p>
                                                <p>tlw_Quantity: {order.quantity.toString()}</p>
                                                <p>tlw_Total Price: {order.totalPrice.toString()}</p>
                                                <p>tlw_Timestamp: {order.timestamp.toString()}</p>
                                                <Button type="link" size="small" onClick={() => showModal(order)}>Submit Review</Button>
                                            </div>
                                        }
                                    />
                                </Card>
                            </List.Item>
                        )}
                    />

                    <Modal
                        title="Submit Review"
                        visible={visible}
                        onCancel={handleCancel}
                        footer={[
                            <Button key="submit" type="primary" htmlType="submit" form="reviewForm">
                                Submit
                            </Button>,
                        ]}
                    >
                        <Form id="reviewForm" initialValues={{ content, rating, imageHash }} onFinish={handleFormFinish}>
                            <Form.Item name="content" label="Review">
                                <Input type="text" />
                            </Form.Item>
                            <Form.Item name="rating" label="Rating">
                                <Input type="number" />
                            </Form.Item>
                          
                        </Form>

                        <h3>Customer Reviews</h3>
                        {customerReviews.length > 0 ? (
                            <List
                                itemLayout="vertical"
                                dataSource={customerReviews}
                                renderItem={(review, index) => (

                                    <List.Item key={index}>
                                        <Card>
                                            <Meta
                                                title={`Review by ${review.reviewer}`}
                                                description={
                                                    <div>
                                                         <p>commentContent: {review.content}</p>
                                                        <p>Rating: {review.rating.toString()}</p>
                                                       
                                                        {/* Add image display if needed */}
                                                    </div>
                                                }
                                            />
                                        </Card>
                                    </List.Item>
                                )}
                            />
                        ) : (
                            <p>No reviews found.</p>
                        )}
                    </Modal>
                </div>
            )}
        </div>
    );
};

export default Order;