import Mustache from '../external/mustache';
import * as css from '../CSS/menu.css'


$(document).ready(function(){
	var data = $('.menuBox').shakesPluginService().getAllProducts(); 
	var template ="{{#.}}" + "<div class='productMenuBox'>"
		+ "<h2 class='productName'>{{name}}</h2>"
		+ "<img class='menuImg' src= ./images/product_{{id}}.jpg>"
		+ "<a href='./product.html?id={{id}}' class ='orderProductLink'>order</a>"
		+ "</div>" + "{{/.}}";
	$('.menuBox').append(Mustache.render(template, data));	
});

