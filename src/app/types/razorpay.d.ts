interface RazorpayOptions {
    key: string;
    amount: string;
    currency: string;
    name: string;
    description?: string;
    image?: string;
    orderId?: string;
    handler: (response: RazorpayResponse) => void;
    prefill?: {
      name?: string;
      email?: string;
      contact?: string;
    };
    notes?: Record<string, any>;
    theme?: {
      color?: string;
    };
  }
  
  interface RazorpayResponse {
    razorpay_paymentId: string;
    razorpay_orderId: string;
    razorpay_signature: string;
  }

  declare let Razorpay: {
    new (options: RazorpayOptions): Razorpay;
  };
  