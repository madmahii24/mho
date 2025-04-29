import { useState } from "react";

import { createOrder } from "@/lib/payment";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";

interface PaymentButtonProps {
  amount: number;
  currency?: string;
  cartItems: any[]; // Accept multiple products
  userDetails: {
    name: string;
    email: string;
    phone: string;
  };
  onSuccess: (paymentData: any) => void;
  onError: (error: Error) => void;
  disabled?: boolean;
}

export default function PaymentButton({
  amount,
  currency = "INR",
  cartItems,
  userDetails,
  onSuccess,
  onError,
  disabled,
}: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);

  const initiatePayment = async () => {
    setLoading(true);

    try {
      const order = await createOrder({
        amount,
        currency,
        receipt: `receipt_${Date.now()}`,
        notes: {
          products: cartItems
            .map((item) => `${item.productName} x ${item.quantity}`)
            .join(", "), // List products
          customer_email: userDetails.email,
        },
      });

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
          amount: order.amount.toString(),
          currency: order.currency,
          name: "Kleem",
          description: "Multiple Products",
          orderId: order.id,
          handler: async (response: any) => {
            onSuccess({ ...response, orderDetails: order });
          },
          prefill: userDetails,
          theme: { color: "#3399cc" },
        };

        const rzp = new (window as any).Razorpay(options);

        rzp.on("payment.failed", (response: any) => {
          onError(new Error(response.error.description));
        });

        rzp.open();
      };

      script.onerror = () => {
        onError(new Error("Failed to load Razorpay script"));
        setLoading(false);
      };
    } catch (err) {
      onError(err as Error);
      setLoading(false);
    }
  };

  return (
    <ButtonPrimary
      className="w-full py-3 text-lg disabled:cursor-not-allowed disabled:opacity-[.8]"
      onClick={initiatePayment}
      disabled={disabled || loading}
    >
      {loading ? "Processing Payment..." : `Pay ₹${amount}`}
    </ButtonPrimary>
  );
}
