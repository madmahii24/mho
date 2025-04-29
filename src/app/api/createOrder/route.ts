import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { amount, currency = "INR", receipt = "", notes = {} } = await req.json();

    const options = {
      amount: amount * 100,
      currency,
      receipt,
      payment_capture: 1,
      notes,
    };

    const response = await razorpay.orders.create(options);
    return NextResponse.json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (err) {
    return NextResponse.json({ error: "Error creating order" }, { status: 500 });
  }
}
