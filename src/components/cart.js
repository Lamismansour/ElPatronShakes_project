import Mustache from '../external/mustache';
import * as css from '../CSS/cart.css';

$(document).ready(function(){
    let userTokenId = JSON.parse(sessionStorage.getItem('userTokenId'));
    if(userTokenId != null) {  
        let data = $('.cartBox').shakesPluginService().getOrder(userTokenId);
        data = JSON.parse(data.responseJSON);
        let template = "{{#.}}" 
        + "<div class='productBlock'>"
        + "<p class='menuProductName'> {{quantity}} X {{productName}} , {{size}} {{itemPrice}} ₪ </p>"
        + "</div> {{/.}}";
        $('.cartBox').append(Mustache.render(template, data.orderItem));
        let totalPrice = null;
        for(let i =0; i<data.orderItem.length; i++){
            totalPrice += data.orderItem[i].totalItemPrice;
        }
        $( ".calculatedTotalPrice").html(totalPrice + "₪");
    }
    if(userTokenId == null){
        $('.cartBox').html("Your cart is still Empty! Go to the menu and get shopping!")
        $( ".totalPriceBox").html("");
        $('.deliveryOrPickupLink').hide();
    }
});
