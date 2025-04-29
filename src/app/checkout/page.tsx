"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { MdStar } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

import ConfirmationModal from "@/components/ConfirmationModal";
import PaymentButton from "@/components/razorpay/PaymentButton";
import { useToast } from "@/hooks/use-toast";
import { AUTH_CHANGE_EVENT, useAuth } from "@/hooks/useAuth";
import InputNumber from "@/shared/InputNumber/InputNumber";
import { clearCart, removeItem } from "@/store/cartSlice";
import type { RootState } from "@/store/store";
import { LOCAL_CUSTINFO_KEY, LOCAL_SHIPPING_KEY } from "@/utils/constants";
import { generateBill, getAddress } from "@/utils/dataService";
import { addNewOrder } from "@/utils/SecureDataService";

import ContactInfo from "./ContactInfo";
import ShippingAddress from "./ShippingAddress";

type PaymentData = {
  orderDetails: any;
  razorpay_payment_id: string;
};

type OrderResponse = {
  data: {
    orderId: string;
    custId: string;
  };
};

const CheckoutPage = () => {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );
  const { toast } = useToast();
  const [customer, setCustomer] = useState({
    name: "",
    mobileNo: "",
    email: "",
    customerId: ""
  });
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.sellingPrice * item.quantity,
    0
  );
  const tax = 0;
  const total = subtotal + tax;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [confirmationData, setConfirmationData] = useState({
    amount: "0",
    transactionId: "",
    orderId: ""
  });

  const isPaymentDisabled =
    cartItems.length === 0 || !isAuthenticated || selectedAddressId === null;

  useEffect(() => {
    setMounted(true);
    const getUserInfo = () => {
      try {
        const storedCustomer = localStorage.getItem(LOCAL_CUSTINFO_KEY);
        if (storedCustomer) {
          const parsedCustomer = JSON.parse(storedCustomer);
          setCustomer(parsedCustomer);
        } else if (!isAuthenticated) {
          // If user doesn't exist, expand Contact Info by default
          setActiveTab("ContactInfo");
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        // In case of error, also default to expanding Contact Info
        setActiveTab("ContactInfo");
      }
    };

    getUserInfo();
    window.addEventListener(AUTH_CHANGE_EVENT, getUserInfo);
    return () => window.removeEventListener(AUTH_CHANGE_EVENT, getUserInfo);
  }, [isAuthenticated]);

  const handleCreateOrder = useCallback(
    async (paymentData: PaymentData) => {
      console.info("Initiating order creation with paymentData:", paymentData);
      try {
        if (!paymentData.orderDetails || !paymentData.razorpay_payment_id) {
          const errorMsg = "Invalid payment details received.";
          console.error(errorMsg, paymentData);
          toast({
            title: "Payment Error",
            description: errorMsg,
            variant: "destructive"
          });
          return;
        }
        
        // Properly parse the address ID from localStorage
        const addressIdString = localStorage.getItem(LOCAL_SHIPPING_KEY);
        const addressId = addressIdString ? JSON.parse(addressIdString) : null;
        
        if (!addressId) {
          toast({
            title: "Address Error",
            description: "Please select a shipping address",
            variant: "destructive"
          });
          return;
        }
        
        const orderPayload = {
          addressId,
          custId: customer.customerId,
          cart: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity.toString()
          })),
          totalAmount: total
        };
        const response: OrderResponse | null = await addNewOrder(orderPayload);
        if (!response) {
          const errorMsg = "Could not process your order. Please try again.";
          console.error("Order save failed: No response received.");
          toast({
            title: "Order Error",
            description: errorMsg,
            variant: "destructive"
          });
          return;
        }
        console.info("Order saved successfully:", response);

        const generatedBill = await generateBill({
          custId: response.data.custId,
          orderId: response.data.orderId,
          amount: total,
          razPaymentId: paymentData.razorpay_payment_id
        });

        if (!generatedBill || generatedBill.status !== 200) {
          const errorMsg = generatedBill?.message || "Failed to generate bill.";
          console.error("Bill generation failed:", generatedBill);
          toast({
            title: "Billing Error",
            description: errorMsg,
            variant: "destructive"
          });
          return;
        }
        console.info("Bill generated successfully:", generatedBill);
        dispatch(clearCart());
        // Set the confirmation details dynamically
        setConfirmationData({
          amount: total.toFixed(2),
          transactionId: paymentData.razorpay_payment_id,
          orderId: response.data.orderId
        });
        setIsModalOpen(true);
      } catch (error: any) {
        console.error("Error in handleCreateOrder:", error);
        toast({
          title: "Error",
          description:
            error?.message || "An unexpected error occurred. Please try again.",
          variant: "destructive"
        });
      }
    },
    [cartItems, customer.customerId, dispatch, router, total, toast]
  );

  const renderProduct = (item: any) => {
    const {
      productId,
      productName,
      coverImage,
      brandName,
      rating,
      sellingPrice,
      quantity
    } = item;
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
        transition={{ duration: 0.3 }}
        key={productId}
        className="flex items-center justify-between border-b py-4"
      >
        <div
          className="flex items-center gap-4 cursor-pointer"
          onClick={() => router.push(`/products/${productId}`)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              router.push(`/products/${productId}`);
            }
          }}
          tabIndex={0}
          role="button"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Image
              src={coverImage}
              alt={productName}
              width={110}
              height={110}
              className="rounded-lg object-cover shadow-sm"
            />
          </motion.div>
          <div>
            <h3 className="text-lg font-medium">
              <Link href={`/products/${productId}`}>{productName}</Link>
            </h3>
            <p className="text-gray-500 flex items-center gap-2 text-sm">
              <span>{brandName}</span>
            </p>
            <div className="flex items-center gap-1 text-yellow-400">
              <MdStar /> <span className="text-gray-700 text-sm">{rating}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <motion.span
            className="text-lg font-medium"
            initial={{ color: "#000" }}
            animate={{ color: "#046e30" }}
            transition={{ duration: 0.5 }}
          >
            ₹{sellingPrice}
          </motion.span>
          <div className="mt-2 flex items-center gap-2">
            <InputNumber defaultValue={quantity} productId={productId} />
            <motion.div
              whileHover={{ scale: 1.2, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <AiOutlineDelete
                className="cursor-pointer text-xl text-red-500"
                onClick={() => {
                  console.info(`Removing product ${productId} from cart.`);
                  dispatch(removeItem(productId));
                }}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  };

  const handleCheckAddress = async () => {
    if (isAuthenticated) {
      const address = await getAddress(customer.customerId);
      if (address.length === 0) {
        setActiveTab("ShippingAddress");
      }
      setActiveTab("");
    }
    setActiveTab("");
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {!mounted ? (
        <div className="flex items-center justify-center h-screen text-xl">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop"
            }}
          >
            Loading...
          </motion.div>
        </div>
      ) : (
        <motion.main
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          className="container mx-auto px-4 py-16 lg:px-8"
        >
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12 text-center text-3xl font-bold"
          >
            Checkout
          </motion.h1>
          <div className="flex flex-col gap-8 lg:flex-row">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex-1 rounded-lg bg-white p-6 shadow-sm"
            >
              <ContactInfo
                isActive={activeTab === "ContactInfo"}
                onOpenActive={() => {
                  setActiveTab("ContactInfo");
                }}
                onCloseActive={() => handleCheckAddress()}
                setIsUserLoggedIn={setIsAuthenticated}
              />
              <div className="mt-2">
                <ShippingAddress
                  isActive={activeTab === "ShippingAddress"}
                  onOpenActive={() => {
                    setActiveTab("ShippingAddress");
                  }}
                  onCloseActive={() => setActiveTab("")}
                  selectedAddressId={selectedAddressId}
                  setSelectedAddressId={setSelectedAddressId}
                  isUserLoggedIn={isAuthenticated}
                />
              </div>
            </motion.div>
            <div className="bg-gray-200 hidden w-px lg:block" />
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="w-full rounded-lg bg-white p-6 shadow-sm lg:w-1/3"
            >
              <h2 className="mb-6 text-xl font-semibold">Order Summary</h2>
              <AnimatePresence>
                <div className="divide-gray-200 divide-y">
                  {cartItems.length > 0 ? (
                    cartItems.map((item) => renderProduct(item))
                  ) : (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="text-gray-500 text-center py-8"
                    >
                      Your cart is empty.
                    </motion.p>
                  )}
                </div>
              </AnimatePresence>
              <motion.div
                className="mt-6 border-t pt-6 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="mt-4 flex justify-between">
                  <span>Tax</span>
                  <span className="font-medium">₹{tax.toFixed(2)}</span>
                </div>
                <motion.div
                  className="mt-4 flex justify-between text-lg font-semibold text-green-700"
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.01, 1] }}
                  transition={{ duration: 1, delay: 0.7, repeat: 1 }}
                >
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </motion.div>
              </motion.div>
              <motion.div
                className="mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <PaymentButton
                  amount={total}
                  cartItems={cartItems}
                  userDetails={{
                    name: customer.name,
                    email: customer.email,
                    phone: customer.mobileNo
                  }}
                  onSuccess={(paymentData) => {
                    console.info("Payment successful:", paymentData);
                    handleCreateOrder(paymentData);
                  }}
                  onError={(error) => {
                    console.error("Payment error:", error);
                    toast({
                      title: "Payment Error",
                      description: error?.message || "Payment failed",
                      variant: "destructive"
                    });
                  }}
                  disabled={isPaymentDisabled}
                />
                <AnimatePresence>
                  {isPaymentDisabled && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 p-4 border border-red-500 bg-red-50 rounded-md"
                    >
                      <p className="text-md text-red-600 font-semibold">
                        Please ensure you have items in your cart, provided your
                        contact information, and selected a shipping address.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </div>
          <ConfirmationModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              router.push("/");
            }}
            amount={confirmationData.amount}
            transactionId={confirmationData.transactionId}
            orderId={confirmationData.orderId}
          />
        </motion.main>
      )}
    </div>
  );
};

export default CheckoutPage;
