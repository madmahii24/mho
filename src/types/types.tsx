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

 export interface Customer {
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

export interface Order {
  custId: string;
  cart: any[];
  totalAmount: number;
  addressId: number | null;
}
export interface Billobj {
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
export interface Case {
  caseId?: string;
  customerId: string;
  description: string;
  status: string;
  [key: string]: any;
}

export interface Product {
  id: string;
  name: string;
  price: any;
  category: string;
  [key: string]: any;
}