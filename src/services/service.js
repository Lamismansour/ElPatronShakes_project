
import '../components/index';
import '../components/menu';
import '../components/product';
import '../components/cart';
import '../components/deliveryOrPickup';
import '../components/checkout';
import '../components/Confirmation';
import '../components/messageUs';
import { v4 as uuidv4 } from 'uuid';
import "regenerator-runtime/runtime.js";

//--create a custome plugin to be used as a service to handle all requests to the server
(function ($) {
    $.fn.shakesPluginService = function () {
        //--the products object is stored in the browser local storage
        this.fillProducts = function () {
            $.ajax({
                url: "http://localhost:3000/products",
                async: false,
                contentType: 'application/json',
                type: 'GET',
                success: function (result) {
                    //--convert result to string and then store in the local storage
                    localStorage.setItem('products', JSON.stringify(result));
                    let productsLocalStorage = JSON.parse(localStorage.getItem('products'));
                    return productsLocalStorage;
                },
            });
        };
        //--getAllProducts functions gets products object from the local storage
        this.getAllProducts =  function () {
            let allProducts = null;
            if (!localStorage.getItem('products')) {
                allProducts = this.fillProducts();
            };
            allProducts = JSON.parse(localStorage.getItem('products'));
            return allProducts;
        };
        //--The getSelectedProduct function gets the selected product by id
        this.getSelectedProduct = async function () {
            let queryStringId = (window.location.search).substring(4);
            let allProducts = null;
            if (!localStorage.getItem('products')) {
                allProducts = this.fillProducts();
            };
            allProducts = JSON.parse(localStorage.getItem('products'));
            return allProducts.filter(function (allProducts) {
                return allProducts.id == queryStringId
            });
        };
        //-- add ordered products by userTokenId to cart
        //-- each cart lists all items by name and quantity and the item price
        //--the total price is presented in the cart
        this.addProductToCart = function(orderItem){
            if(!sessionStorage.getItem('userTokenId')){
                let userTokenId =null;
                userTokenId = uuidv4();
                sessionStorage.setItem('userTokenId',JSON.stringify(userTokenId));
            }
            let userTokenId = JSON.parse(sessionStorage.getItem('userTokenId'));
            $.ajax({
                type:'POST',
                crossDomain: true,
                url: "http://localhost:3000/orders",
                async: false, 
                data: JSON.stringify({"userTokenId" : userTokenId, "orderItem" : [orderItem]}),
                contentType: 'application/json',
                success: function (result) {               
                    return result;
                },
                error:function(error){
                }
            });
        }// get order info and update the cart page
        this.getOrder = function(userTokenId) {
            return $.ajax({
                type: 'GET',
                url: ("http://localhost:3000/orders?userTokenId="+ userTokenId),  
                async: false,
                contentType: 'application/json',
                success: function (result) {
                    return result;
                },
            });
        }
        // update order with the delivery or pickup option selected by the cusotmer  
        this.updateOrder = function(deliveryOrPickup){
            let userTokenId = JSON.parse(sessionStorage.getItem('userTokenId'));
            $.ajax({
                type:'POST',
                crossDomain: true,
                url: "http://localhost:3000/orders",
                async: false, 
                data: JSON.stringify({"deliveryOrPickup": deliveryOrPickup, "userTokenId" : userTokenId}),
                contentType: 'application/json',
                success: function (result) {               
                    return result;
                },
                error:function(error){
                    console.log(error);
                }
            });
        }
        // create user object with the customer information and update the existing order with user info
        this.createUserInfo = function(user){
            let userTokenId = JSON.parse(sessionStorage.getItem('userTokenId'));
            $.ajax({
                type:'POST',
                crossDomain: true,
                url: "http://localhost:3000/users",
                async: false, 
                data: JSON.stringify({"user": user, "userTokenId" : userTokenId}),
                contentType: 'application/json',
                success: function (result) {               
                    return result;
                },
                error:function(error){
                    console.log(error);
                }
            });
        }
        return this;
    };
})(jQuery);

