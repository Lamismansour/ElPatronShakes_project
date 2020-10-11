import Mustache from '../external/mustache';
import * as css from '../CSS/product.css'
import { parseInt } from 'lodash';

$(document).ready(function(){
	let inputQty , sizeSelect; 
	let productId=parseInt((window.location.search).substring(4));
	getProduct();
	async function getProduct(){
		let data = await $(".selectedProductName").shakesPluginService().getSelectedProduct();
		if(data != undefined && data.length > 0 && data[0].name != undefined) {
			$( ".selectedProductName").html(data[0].name);
		}
	}
	$('.qty').on('input', function() {
		let qtyVal =$(this).val();
		qtyVal= parseInt(qtyVal);
		inputQty = qtyVal; 
	});
	$("#drinkSize").on('change' ,function() {
		let drinkSize =$(this).val();
			sizeSelect= drinkSize; 
	});
	$(".addToCartLink").on('click', function() {
		let orderItem = [];
		orderItem = {
				"id" : productId,
				"quantity" : inputQty,
				"size" : sizeSelect
		}
		if(inputQty != undefined && sizeSelect != undefined){
			let order = $('.productBoxLinks').shakesPluginService().addProductToCart(orderItem);
		}
	});
});
