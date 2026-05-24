
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Image, Button, Row, Col } from 'antd';
import PurchaseProduct from './buyProduct'; // 导入PurchaseProduct组件
import UnlistProduct from './UnlistProduct';
import Donate from './donate'; // 导入Donate组件

export default function GoodsInfoWrapper() {
    const params = useParams();
    const userRole = window.localStorage.getItem("roleId"); // 从localStorage获取用户角色

    // 使用useState来管理点赞状态，初始化时从localStorage中获取，若不存在则默认为false
    const [isLiked, setIsLiked] = useState(() => {
        const liked = localStorage.getItem(`liked_${params.id}`);
        return liked === 'true' ? true : false;
    });

    // 点击点赞按钮时的处理函数
    const handleLikeClick = () => {
        setIsLiked(!isLiked); // 切换点赞状态
    };

    // 当isLiked状态改变时，将其存储在localStorage中
    useEffect(() => {
        localStorage.setItem(`liked_${params.id}`, isLiked.toString());
    }, [isLiked, params.id]);

    return (
        <div>
            <h1>商品详细_tlw</h1>
            <p>商品ID_tlw: {params.id}</p>
            <p>商品名称_tlw：{params.name}</p>
            <p>商品价格_tlw：{params.price}</p>
            <p>商品描述_tlw：{params.description}</p>
            <p>商品数量_tlw：{params.quantity}</p>
            <p>商品类别_tlw：{params.category}</p>

            {/* 显示商品图片 */}
            <Image
                src={"https://gateway.pinata.cloud/ipfs/" + params.img}
                style={{
                    objectFit: 'cover',
                    width: '100%',
                    height: '240px',
                }}
            />
      {/* 点赞按钮 */}
          
        
            {/* 根据用户角色显示不同的操作按钮 */}
            {userRole === "1" && (
          <>
                <PurchaseProduct productId={params.id} quantity={1} />
              <Button type="primary" onClick={handleLikeClick} style={{ backgroundColor: isLiked ? 'red' : 'blue' }}>
                {isLiked ? '已点赞' : '点赞'}
            </Button>
           </>
            )}

            {userRole === "2" && (
                <Row gutter={16}>
                    <Col span={12}>
                        <UnlistProduct productId={params.id} />
                    </Col>
                    <Col span={12}>
                        <Donate productId={params.id} />
                    </Col>
                </Row>
            )}
        </div>
    );
}
