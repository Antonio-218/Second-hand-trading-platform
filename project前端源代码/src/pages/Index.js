import { Link, Outlet, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import {  Layout, Menu, theme, Button } from 'antd';
import axios from "axios";
import { web3 ,erc20Contract} from "../contract/second";

const { Header, Content, Footer, Sider } = Layout;
// const items1 = ['/', '/index', '/login'].map((key) => ({
//     key,
//     label: `nav ${key}`,
// }));



const Index = () => {

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const navigate = useNavigate();
    const [menuData, setMenuData] = useState([]);

    const [ethValue, setEthValue] = useState(0);
    const [erc20Value ,setErc20Value] = useState("");
    const userInfo = {
        username: window.localStorage.getItem("username") || "匿名用户",
        account: window.localStorage.getItem("account") || "未知账号",
        // ... 其他用户信息，如代币数量和ETH余额  
    };

    const getValueOfEth = async () => {

        await window.ethereum.request({ method: 'eth_requestAccounts' });
        // 处理登录逻辑
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];
        const valEthInWei= await web3.eth.getBalance(account);
        const valEth = web3.utils.fromWei(valEthInWei, 'ether'); 
        const formattedEth = parseFloat(valEth).toFixed(2);

        setEthValue(formattedEth);
        const erc20Val =  await erc20Contract.methods.balanceOf(account).call();
        const erc20ValEth = web3.utils.fromWei(erc20Val, 'ether')*200; 
        setErc20Value(erc20ValEth);

    }
  
    useEffect(() => {
        getValueOfEth()
       
        console.log("----------effect-----------")
        //发送请求到后端获取菜单数据

        axios.get(`http://localhost:3001/menu/${window.localStorage.getItem("roleId")}`, {
            headers: {

                //'Authorization': `Bearer ${token}`, // 假设你的API使用Bearer token认证  
                // 这里可以添加其他你需要的headers  
            },
        }).then(function (response) {
            // 请求成功时处理响应数据  
            console.log('response.data = ', response.data);
            setMenuData(response.data)
        }).catch(function (error) {
            // 请求失败时处理错误  
            console.error(error);
        });
       
        return () => { //退出组件执行
            console.log("----------return-----------")
        };
    }, []); // 空数组[]表示仅在组件挂载时执行
    /*if(window.localStorage.getItem("roleId") == null || window.localStorage.getItem("roleId") == ""){
        navigate("/")
        return <div>请先登录</div>
    }*/

    const getSwapTokensForEth =async ()=>{
        try{
            const receipt =  await erc20Contract.methods.swapTokensForEth().send({from: userInfo.account,value: web3.utils.toWei('10', 'ether'),gas:5000000});
            console.log(receipt)
            const erc20Val =  await erc20Contract.methods.balanceOf(userInfo.account).call();
            setErc20Value(erc20Val.toString());
     
            const valEthInWei= await web3.eth.getBalance(userInfo.account);
            const valEth = web3.utils.fromWei(valEthInWei, 'ether'); 
            const formattedEth = parseFloat(valEth).toFixed(2);
            setEthValue(formattedEth);
        }catch(err){
            console.log(err)
            alert(err)
        }
       
    }
    // console.log('menuData = ', menuData);
    return (

        <Layout>
            <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
             
                <h1 style={{
                    color: '#FFFFFF',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                    padding: '10px 20px',
                    lineHeight: '1.2',
                    fontWeight: 'bold',
                    // 其他样式...  
                }}>二手平台交易系统_tlw</h1>
            
                <div style={{ color: '#FFFFFF' }}>
                        用户姓名_tlw：{userInfo.username}
                    </div>
                    <div style={{ color: '#FFFFFF' }}>
                    登录账号_tlw：{userInfo.account}
                    </div>
                <div style={{ color: '#FFFFFF'}}>
                        <Button type="primary" onClick={getSwapTokensForEth}>兑换代币_tlw</Button>
                        {/* 这里可以添加代币数量和ETH余额的展示 */}
                    </div>
                    <div style={{ color: '#FFFFFF'}}>
                    代币余额_tlw：{erc20Value} erc
                    </div>
                    <div style={{ color: '#FFFFFF'}}>
                    余额_tlw：{  ethValue}eth
                    </div>
            </Header>
            <Content
                style={{
                    padding: '0 48px',
                }}
            >

                <Layout
                    style={{
                        padding: '24px 0',
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Sider
                        style={{
                            background: colorBgContainer,
                        }}
                        width={200}
                    >
                        <Menu
                            mode="inline"
                            style={{
                                height: '100%',
                            }}
                            items={menuData}
                            onClick={(e) => {
                                navigate(e.key, { replace: true })
                            }}
                        >
                        </Menu>
                        <Menu>
                            <Menu.Item >
                                <Link to="/">首页</Link>
                            </Menu.Item>
                        </Menu>
                    </Sider>
                    <Content
                        style={{
                            padding: '0 24px',
                            minHeight: 280,
                        }}
                    >

                        <Outlet></Outlet>
                    </Content>
                </Layout>
            </Content >
            <Footer
                style={{
                    textAlign: 'center',
                }}
            >
                Ant Design ©{new Date().getFullYear()} Created by Ant UED
            </Footer>
        </Layout >
    );
};




export default Index;