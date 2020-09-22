import '../components/index';
import '../components/menu'; 

(function($) {
    $.fn.shakesPluginService = function() {
        this.getAllProducts=function() {
            if(!localStorage.getItem('products')){
                $.ajax({
                    url: "http://localhost:3000/products", 
                    async: false, 
                    contentType: 'application/json',
                    type:'GET',
                    success: function (result) {
                        // convert result to string and then store in the local storage
                        localStorage.setItem('products',JSON.stringify(result));
                        productsLocalStorage = JSON.parse(localStorage.getItem('products'));
                        return productsLocalStorage;
                    },
                });

            };
            var productsLocalStorage = JSON.parse(localStorage.getItem('products'));
            return productsLocalStorage;
        }
        return this;
    };

})(jQuery);
