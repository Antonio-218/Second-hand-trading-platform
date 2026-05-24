# 基于DApp的可追溯二手交易平台(Second-hand Trading Platform)

一个基于区块链技术的去中心化二手商品交易平台，整合了React前端、Express后端、MySQL数据库和以太坊智能合约。

## 项目简介

本平台提供了一个安全、透明的二手商品交易环境，利用区块链技术确保交易的可追溯性和信任度。平台支持卖家发布商品、买家购买商品、商品捐赠、评价系统等功能，并通过ERC20代币实现平台内的价值流转。

## 技术栈

### 前端
- **React 18.3.1**：前端框架
- **Ant Design 5.18.0**：UI组件库
- **React Router 6.23.1**：路由管理
- **Web3.js 4.9.0**：区块链交互
- **Axios 1.7.2**：HTTP请求
- **antd-img-crop 4.22.0**：图片裁剪

### 后端
- **Express 4.19.2**：Web框架
- **MySQL 2.18.1**：数据库
- **JWT**：用户认证
- **Swagger**：API文档
- **Web3.js 1.9.0**：区块链交互
- **CORS**：跨域支持

### 区块链
- **Hardhat 2.22.5**：开发框架
- **Solidity 0.8.24**：智能合约语言
- **OpenZeppelin**：安全的合约库

### 数据库
- **MySQL**：关系型数据库
- **IPFS**：去中心化文件存储

## 项目结构

```
Second-hand-trading-platform/
├── project前端源代码/          # React前端项目
│   ├── src/
│   │   ├── pages/            # 页面组件
│   │   ├── router/           # 路由配置
│   │   └── contract/         # 智能合约交互
│   └── package.json
├── project后端源代码/          # Express后端项目
│   ├── restfulApp_userinfo_crud.js  # 主服务文件
│   └── package.json
├── hardhat代码/               # 智能合约项目
│   ├── contracts/            # Solidity合约
│   ├── test/                 # 合约测试
│   └── hardhat.config.js     # Hardhat配置
└── sql文件/                  # 数据库脚本
    ├── sys_menu.sql          # 菜单数据
    ├── sys_role.sql          # 角色数据
    └── sys_role_menu.sql     # 角色菜单关联
```

## 主要功能

### 用户功能
- **用户注册与登录**：支持卖家和买家两种角色的注册登录
- **个人信息管理**：用户可以修改个人信息、密码等
- **角色权限管理**：基于角色的菜单权限控制

### 商品功能
- **发布商品**：卖家可以发布二手商品，包括商品名称、价格、描述、图片、分类等
- **商品管理**：卖家可以查看、下架自己的商品
- **商品浏览**：买家可以浏览所有在售商品，支持按分类筛选
- **商品详情**：查看商品的详细信息，包括价格、库存、卖家信息等

### 交易功能
- **购买商品**：买家可以购买商品，支持ERC20代币支付
- **订单管理**：查看购买订单和历史记录
- **发货与签收**：支持物流状态跟踪

### 捐赠功能
- **商品捐赠**：卖家可以将商品捐赠给他人
- **捐赠列表**：查看已捐赠的商品记录

### 评价系统
- **商品评价**：买家可以对购买的商品进行评价和打分
- **卖家评价**：买家可以对卖家进行评价
- **评价历史**：查看所有评价记录

### 区块链功能
- **ERC20代币**：平台内置ERC20代币，用于交易支付
- **智能合约**：商品交易、用户管理等核心逻辑通过智能合约实现
- **交易记录**：所有交易记录上链，确保不可篡改
- **代币兑换**：支持ETH与平台代币的兑换

### 其他功能
- **信用评分系统**：用户信用评分机制
- **积分系统**：用户积分奖励机制
- **IPFS图片存储**：商品图片通过IPFS去中心化存储

## 环境要求

- **Node.js**：v16.0.0 或更高版本
- **MySQL**：5.7 或更高版本
- **Git**：用于代码管理
- **Metamask**：浏览器钱包插件（用于区块链交互）

## 安装步骤

### 1. 克隆项目

```bash
git clone <项目地址>
cd Second-hand-trading-platform
```

### 2. 数据库配置

#### 创建数据库
```sql
CREATE DATABASE node;
```

#### 导入数据表
```bash
# 在MySQL中执行以下SQL文件
mysql -u root -p node < sql文件/sys_menu.sql
mysql -u root -p node < sql文件/sys_role.sql
mysql -u root -p node < sql文件/sys_role_menu.sql
```

