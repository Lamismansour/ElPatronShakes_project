import * as css from '../CSS/Confirmation.css';

$(document).ready(function(){
    let userTokenId = JSON.parse(sessionStorage.getItem('userTokenId'));
    if(userTokenId != null) {   
        let data =  $('.cartBox').shakesPluginService().getOrder(userTokenId);
        data = JSON.parse(data.responseJSON);
        let userName = data.userName;
        let orderId = data.id;
        $('.userName').html(userName);
        $('.orderId').html(orderId);
    }
});