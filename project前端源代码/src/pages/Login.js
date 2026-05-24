
import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input,Select  } from 'antd';
import './login.css';

import { web3,sellerListContract,customerListContract,erc20Contract } from "../contract/second";


const Login = () => {
  const onFinish = async (values) => {
    console.log('Received values of form: ', values);

    await window.ethereum.request({ method: 'eth_requestAccounts' });
    // 处理登录逻辑
    const accounts = await web3.eth.getAccounts();
    var account = accounts[0];
    var isLogin = false;
    if (values.roleId === '1') {
      isLogin = await customerListContract.methods.verifyPwd(values.username, values.password).call({ from: account })
    
    } else if (values.roleId === '2') {
      isLogin = await sellerListContract.methods.verifyPwd(values.username, values.password).call({ from: account })
    } 

    if (isLogin) {
      window.localStorage.setItem("roleId", values.roleId);
      window.localStorage.setItem("account", account);
      window.localStorage.setItem("username", values.username);
      window.location.href = "/api";

    } else {
      window.location.href = "/";
    }
  };


  return (
    <Form
      name="normal_login"
      className="login-form"
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
            message: 'Please input your Username!',
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
            message: 'Please input your Password!',
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
        name="roleId"
        rules={[
          {
            required: true,
            message: 'Please input your role!',
          },
        ]}
      >
        <Select
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
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <a className="login-form-forgot" href="">
          Forgot password
        </a>
      </Form.Item>
     
      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Log in
        </Button>
        Or <a href="/register" onClick={()=>window.localStorage.setItem("isToRegister",true)}>register now!</a>
      </Form.Item>
    </Form>
  );
};

export default Login;