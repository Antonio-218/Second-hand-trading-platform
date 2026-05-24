
import React, { useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Select, Radio, Modal } from 'antd';
import './register.css';

import { web3, sellerListContract, customerListContract, erc20Address } from "../contract/second";
import AddProduct from './ipfsAccess/AddProduct';


const Register = () => {
  const [role, setRole] = useState()
  const onFinish = async (values) => {
    console.log('Received values of form: ', values);
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    // 处理注册逻辑
    const accounts = await web3.eth.getAccounts();
    var account = accounts[0];

    if (values.roleId === '1') {
      const estimatedGas = await customerListContract.methods.createCustomer(values.username, values.password, values.phone,values.email,values.gender,erc20Address)
        .estimateGas();
      console.log("预估的gas:", estimatedGas);
      customerListContract.methods.createCustomer(values.username, values.password, values.phone,values.email,values.gender,erc20Address)
        .send({ from: account, gas: '5000000' })
        .on('transactionHash', async function (hash) {
          console.log("交易哈希:", hash);
          const value = await web3.eth.getTransaction(hash)

          console.log(value)
        })
        .on('receipt', function (receipt) {
          // receipt example
          if (receipt.status == 1) {
            // window.location.href = "/";
            console.log("注册成功");
            window.location.href = "/login";
          } else {
            console.log("注册不成功");
          }
        })
        .on('error', function (error, receipt) { 
          console.error('交易出错:', error);
        }).catch((error) => {
      
          console.error('交易出错:', error);

          if (error.message.includes('revert')) {
            
            modal.error({
              title: '注册失败',
              content: `原因：注册失败，可能重复注册或者gas不够`,
            });
          }
        })

    } else if (values.roleId === '2') {
      values.email = String(values.email);
      sellerListContract.methods.createSeller(values.username, values.password, values.phone,values.email, values.sellerNo, erc20Address)
        .send({ from: account, gas: '5000000' })
        .on('receipt', function (receipt) {
          // receipt example
          if (receipt.status == 1) {
            // window.location.href = "/";
            console.log("注册成功");
            window.location.href = "/login";
          } else {
            console.log("注册不成功");
          }
        })
        .on('error', function (error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
          console.error('交易出错:', error);

        }).catch((error) => {
          
          console.error('交易出错:', error);

          if (error.message.includes('revert')) {
          

            modal.error({
              title: '注册失败',
              content: `原因：注册失败，可能重复注册或者gas不够`,
            });
          }
        })

    }
  };

  const [value, setValue] = useState(1);
  // const onChange = (e) => {
  //   console.log('radio checked', e.target.value);
  //   setValue(e.target.value);
  // };
  const [modal, contextHolder] = Modal.useModal();

  return (
    <div className="register-container"> {contextHolder}
    <AddProduct></AddProduct>
      <Form
        name="normal_register"
        className="register-form"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: '请输入用户名!',
            },
          ]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: '请输入密码!',
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item
          name="cpassword"
          rules={[
            {
              required: true,
              message: '请确认密码!',
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Confirm Password"
          />
        </Form.Item>
        <Form.Item
          name="phone"
          rules={[
            {
              required: true,
              message: '请输入电话号码!',
            },
          ]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="phone" />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: '请输入邮箱!',
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="email"
            placeholder="Email"
          />
        </Form.Item>
        {role == 1 ?
          <Form.Item
            name="gender"
            rules={[
              {
                required: true,
                message: '请选择性别!',
              },
            ]}
          >
            {/* <Radio.Group onChange={onChange} value={value}>
              <Radio value={true}>男</Radio>
              <Radio value={false}>女</Radio>

            </Radio.Group> */}
             <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="gender"
            placeholder="Gender"
          />
          </Form.Item> :
          <Form.Item
            name="sellerNo"
            rules={[
              {
                required: true,
                message: '请输入商家编号!',
              },
            ]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="商家编号" />
          </Form.Item>
        }



        <Form.Item
          name="roleId"
          rules={[
            {
              required: true,
              message: 'Please input your role!',
            },
          ]}
        >
          <Select
            onChange={(e) => { setRole(e) }}
            showSearch
            style={{
              width: 200,
            }}
            placeholder="请选择角色"
            optionFilterProp="children"
            filterOption={(input, option) => (option?.label ?? '').includes(input)}
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
            }
            options={[
              {
                value: '1',
                label: '顾客',
              },
              {
                value: '2',
                label: '商家',
              }
              // {
              //   value: '3',
              //   label: '交警',
              // }
            ]}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            注册
          </Button>
          Or <a href="/login" onClick={() => window.localStorage.setItem("isToRegister", false)}>已有账号去登录!</a>
          
        </Form.Item>

      </Form>
    </div>
  );
};

export default Register;