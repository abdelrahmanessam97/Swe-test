const checkoutEndpoints = {
  NewBillingAddress: "/api-frontend/Checkout/NewBillingAddress",
  selectShippingMethod: "/api-frontend/Checkout/SelectShippingMethod?shippingOption=Flat Rate___Shipping.FixedByWeightByTotal",
  selectPaymentMethod: "/api-frontend/Checkout/SelectPaymentMethod?paymentMethod=Payments.CashOnDelivery",
  confirmOrder: "/api-frontend/Checkout/ConfirmOrder",
};

export default checkoutEndpoints;
