import Mustache from '../external/mustache';
import * as css from '../CSS/cart.css';

$(document).ready(function(){
    let userTokenId = JSON.parse(sessionStorage.getItem('userTokenId'));
    if(userTokenId != null) {  
        let data = $('.cartBox').shakesPluginService().getOrder(userTokenId);
        data = JSON.parse(data.responseJSON);
        let template = "{{#.}}" 
        + "<div class='productBlock'>"
        + "<p class='menuProductName'><img class='cartImg' src='./images/product_{{id}}.png' class='drinkIcon'> {{productName}} ,  &nbsp;    {{size}} <span class='itemPriceRight'> {{quantity}} X &nbsp;   {{itemPrice}} ₪ </span> </p>"
        + "</div> {{/.}}";
        $('.cartBox').append(Mustache.render(template, data.orderItem));
        let totalPrice = null;
        for(let i =0; i<data.orderItem.length; i++){
            totalPrice += data.orderItem[i].totalItemPrice;
        }
        $( ".calculatedTotalPrice").html(totalPrice + "₪");
    }
    if(userTokenId == null){
        $('.cartBox').html("Your cart is Empty! Go to menu and check the great drinks we have for you!")
        $( ".totalPriceBox").html("");
        $('.deliveryOrPickupLink').hide();
    }
});
