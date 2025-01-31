'use strict';

$(document).ready(function () {
    var checkoutButton = document.querySelector('fast-checkout-button');
    var checkoutFastButton = $('#fastProductCheckoutButton');
    var fastQuickviewCheckoutButton = $('#fastQuickviewCheckoutButton');
    var qty = document.querySelector('.quantity-select');
    var isQuickViewModalOpen = false;
    
    if (!checkoutFastButton.attr('disabled')) {
        checkoutFastButton.removeClass('fast-checkout');
    }

    $('body').on('product:updateAddToCart', function (e, response) {
        var isQuickViewModalOpen = document.querySelector('#quickViewModal') != null ? document.querySelector('#quickViewModal').classList.contains('show') : false,
            isEditProductModalOpen = document.querySelector('#editProductModal') != null ? document.querySelector('#editProductModal').classList.contains('show') : false,
            quickviewQty = 1;
            
        if (isQuickViewModalOpen || isEditProductModalOpen) {
            checkoutFastButton = $('#fastQuickviewCheckoutButton');
            
            if ( checkoutFastButton !== null && checkoutFastButton.length > 0) {
                
                checkoutFastButton.on('click', function() {
                    if (isQuickViewModalOpen) {
                    	quickviewQty = parseInt( $('#quickViewModal .quantity-select').find(":selected").val().trim() );
                    }
                    
                    if (isEditProductModalOpen) {
                    	quickviewQty = parseInt( $('#editProductModal .quantity-select').find(":selected").val().trim() );
                    }
                    
                    
                    Fast.checkout({
                        appId: checkoutFastButton.attr('app_id'),
                        buttonId: event.target.id,
                        products: [
                            {
                                id: checkoutFastButton.attr('product_id'),
                                variantId: checkoutFastButton.attr('product_id'),
                                quantity: quickviewQty
                            }
                        ],
                    })
                });
                
            }
            
        }
        
        checkoutFastButton.attr('disabled', (!response.product.readyToOrder || !response.product.available));
        checkoutFastButton.attr('product_id', response.product.id);
        addEventToFastButton(response);
    });

    if (typeof Fast !== 'function') {
        console.error('Fast not loaded, please reload the page and try again.');
        return false;
    }

    if ( checkoutButton !== null && $(checkoutButton).length > 0) {
        
        checkoutButton.addEventListener('click', event => {
            Fast.checkout({
                appId: checkoutButton.getAttribute('app_id'),
                buttonId: event.target.id,
                products: [
                    {
                        id: checkoutButton.getAttribute('product_id'),
                        variantId: checkoutButton.getAttribute('product_id'),
                        quantity: qtyValuesFromProduct()
                    }
                ],
            })
        });
    
    }


    function qtyValuesFromProduct() {
        var selectedQty;
        if(qty.options){
            Array.from(qty.options).forEach(function (optionElement) {
                var isOptionSelected = optionElement.value;

                if (optionElement.selected) {
                    selectedQty = isOptionSelected;
                    return false;
                }
            });
        } else if(qty.value){
            selectedQty = qty.value;
        }
        return parseInt(selectedQty);
    }

    function addEventToFastButton(result) {
        if (result.product.readyToOrder && result.product.available) {
            checkoutFastButton.addClass('fast-checkout-enabled');
            checkoutFastButton.removeClass('fast-checkout');
        } else {
            checkoutFastButton.addClass('fast-checkout');
            checkoutFastButton.removeClass('fast-checkout-enabled');
        }
    }
});

//WIP for this file, need more work on the future for different type of products.