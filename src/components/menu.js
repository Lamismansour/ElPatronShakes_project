import Mustache from '../external/mustache';
import * as css from '../CSS/menu.css'

$(document).ready(function(){
	let data =  $('.menuBox').shakesPluginService().getAllProducts();
	let template ="{{#.}}" + "<div class='productMenuBox'>"
		+ "<img class='menuImg' src= ./images/product_{{id}}.png>"
		+ "<label class='productName'><img src='./images/drinkIcon.png' class='drinkIcon'>{{name}}</label>"
		+ "<a href='./product.html?id={{id}}' class ='orderProductLink'>order</a>"
		+ "</div>" + "{{/.}}";
	$('.menuBox').append(Mustache.render(template, data));
});

 