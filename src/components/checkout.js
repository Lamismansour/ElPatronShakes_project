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
            "fisrtName": firstName,
            "lastName":lastName,
            "email":email,
            "address":address,
            "city":city,
            "phone": phone
        }
        // before submitting check if all properties were filled
        let isUserValid = checkProperties(user)
        function checkProperties(user) {
            for (var key in user) {
                console.log((user[key]));
                if (user[key] === null || user[key] == "" || user[key] == undefined )
                    return false;
            }
            return true;
        }
        if(isUserValid == true){
            let data = $(".userFormContainer").shakesPluginService().createUserInfo(user);
        }
    });   
});