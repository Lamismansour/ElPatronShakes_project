import * as css from '../CSS/checkout.css';

$(document).ready(function(){
    let firstName, lastName , email , address, city, phone;
    $('#firstName').on('input', function(){firstName =$(this).val()});
    $('#lastName').on('input', function(){lastName = $(this).val()});
    $('#email').on('input', function() {email = $(this).val()});
    $('#address').on('input', function() {address = $(this).val()});
    $('#city').on('input', function() {city = $(this).val()});
    $('#phone').on('input', function() {phone = $(this).val()});
    $(".checkoutBtn").on("click" , function(){ 
        let user = {
            "fullName": firstName + ' ' + lastName,
            "email":email,
            "address":address + ',' +  city,
            "phone": phone
        }
        if(!$.isEmptyObject(user)){
            let data = $(".userFormContainer").shakesPluginService().createUserInfo(user);
        }
    });   
});