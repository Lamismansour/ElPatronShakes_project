const jsonServer = require("json-server");
const server = jsonServer.create();
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
const shortid = require('shortid')

const middlewares = jsonServer.defaults();
const router = jsonServer.router("./db.json");
server.use(jsonServer.bodyParser);

const cors = require('cors');
const { compilation } = require("webpack");
server.use(
    cors({
        origin: '*',
        credentials: true,
        preflightContinue: false,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    })
);

// Custom middleware to access methods.
server.use((req, res, next) => {
    const body = req.body;
    let userTokenId = body.userTokenId;
    let orderItem = body.orderItem;
    let deliveryOrPickup = body.deliveryOrPickup;
    let user = body.user;
    if (req.method == "POST") {
        if((orderItem != undefined)) {
            let orderItemPrice = updateOrderItemPrice(orderItem);
            let orders = db.get('orders');
            let userOrder = isOrderExist(userTokenId); 
            if(userOrder){
                addOrderItem(userOrder, body)
            }
            else{
                Object.assign(body , {orderStatus : "Not Paid"});
                let orderId = shortid.generate();
                Object.assign(body, {id : orderId}) 
                orders.push(body).write();
            }           
        }
        if(deliveryOrPickup != undefined) {
            let orders = db.get('orders');
            orders.find({'userTokenId':userTokenId}).assign({deliveryOrPickup}).write()
        }
        if(user != undefined){
            let existUser =  isUserExist(user);
            let userId = existUser.userId;
            let orders = db.get('orders');
            orders.find({'userTokenId':userTokenId}).assign({'userId':userId},{orderStatus : "Approved"}).write()
        }
    }
    else{
        if(req.method== 'GET'){
            let userTokenId = req.query.userTokenId;
            let result = db.get('orders').find({'userTokenId': userTokenId }).value(); 
            let userId = result.userId;
            if(result != 'null' ){
                for(let i=0; i < result.orderItem.length; i++){
                    resultId = result.orderItem[i].id;
                    let product = db.get('products').find({'id': resultId}).value();
                    let productName = null;
                    productName = product.name;
                    Object.assign(result.orderItem[i] , {'productName' : productName})
                }
                if(userId != null){
                    let getUser = db.get('users').find({'userId': userId}).value();
                    let userName = getUser.fullName;
                    Object.assign(result , {'userName' : userName})
                }
                res.status(200).json(JSON.stringify(result));
                return;
            }

        }
    }
    let result = db.get('orders').find({'userTokenId': body.userTokenId }).value(); 
    res.status(200).json(JSON.stringify(result));
    return;
});
//-----
function isOrderExist(userTokenId){
    let orders = db.get('orders') 
    let userOrder = orders.find({'userTokenId': userTokenId }).value(); //finds if there is an open order for userTokenId
    return userOrder;
}
//-----
function addOrderItem(userOrder, body){
    let userTokenId = body.userTokenId;
    let orderItem = body.orderItem;
    let orders = db.get('orders');
    for(let i=0; i < userOrder.orderItem.length; i++) {
        if((userOrder.orderItem[i].id == body.orderItem[0].id) && (userOrder.orderItem[i].size == body.orderItem[0].size )) {
            userOrder.orderItem[i].quantity += body.orderItem[0].quantity; 
            userOrder.orderItem[i].totalItemPrice = userOrder.orderItem[i].quantity * userOrder.orderItem[i].itemPrice;
            orders.find({'userTokenId': userTokenId }).push({'orderItem' : orderItem}).write();
            return ;
        }
    }
    let item = userOrder.orderItem.push(body.orderItem[0]);
    orders.find({'userTokenId': userTokenId }).push({'orderItem' : item}).write();
}
//-----
function updateOrderItemPrice(orderItem){
    let itemSize = orderItem[0].size;
    let itemQuantity = orderItem[0].quantity;
    let price = db.get('prices').find({'size': itemSize }).value();
    itemPrice= price.price;
    let totalItemPrice = itemPrice * itemQuantity; 
    return Object.assign(orderItem[0] , {itemPrice : itemPrice}, {totalItemPrice:totalItemPrice});
}
//-----
function isUserExist(user){
    let users = db.get('users')
    let phone = user.phone;
    let userInfo = users.find({'phone': phone }).value();
    if(!userInfo){
        let userId = shortid.generate();
        Object.assign(user, {userId : userId}) 
        users.push(user).write();
    }
    else{
        let existId = userInfo.userId;
        Object.assign(user, {userId : existId})
    }
    return user;
}

server.use(middlewares);
server.use('/orders', router);
server.listen(3000, () => {
  console.log("JSON Server is running");
});