#### 创建商品区块链信息表
```sql
CREATE TABLE goodsblockInfo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    goodId VARCHAR(255),
    tHash VARCHAR(255),
    blocknumber INT,
    actionType INT,
    fromaccount VARCHAR(255),
    toaccount VARCHAR(255),
    cnonce INT,
    tInfo TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 修改数据库配置
编辑 `project后端源代码/restfulApp_userinfo_crud.js`，修改数据库连接信息：
```javascript
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',      // 数据库地址
    user: 'root',           // 数据库用户名
    password: '123456',     // 数据库密码
    database: 'node'        // 数据库名
});
```

### 3. 后端安装

```bash
cd project后端源代码
npm install
```

### 4. 前端安装

```bash
cd project前端源代码
npm install
```

### 5. 智能合约安装

```bash
cd hardhat代码
npm install
```

## 运行项目

### 1. 启动后端服务

```bash
cd project后端源代码
node restfulApp_userinfo_crud.js
```

后端服务将在 `http://localhost:3001` 启动

API文档访问地址：`http://localhost:3001/api-docs`

### 2. 部署智能合约

```bash
cd hardhat代码

# 编译合约
npx hardhat compile

# 部署合约到本地网络
npx hardhat run scripts/deploy.js --network localhost

# 或部署到测试网络（需要配置hardhat.config.js）
npx hardhat run scripts/deploy.js --network sepolia
```

**注意**：部署前需要启动本地Hardhat网络：
```bash
npx hardhat node
```

### 3. 启动前端服务

```bash
cd project前端源代码
npm start
```

前端服务将在 `http://localhost:3000` 启动

## 使用说明

### 首次使用

1. **配置Metamask钱包**
   - 安装Metamask浏览器插件
   - 创建或导入钱包
   - 添加本地网络（如使用Hardhat本地网络）
   - 确保钱包有足够的测试ETH

2. **注册账号**
   - 访问 `http://localhost:3000`
   - 选择注册为卖家或买家
   - 填写个人信息并完成注册

3. **连接钱包**
   - 在页面中点击连接钱包按钮
   - 授权Metamask连接

### 卖家操作流程

1. 登录卖家账号
2. 进入"发布商品"页面
3. 填写商品信息（名称、价格、描述、分类、图片等）
4. 提交发布，商品信息将上链
5. 在"商品管理"页面查看和管理商品
6. 可以选择将商品捐赠

### 买家操作流程

1. 登录买家账号
2. 浏览商品列表，可以按分类筛选
3. 查看商品详情
4. 使用ERC20代币购买商品
5. 在"订单"页面查看购买记录
6. 对购买的商品进行评价

### 代币操作

1. **兑换代币**：通过ETH兑换平台代币
2. **查询余额**：查看代币余额
3. **转账**：进行代币转账操作

## API接口文档

启动后端服务后，访问 `http://localhost:3001/api-docs` 查看完整的API文档。

主要接口：
- `GET /menu/:roleId` - 获取用户菜单
- `POST /goodsblockInfo` - 新增商品区块链信息
- `GET /goodsblockInfo/:goodId/:fromaccount/:serachValue` - 查询商品区块链信息

## 智能合约说明

### 主要合约

1. **ERC20** - 平台代币合约
   - 代币转账
   - 代币兑换
   - 余额查询

2. **SellerList** - 卖家列表管理
   - 创建卖家
   - 验证卖家身份

3. **Seller** - 卖家合约
   - 发布商品
   - 管理商品
   - 商品捐赠
   - 评价管理

4. **CustomerList** - 买家列表管理
   - 创建买家
   - 验证买家身份

5. **Customer** - 买家合约
   - 购买商品
   - 订单管理
   - 评价提交
   - 积分管理

## 常见问题

### 数据库连接失败
- 检查MySQL服务是否启动
- 确认数据库用户名密码是否正确
- 确认数据库是否存在

### 前端无法连接后端
- 检查后端服务是否启动（端口3001）
- 检查CORS配置是否正确
- 查看浏览器控制台错误信息

### 智能合约部署失败
- 确认Hardhat网络是否启动
- 检查钱包是否有足够的ETH
- 确认合约代码是否有语法错误

### Metamask连接问题
- 确认Metamask已安装并解锁
- 检查网络配置是否正确
- 确认网站已获得授权

## 开发说明

### 添加新功能

1. **前端**：在 `src/pages/` 下添加新页面组件
2. **路由**：在 `src/router/router.js` 中配置路由
3. **后端**：在 `restfulApp_userinfo_crud.js` 中添加API接口
4. **合约**：在 `hardhat代码/contracts/` 下编写新合约

### 测试

```bash
# 前端测试
cd project前端源代码
npm test

# 合约测试
cd hardhat代码
npx hardhat test
```

## 注意事项

- 本项目为开发演示项目，生产环境使用需要进行安全加固
- 私钥和敏感信息请妥善保管，不要提交到代码仓库
- 建议使用测试网络进行开发和测试
- 数据库密码请在生产环境中修改为强密码

## 许可证

MIT License



## 更新日志

### v1.0.0
- 初始版本发布
- 实现基本的商品交易功能
- 集成区块链智能合约
- 完成前后端分离架构
