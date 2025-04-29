import type { Billobj, Customer, Order } from "@/types/types";

const BASE_URL = process.env.NEXT_PUBLIC_HOST_URL || "http://localhost:8080";

function getAuthToken(): string {
  return localStorage.getItem("token") || "";
}

async function post<T>(endpoint: string, data?: any): Promise<T> {
  const token = getAuthToken();

  const headers: HeadersInit = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `${token}`
  };

  try {
    const response = await fetch(BASE_URL + endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`POST request failed at ${endpoint}:`, error);
    throw error;
  }
}

async function get<T>(endpoint: string): Promise<T> {
  const token = getAuthToken();

  const headers: HeadersInit = {
    Accept: "application/json",
    Authorization: `${token}`
  };

  try {
    const response = await fetch(BASE_URL + endpoint, {
      method: "GET",
      headers
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`GET request failed at ${endpoint}:`, error);
    throw error;
  }
}
async function getBlob(endpoint: string) {
  const token = getAuthToken();

  const headers: HeadersInit = {
    Accept: "application/json",
    Authorization: `${token}`
  };

  try {
    const response = await fetch(BASE_URL + endpoint, {
      method: "GET",
      headers
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.blob();
  } catch (error) {
    console.error(`GET request failed at ${endpoint}:`, error);
    throw error;
  }
}
async function getCheck(endpoint: string) {
  const token = getAuthToken();

  const headers: HeadersInit = {
    Accept: "application/json",
    Authorization: `${token}`
  };
  const response = await fetch(BASE_URL + endpoint, {
    method: "GET",
    headers
  });
  return response;
}
export async function addNewOrder(order: Order): Promise<any> {
  return post("/order/addNewOrder", order);
}

export async function getOrdersByCustomerId(custId: string): Promise<any> {
  return get(`/order/getOrdersByCustId/${custId}`);
}

export async function getOrderById(orderId: string): Promise<any> {
  return get(`/order/getOrderByOrderId/${orderId}`);
}

export async function generateBill(billObj: Billobj): Promise<any> {
  return post("/order/genrateBill", billObj);
}
export async function downloadRecipt(orderId: string) {
  return getBlob(`/order/downloadReceipt/${orderId}`);
}
export async function editCustomer(cust: Customer): Promise<any> {
  return post("/customers/editCustomer", cust);
}
export async function custMobileCheck(mobile: Customer["mobileNo"]) {
  return getCheck(`/customers/custMobileCheck/${mobile}`);
}
export async function custEmailCheck(email: Customer["email"]) {
  return getCheck(`/customers/custEmailCheck/${email}`);
}
