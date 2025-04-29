const LOCAL_CUSTINFO_KEY = "customer_info";
 const LOCAL_SHIPPING_KEY = "shippingAddressID";
const LOCAL_TOKEN_KEY = "token";
export { LOCAL_CUSTINFO_KEY, LOCAL_SHIPPING_KEY, LOCAL_TOKEN_KEY };


export const GetUser = async () => {
    return localStorage.getItem(LOCAL_CUSTINFO_KEY);
}