import * as css from '../CSS/deliveryOrPickup.css';

$(document).ready(function(){
    let deliveryOrPickup = null;
    $(".deliveryLink").on("click" , function() {
        deliveryOrPickup = "delivery"
        addDeliveryOrPickup(deliveryOrPickup);
    }) 
    $(".pickUpLink").on("click" , function() {
        deliveryOrPickup = "pickUp"      
        addDeliveryOrPickup(deliveryOrPickup);
    })
    function addDeliveryOrPickup(deliveryOrPickup){
        let data = $(".deliveryBox").shakesPluginService().updateOrder(deliveryOrPickup);
        window.location.assign('./checkout.html')
        
    }
});