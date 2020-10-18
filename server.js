const jsonServer = require("json-server");
const server = jsonServer.create();
const _ = require('lodash')
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
const shortid = require('shortid')

const middlewares = jsonServer.defaults();
const router = jsonServer.router("./db.json");
server.use(jsonServer.bodyParser);

const cors = require('cors');
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
    //Post requests from the service are handled here
    //Post requests updates/creates the order object with orderId, userTokenId, orderStatus, userID, orderItem and deliveryOrPickup
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
    //Get products, order and user from database and send the responce to the calles from the service 
        if(req.method== 'GET'){
            if(_.isEmpty(req.query)) {
                let allProducts = db.get('products').value();
                res.status(200).json(JSON.stringify(allProducts));
                return;
            }
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
                    let userName = getUser.fisrtName;
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
//finds if there is an open order for userTokenId
//if exist return the order object
function isOrderExist(userTokenId){
    let orders = db.get('orders') 
    let userOrder = orders.find({'userTokenId': userTokenId }).value(); 
    return userOrder;
}
//-----
//add order item to the order and add total price for this item
//if the orderItem already  exist in the orderItem array (product with the same id and size) update the quantity and total price for this item
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
//for each orderItem add the price of the selected product based on the selected size using the price object from database
function updateOrderItemPrice(orderItem){
    let itemSize = orderItem[0].size;
    let itemQuantity = orderItem[0].quantity;
    let price = db.get('prices').find({'size': itemSize }).value();
    itemPrice= price.price;
    let totalItemPrice = itemPrice * itemQuantity; 
    return Object.assign(orderItem[0] , {itemPrice : itemPrice}, {totalItemPrice:totalItemPrice});
}
//-----
//find if the user exists in the database based on the phone number submitted by the user.
//if the user does not exist the function generates a new userId and save the data
//if the user exists the function returns the current userId
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