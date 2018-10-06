/**
 * Module to add a shipping rates calculator to cart page.
 *
 * Copyright (c) 2011-2014 Caroline Schnapp (11heavens.com)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */
"object"==typeof Countries&&(Countries.updateProvinceLabel=function(e,t){if("string"==typeof e&&Countries[e]&&Countries[e].provinces){if("object"!=typeof t&&null===(t=document.getElementById("address_province_label")))return;t.innerHTML=Countries[e].label;var r=jQuery(t).parent(),n=r.find("select");r.find(".custom-style-select-box-inner").html(Countries[e].provinces[0])}}),void 0===Shopify.Cart&&(Shopify.Cart={}),Shopify.Cart.ShippingCalculator=function(){var _config={submitButton:"Calculate shipping",submitButtonDisabled:"Calculating...",templateId:"shipping-calculator-response-template",wrapperId:"wrapper-response",customerIsLoggedIn:!1,moneyFormat:"${{amount}}"},_render=function(e){var t=jQuery("#"+_config.templateId),r=jQuery("#"+_config.wrapperId);if(t.length&&r.length){var n,a=_.template(jQuery.trim(t.text()))(e);if(jQuery(a).appendTo(r),"undefined"!=typeof Currency&&"function"==typeof Currency.convertAll){var i="";jQuery("[name=currencies]").size()?i=jQuery("[name=currencies]").val():jQuery("#currencies span.selected").size()&&(i=jQuery("#currencies span.selected").attr("data-currency")),""!==i&&Currency.convertAll(shopCurrency,i,"#wrapper-response span.money, #estimated-shipping span.money")}}},_enableButtons=function(){jQuery(".get-rates").removeAttr("disabled").removeClass("disabled").val(_config.submitButton)},_disableButtons=function(){jQuery(".get-rates").val(_config.submitButtonDisabled).attr("disabled","disabled").addClass("disabled")},_getCartShippingRatesForDestination=function(t){var e={type:"GET",url:"/cart/shipping_rates.json",data:jQuery.param({shipping_address:t}),dataType:"json",success:function(e){rates=e.shipping_rates,_onCartShippingRatesUpdate(rates,t)},error:function(e,t){_onError(e,t)}};jQuery.ajax(e)},_fullMessagesFromErrors=function(e){var n=[];return jQuery.each(e,function(r,e){jQuery.each(e,function(e,t){n.push(r+" "+t)})}),n},_onError=function(XMLHttpRequest,textStatus){jQuery("#estimated-shipping").hide(),jQuery("#estimated-shipping em").empty(),_enableButtons();var feedback="",data=eval("("+XMLHttpRequest.responseText+")");feedback=data.message?data.message+"("+data.status+"): "+data.description:"Error : "+_fullMessagesFromErrors(data).join("; "),"Error : country is not supported."===feedback&&(feedback="We do not ship to this destination."),_render({rates:[],errorFeedback:feedback,success:!1}),jQuery("#"+_config.wrapperId).show()},_onCartShippingRatesUpdate=function(e,t){_enableButtons();var r="";if(t.zip&&(r+=t.zip+", "),t.province&&(r+=t.province+", "),r+=t.country,e.length){"0.00"==e[0].price?jQuery("#estimated-shipping em").html("FREE"):jQuery("#estimated-shipping em").html(_formatRate(e[0].price));for(var n=0;n<e.length;n++)e[n].price=_formatRate(e[n].price)}_render({rates:e,address:r,success:!0}),jQuery("#"+_config.wrapperId+", #estimated-shipping").fadeIn()},_formatRate=function(e){function s(e,t){return void 0===e?t:e}function t(e,t,r,n){if(t=s(t,2),r=s(r,","),n=s(n,"."),isNaN(e)||null==e)return 0;var a=(e=(e/100).toFixed(t)).split("."),i,o;return a[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g,"$1"+r)+(a[1]?n+a[1]:"")}if("function"==typeof Shopify.formatMoney)return Shopify.formatMoney(e,_config.moneyFormat);"string"==typeof e&&(e=e.replace(".",""));var r="",n=/\{\{\s*(\w+)\s*\}\}/,a=_config.moneyFormat;switch(a.match(n)[1]){case"amount":r=t(e,2);break;case"amount_no_decimals":r=t(e,0);break;case"amount_with_comma_separator":r=t(e,2,".",",");break;case"amount_no_decimals_with_comma_separator":r=t(e,0,".",",");break}return a.replace(n,r)};return _init=function(){new Shopify.CountryProvinceSelector("address_country","address_province",{hideElement:"address_province_container"});var e=jQuery("#address_country"),t=jQuery("#address_province_label").get(0);"undefined"!=typeof Countries&&(Countries.updateProvinceLabel(e.val(),t),e.change(function(){Countries.updateProvinceLabel(e.val(),t)})),jQuery(".get-rates").click(function(){_disableButtons(),jQuery("#"+_config.wrapperId).empty().hide();var e={};e.zip=jQuery("#address_zip").val()||"",e.country=jQuery("#address_country").val()||"",e.province=jQuery("#address_province").val()||"",_getCartShippingRatesForDestination(e)}),_config.customerIsLoggedIn&&jQuery(".get-rates:eq(0)").trigger("click")},{show:function(e){e=e||{},jQuery.extend(_config,e),jQuery(function(){_init()})},getConfig:function(){return _config},formatRate:function(e){return _formatRate(e)}}}();