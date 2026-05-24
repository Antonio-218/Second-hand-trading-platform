// SPDX-License-Identifier: MIT  
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Utils {

    function stringToBytes32(string memory source) internal pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            result := mload(add(source, 32))
        }
    }

    function bytes32ToString(bytes32 x) internal pure returns (string memory) {
        bytes memory bytesString = new bytes(32);
        uint charCount = 0;
        for (uint j = 0; j < 32; j++) {
            bytes1 char = bytes1(bytes32(uint(x) << (8 * j)));
            if (char != 0) {
                bytesString[charCount] = char;
                charCount++;
            }
        }
        bytes memory bytesStringTrimmed = new bytes(charCount);
        for (uint j = 0; j < charCount; j++) {
            bytesStringTrimmed[j] = bytesString[j];
        }
        return string(bytesStringTrimmed);
    } 
    
    function compareStrings (string memory a, string memory b) internal pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }
}

contract ERC20 is IERC20 {
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    string public name;
    string public symbol;
    uint8 public decimals;
    address owner;
    modifier onlyOwner() {
        require(msg.sender == owner, "BasicAuth: only owner  is authorized.");
        _;
    }

    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals
        ) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        owner = msg.sender;
    }

    function transfer(address recipient, uint256 amount)
        external
        returns (bool)
        {
        balanceOf[msg.sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    function transferBytx(address recipient, uint256 amount)
        external
        returns (bool)
        {
        balanceOf[tx.origin] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(tx.origin, recipient, amount);
        return true;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
      ) external returns (bool) {
        allowance[sender][msg.sender] -= amount;
        balanceOf[sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(sender, recipient, amount);
        return true;
    }

    function _mint(address to, uint256 amount) internal {
        balanceOf[to] += amount;
        totalSupply += amount;
        emit Transfer(address(0), to, amount);
    }

    function _burn(address from, uint256 amount) internal {
        balanceOf[from] -= amount;
        totalSupply -= amount;
        emit Transfer(from, address(0), amount);
    }

    
    // 添加一个事件来记录代币兑换（Swap）
    event TokenSwapped(
        address indexed from,
        uint256 amount,
        uint256 ethReceived
    );

    // 允许合约接收ETH的函数
    receive() external payable {
        // 这里只是简单地存储ETH，你可以添加逻辑来与代币进行交换
    }

    // 兑换代币（这里简化为与合约所有者交换ETH）
    function swapTokensForEth() external payable {
        // 假设有一个外部逻辑来确定ETH的等价量（例如，通过DEX的查询）
        // 这里我们简单地使用一个硬编码的汇率作为示例
        uint256 ethAmount = (msg.value / 1e18) * 100; // 假设100代币 = 1 ETH
        uint256 amount = msg.value;
        // 从合约中住铸造代币
        _mint(msg.sender, ethAmount);
        // 触发事件
        emit TokenSwapped(owner, amount, ethAmount);
    }

    // 事件，用于记录转账
    event EtherTransferred(
        address indexed from,
        address indexed to,
        uint256 amount
    );
    //放置重入攻击
    bool private isProcessing = false;

    // 转账方法
    function transferEtherTo(uint256 _amount) external {
        //  _to = payable  msg.sender;

        // 确保合约有足够的余额
        require(address(this).balance >= _amount / 100, "Insufficient balance");
        //确保可提取的钱
        require(balanceOf[msg.sender] >= _amount, "you not have ength balance");
        isProcessing = true;
        // 发送ETH
        bool success = (payable(address(msg.sender))).send(
            (_amount / 100) * 1e18
        );
        //销毁
        _burn(msg.sender, _amount);
        require(success, "Transfer failed");
        isProcessing = false;
        // 触发事件
        emit EtherTransferred(address(this), msg.sender, _amount);
    }

}

contract SellerList is Utils {
    address[] public sellerList;
    mapping(address => address) public creatorSellerMap;

    // 创建一个新的卖家，并将其地址添加到列表中。
    function createSeller(string memory userName, string memory password, string memory phone,string memory email, string memory sellerNo,address payable  _erc20TokenAddress) public {
        address sellerAccount = msg.sender;
        require(isNotRegistered(sellerAccount), "Seller already registered.");
        address newSeller = address(new Seller(sellerAccount, userName, password, phone,email, sellerNo, _erc20TokenAddress));
        sellerList.push(newSeller);
        creatorSellerMap[sellerAccount] = newSeller;
    }
   

    // 获取所有卖家的列表。
    function getSellerList() public view returns (address[] memory) {
        return sellerList;
    }

    // 检查给定地址是否未注册为卖家。
    function isNotRegistered(address account) internal view returns (bool) {
        return creatorSellerMap[account] == address(0);
    }
     // 检查给定地址是否是卖家。
    function isSeller(address sellerAddr) public view returns (bool) {
        for (uint i = 0; i < sellerList.length; i++) {
            if (sellerAddr == sellerList[i]) return true;
        }
        return false;
    }
    // 验证卖家的用户名和密码。
    function verifyPwd(string memory userName, string memory password) public view returns (bool) {
        address creator = msg.sender;
        require(!isNotRegistered(creator), "Seller not registered.");
        address contractAddr = creatorSellerMap[creator];
        Seller seller = Seller(contractAddr);
        return compareStrings(seller.sellerName(), userName) && seller.pwdRight(password);
    }
}

contract Seller is Utils {
    address public owner;
    string public sellerName;
    bytes32 private password;
    uint private nowBalance;
    string public phone;
    string public email; // 添加邮箱字段
    string public sellerNo;
    // string public gender; // 添加性别字段
    ERC20 public erc20Token;

    constructor(address _owner, string memory _userName, string memory _password, string memory _phone, string memory _email, string memory _sellerNo ,address payable _erc20TokenAddress) {
        owner = _owner;
        sellerName = _userName;
        password = stringToBytes32(_password);
        nowBalance = 10000;
        phone = _phone;
        email = _email;
        sellerNo = _sellerNo;
        // gender = _gender; // 设置性别字段
        erc20Token = ERC20(_erc20TokenAddress); // 初始化ERC20合约地址
    }
    struct Product {
            uint id;
            string productName;
            uint price;
            string description;
            // bool isAvailable;
            uint quantity;
            uint payOut;
            bool onSale;
            string imageHash;
            address sellerAddress; // 添加卖家地址字段
            bool donated;//-------------------------
            string category; // 添加类别字段
            uint timestamp; // 添加时间戳字段
    }

    Product[] public productList;
   
    //信用
    struct CreditHistory {
        uint score;
        uint timestamp;
    }
    mapping(address => CreditHistory[]) public creditHistories;

    modifier ownerOnly {
        require(owner == msg.sender, "Only owner can call this function.");
        _;
    }

    modifier ownerOrSystemOnly {
        require(msg.sender == owner, "Only owner or em can csystall this function.");
        _;
    }

  
    // 发布一个新产品
    function publishProduct(string memory _productName, uint _price, string memory _description, uint _quantity,string memory _imageHash,string memory _category) public ownerOnly {
        uint productId = productList.length + 1;
        Product memory newProduct = Product({
            id: productId,
            productName: _productName,
            price: _price,
            description: _description,
            // isAvailable: true,
            quantity: _quantity,
            payOut: 0,
            onSale: true,
            imageHash: _imageHash,
            sellerAddress: owner ,
             donated: false, 
             category: _category, // 设置类别字段
            timestamp: block.timestamp // 设置时间戳字段
        });
        productList.push(newProduct);
    }

    // 下架一个产品
    function unlistProduct(uint _productId) public ownerOnly {
        require(_productId > 0 && _productId <= productList.length, "Product ID does not exist.");
        Product storage product = productList[_productId - 1];
        // product.isAvailable = false;
        product.onSale = false;
    }

    function donateProduct(uint _productId, address _recipient) public ownerOnly {
        require(_productId > 0 && _productId <= productList.length, "Invalid product ID.");
        Product storage product = productList[_productId-1];
         require(product.donated == false, "Product has already been donated.");
        // require(product.isAvailable == true, "Product is not available for donation.");
        // Mark the product as donated
        product.donated = true;
        product.quantity = 0; // Set quantity to 0 as it's donated
        product.onSale = false; // Product should not be on sale after donation
        // product.isAvailable = false;//---------------------------

        emit ProductDonated(_productId, _recipient);
    }

    // 获取所有可用产品及其信息
    function getAvailableProducts() public view returns (Product[] memory) {
        uint length = 0;
        // 遍历产品列表，计算可用产品的数量
        for (uint i = 0; i < productList.length; i++) {
            if (productList[i].onSale) {
                length++;
            }
        }
        // 创建一个数组，用于存储可用产品的信息
        Product[] memory availableProducts = new Product[](length);
        uint index = 0;
        // 再次遍历产品列表，将可用产品的信息存储到数组中
        for (uint i = 0; i < productList.length; i++) {
            if (productList[i].onSale) {
                // 将产品结构体存储到数组中
                availableProducts[index++] = productList[i];
            }
        }
        // 返回包含所有可用产品信息的数组
        return availableProducts;
    }

    function getProductsByCategory(string memory _category) public view returns (Product[] memory) {
        // 用于存储与指定类别匹配的商品列表
        uint matchingProductsCount = 0;

        // 遍历产品列表，检查每个产品的类别
        for (uint i = 0; i< productList.length; i++) {
            if (keccak256(bytes(_category)) == keccak256(bytes(productList[i].category))) {
                // 如果产品类别与指定的类别匹配，增加匹配计数
                matchingProductsCount++;
            }
        }

        // 根据匹配的商品数量创建一个新的动态数组
        Product[] memory productsByCategory = new Product[](matchingProductsCount);
        uint index = 0;

        // 再次遍历产品列表，将匹配的商品添加到新数组中
        for (uint i = 0; i< productList.length; i++) {
            if (keccak256(bytes(_category)) == keccak256(bytes(productList[i].category))) {
                productsByCategory[index++] = productList[i];
            }
        }

        // 返回与指定类别匹配的商品列表
        return productsByCategory;
    }


    // 获取商品是否已捐赠状态
    function isProductDonated(uint _productId) public view returns (bool) {
        require(_productId > 0 && _productId <= productList.length, "Invalid product ID.");
        return productList[_productId - 1].donated;
    }

    // 修改商品的捐赠状态
    function setProductDonated(uint _productId, bool _donated) public ownerOnly {
        require(_productId > 0 && _productId <= productList.length, "Invalid product ID.");
        productList[_productId - 1].donated = _donated;
    }
 
    // 获取已经捐赠的商品列表
    function getDonatedProducts() public view returns (Product[] memory) {
        uint length = 0;
        // 遍历商品列表，计算已捐赠商品的数量
        for (uint i = 0; i < productList.length; i++) {
            if (productList[i].donated) {
                length++;
            }
        }

        // 创建一个数组，用于存储已捐赠商品的信息
        Product[] memory donatedProducts = new Product[](length);
        uint index = 0;
        // 再次遍历商品列表，将已捐赠商品的信息存储到数组中
        for (uint i = 0; i < productList.length; i++) {
            if (productList[i].donated) {
                // 将商品结构体存储到数组中
                donatedProducts[index++] = productList[i];
            }
        }

        // 返回包含所有已捐赠商品信息的数组
        return donatedProducts;
    }

    event ProductDonated(uint productId, address recipient);


    // 获取商家信息
    function getSellerInfo() public view returns (string memory, string memory, string memory) {
        return (sellerName, phone, sellerNo);
    }
    //  修改商家信息
    function modifySellerInfo(string memory _sellerName, string memory _phone, string memory _sellerNo) public ownerOnly {
        sellerName = _sellerName;
        phone = _phone;
        sellerNo = _sellerNo;
    }

   
   
    // 更新商家密码
    function updatePassword(string memory newPwd) public ownerOnly {
        password = stringToBytes32(newPwd);
    }
    // 检查密码是否正确
    function pwdRight(string memory _pwd) public view returns (bool) {
        return password == stringToBytes32(_pwd);
    }
    // 更新商家余额
    function updateBalance(int increment) public  {
        require(int(nowBalance) + increment > 0, "Insufficient balance.");
        nowBalance = uint(int(nowBalance) + increment);
    }
    // 获取商家余额
    function getBalance() public view  returns (uint) {
        return nowBalance;
    }

    //获取特定产品的价格 out
    function getProductPrice(uint _productId) public view returns (uint) {
        require(_productId > 0 && _productId <= productList.length, "Product ID does not exist.");
        return productList[_productId - 1].price;
    }

    function updateProductQuantity(uint _productId, uint _newQuantity) public {
        require(_productId > 0 && _productId <= productList.length, "Invalid product ID.");
        Product storage product = productList[_productId - 1];
        require(product.onSale, "Product is not available for update.");
        require(_newQuantity >= 0, "Quantity cannot be negative.");
        product.quantity = _newQuantity;
        if (_newQuantity == 0) {
            product.onSale = false;
        }
        emit ProductQuantityUpdated(_productId, _newQuantity);
    }

    // 事件声明，用于通知库存更新
    event ProductQuantityUpdated(uint productId, uint newQuantity);
    // 设置产品是否处于促销状态
    function setOnSale(uint id, bool onSale) public ownerOnly {
        require(id > 0 && id <= productList.length, "Invalid product ID.");
        Product storage product = productList[id - 1];
        product.onSale = onSale;
      
    }
    // 在 Seller 合约中添加此函数
    function isOnSale(uint _productId) public view returns (bool) {
        require(_productId > 0 && _productId <= productList.length, "Invalid product ID.");
        return productList[_productId - 1].onSale;
    }
    
    // 评价结构体
    struct Review {
        address reviewer;
        // address reviewee;
        string content;
        uint rating;//评级
        string imageHash;
        uint timestamp;
    }
    // 公开的评价列表
    Review[] public sellerReviews;
     function submitSellerReview(address _reviewer, string memory _content, uint _rating, string memory _imageHash) public {
        sellerReviews.push(Review({
            reviewer: _reviewer,
            content: _content,
            rating: _rating,
            imageHash: _imageHash,
            timestamp: block.timestamp
        }));
    }

    function getSellerReviews() public view returns (Review[] memory) {
        return sellerReviews;
    }


}

contract CustomerList is Utils {
    address[] public customerList;
    mapping(address => address) public creatorCustomerMap;

    // 创建一个新的买家，并将其地址添加到列表中。
    function createCustomer(string memory userName,  string memory password,string memory phone,string memory email,string memory gender, address payable  _erc20TokenAddress) public {
        address customerAccount = msg.sender;
        require(isNotRegistered(customerAccount), "Customer already registered.");
        address newCustomer = address(new Customer(customerAccount, userName, password, phone, email, gender, _erc20TokenAddress)); 
        customerList.push(newCustomer);
        creatorCustomerMap[customerAccount] = newCustomer;
        }
    // 获取所有买家的列表。
    function getCustomerList() public view returns (address[] memory) {
        return customerList;
    }

    // 检查给定地址是否未注册为买家。
    function isNotRegistered(address account) internal view returns (bool) {
        return creatorCustomerMap[account] == address(0);
    }

    // 检查给定地址是否是买家。
    function isCustomer(address customerAddr) public view returns (bool) {
        for (uint i = 0; i< customerList.length; i++) {
            if (customerAddr == customerList[i]) return true;
        }
        return false;
    }
    function verifyPwd(string memory userName, string memory password) public view returns (bool) {
            address creator = msg.sender;
            require(!isNotRegistered(creator), "Customer not registered.");
            address contractAddr = creatorCustomerMap[creator];
            Customer customer = Customer(contractAddr);
            return compareStrings(customer.customerName(), userName) && customer.pwdRight(password);
        }
}

contract Customer is Utils {
    address public owner;
    string public customerName;
    bytes32 private password;
    string public phone;
    string public email; // 添加邮箱字段
    string public gender;
    uint private nowBalance;
    
    ERC20 public erc20Token; // 添加ERC20合约地址
    // Product[] public productList;

  struct PurchaseOrder {
        address seller;
        uint productId;
        uint quantity;
        uint totalPrice;
        uint timestamp;
    }

    // Array to store purchase orders
    PurchaseOrder[] public purchaseOrders;


    constructor(address _owner, string memory _customerName, string memory _password,string memory _phone,string memory _email, string memory _gender, address payable _erc20TokenAddress )  {
        owner = _owner;
        customerName = _customerName;
          password = stringToBytes32(_password); 
        nowBalance = 1000; // 初始余额
        phone = _phone;
        email = _email; // 使用email替换_erc20TokenAddress参数
        gender = _gender; // 设置性别字段
        erc20Token = ERC20(_erc20TokenAddress); // 初始化ERC20合约地址
    }
       // Function to record a purchase order
    function recordPurchaseOrder(address _seller, uint _productId, uint _quantity, uint _totalPrice) internal {
        purchaseOrders.push(PurchaseOrder({
            seller: _seller,
            productId: _productId,
            quantity: _quantity,
            totalPrice: _totalPrice,
            timestamp: block.timestamp
        }));
    }

    // Function to get all purchase orders made by this customer
    function getPurchaseOrders() public view returns (PurchaseOrder[] memory) {
        return purchaseOrders;
    }
    

       // 检查密码是否正确
    function pwdRight(string memory _pwd) public view returns (bool) {
        return password == stringToBytes32(_pwd);
    }

    function buyProduct(address _sellerAddress, uint _productId, uint _quantity) public payable {
        // 检查商品数量和促销状态
        Seller sellerContract = Seller(_sellerAddress);
     
    
        // 计算订单总价
        uint totalPriceInTokens = _quantity * sellerContract.getProductPrice(_productId);  

    }

    // 事件声明，用于记录购买信息
    event PurchaseMade(address customer,address seller,uint productId,uint quantity, uint totalPrice,uint timestamp );
   

    // 顾客余额查询
    function getBalance() public view returns (uint) {
        return nowBalance;
    }

    // 顾客个人信息修改
    function updateCustomerInfo(string memory _customerName) public {
        customerName = _customerName;
    }
    struct Review {
        address reviewer;    // Reviewer's address
        string content;      // Review content
        uint rating;         // Review rating (e.g., 1-5 stars)
        string imageHash;    // Hash of uploaded image (optional)
        uint timestamp;      // Review timestamp
    }

    Review[] public customerReviews;

    function submitCustomerReview(address _reviewer, string memory _content, uint _rating, string memory _imageHash) public {
        customerReviews.push(Review({
            reviewer: _reviewer,
            content: _content,
            rating: _rating,
            imageHash: _imageHash,
            timestamp: block.timestamp
        }));
    }

    function getCustomerReviews() public view returns (Review[] memory) {
        return customerReviews;
    }
    //信用
    struct CreditHistory {
        uint score;
        uint timestamp;
    }

    mapping(address => CreditHistory[]) public creditHistories;

    function updateCreditScore(uint _newScore) public {
        creditHistories[msg.sender].push(CreditHistory({
            score: _newScore,
            timestamp: block.timestamp
        }));
    }

    function getCreditScore(address _customer) public view returns (uint) {
        return creditHistories[_customer].length > 0 ? creditHistories[_customer][creditHistories[_customer].length - 1].score : 0;
    }

    function getCreditHistory(address _customer) public view returns (CreditHistory[] memory) {
        return creditHistories[_customer];
    }
        uint public points;

    function earnPoints(uint _amount) public {
        points += _amount;
    }

    function spendPoints(uint _amount) public {
        require(points >= _amount, "Insufficient points.");
        points -= _amount;
        // 兑换商品或NFT的逻辑
    }

    function getPoints() public view returns (uint) {
        return points;
    }

    //发货、签收
    struct ShipmentDetails {
        address recipient;//接收者
        string addr;
        string status; // "pending", "shipped", "delivered"
        uint timestamp;
    }

    mapping(uint => ShipmentDetails) public shipmentDetails;

    
}

