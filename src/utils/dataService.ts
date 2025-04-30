// Define API base URLs
const LOCAL_URL = process.env.NEXT_PUBLIC_HOST_URL || "http://localhost:8080";
const BASE_URL = LOCAL_URL;

// Define headers
const headers: HeadersInit = {
  Accept: "application/json",
  "Content-Type": "application/json"
};

// Define types for requests and responses
export interface Address {
  addressId?: number; // Optional if it's auto-generated
  custID: number;
  country: string;
  state: string;
  city: string;
  dist: string;
  pinCode: string;
  fullAddress: string;
}

interface Customer {
  customerId?: string; // Optional if it's auto-generated using UUID
  name: string;
  mobileNo: string;
  gender?: string;
  dob?: string;
  birthplace?: string;
  reportType?: string;
  language?: string;
  email?: string;
  otp?: number;
}

interface Billobj {
  orderId: string;
  custId: string;
  amount: number;
  discountApplied?: boolean;
  discountPercent?: string;
  couponId?: string;
  modeId?: number;
  paymentType?: string;
  razPaymentId: string;
}
interface Case {
  caseId?: string;
  customerId: string;
  description: string;
  status: string;
  [key: string]: any;
}

interface Product {
  id: string;
  name: string;
  price: any;
  category: string;
  [key: string]: any;
}

// Helper functions
async function get<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(BASE_URL + endpoint, { headers });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("GET request failed:", error);
    return [] as unknown as T; // Return empty array or appropriate default value
  }
}

async function post<T>(endpoint: string, data: any): Promise<T> {
  try {
    const response = await fetch(BASE_URL + endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("POST request failed:", error);
    throw error;
  }
}

// API service methods
export async function getAllBestSellingProducts(): Promise<Product[]> {
  try {
    const data = await get<Product[]>("/product/getAllBestSellingProdList");
    // Ensure we have a valid array
    if (!Array.isArray(data)) {
      console.error("Expected array of products but got:", typeof data);
      return [];
    }
    return data;
  } catch (error) {
    console.error("Failed to fetch best selling products:", error);
    return [];
  }
}
export async function getAllBestSellingProductsByBrand(): Promise<Product[]> {
  try {
    const data = await get<Product[]>("/product/getAllProductByBrand/51");
    // Ensure we have a valid array
    if (!Array.isArray(data)) {
      console.error("Expected array of products but got:", typeof data);
      return [];
    }
    return data;
  } catch (error) {
    console.error("Failed to fetch best selling products:", error);
    return [];
  }
}
export async function getAllBrands(): Promise<string[]> {
  try {
    const data = await get<string[]>("/product/getAllBrands");
    if (!Array.isArray(data)) {
      console.error("Expected array of brands but got:", typeof data);
      return [];
    }
    return data;
  } catch (error) {
    console.error("Failed to fetch brands:", error);
    return [];
  }
}

export async function getAllBestSellingProdByCatId(
  id: string
): Promise<Product[]> {
  try {
    const data = await get<Product[]>(
      `/product/getAllBestSellingProdListByCat/${id}`
    );
    if (!Array.isArray(data)) {
      console.error("Expected array of products but got:", typeof data);
      return [];
    }
    return data;
  } catch (error) {
    console.error(
      `Failed to fetch best selling products for category ${id}:`,
      error
    );
    return [];
  }
}

export async function getAllCategory(): Promise<string[]> {
  try {
    const data = await get<string[]>("/product/getProductCategoryList");
    if (!Array.isArray(data)) {
      console.error("Expected array of categories but got:", typeof data);
      return [];
    }
    return data;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

export async function getProductById(Id: string): Promise<Product> {
  return get<Product>(`/product/getProductById/${Id}`);
}

export async function getProductByCatId(catId: string): Promise<Product[]> {
  try {
    const data = await get<Product[]>(`/product/getProductByCat/${catId}`);
    if (!Array.isArray(data)) {
      console.error("Expected array of products but got:", typeof data);
      return [];
    }
    return data;
  } catch (error) {
    console.error(`Failed to fetch products for category ${catId}:`, error);
    return [];
  }
}

export async function getBrandsByCat(catId: string): Promise<string[]> {
  try {
    const data = await get<string[]>(`/product/getBrandByCatId/${catId}`);
    if (!Array.isArray(data)) {
      console.error("Expected array of brands but got:", typeof data);
      return [];
    }
    return data;
  } catch (error) {
    console.error(`Failed to fetch brands for category ${catId}:`, error);
    return [];
  }
}

export async function getProductByBrandId(brandId: string): Promise<Product[]> {
  try {
    const data = await get<Product[]>(
      `/product/getAllProductByBrand/${brandId}`
    );
    if (!Array.isArray(data)) {
      console.error("Expected array of products but got:", typeof data);
      return [];
    }
    return data;
  } catch (error) {
    console.error(`Failed to fetch products for brand ${brandId}:`, error);
    return [];
  }
}
export async function getProductMedia(id: string): Promise<any> {
  return get(`/product/getProductMediaaByProductId/${id}`);
}
export async function saveAddress(address: Address): Promise<any> {
  return post("/address/addNewAddress", address);
}
export async function getAddress(userId: string): Promise<any> {
  return get(`/address/getAllAddressOfCust?userId=${userId}`);
}

export async function saveCustomer(customer: Customer): Promise<any> {
  return post("/customers/createCustomer", customer);
}

export async function sendOTP(user: any): Promise<any> {
  return post("/otp/generateOtp", user);
}
export async function VerifyOTP(User: any): Promise<any> {
  return post("/login", User);
}

export async function getAddressByDetails(details: any): Promise<any> {
  return post("/customer/addCustomer", details);
}


export async function generateBill(billObj: Billobj): Promise<any> {
  return post("/order/genrateBill", billObj);
}

export async function createCase(caseObj: Case): Promise<any> {
  return post("/cases/create/case", caseObj);
}

export async function updateCase(caseObj: Case): Promise<any> {
  return post("/cases/updateById", caseObj);
}

export async function getCasesByCustID(custID: string): Promise<Case[]> {
  return get<Case[]>(`/cases/customer/${custID}`);
}

export async function getCustomerByID(custID: string): Promise<Customer> {
  return get<Customer>(`/customers/getCutomer/${custID}`);
}

export async function getChatByCaseID(caseID: string): Promise<any[]> {
  return get<any[]>(`/message/getChatsByCaseID/${caseID}`);
}

export async function sendMsg(message: any): Promise<any> {
  return post("/message/createMessage", message);
}

export async function handleSatisfactionResponse(
  caseId: string,
  userResp: boolean
): Promise<any> {
  return post(
    `/cases/handleSatisfactionResponse?userResp=${userResp}&caseId=${caseId}`,
    {}
  );
}

export async function getListOfCities(cityName: string): Promise<string[]> {
  return get<string[]>(`/geo/getCityNames?cityName=${cityName}`);
}
