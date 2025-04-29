"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  HelpCircle,
  MapPin,
  Package,
  ShoppingBag,
  Truck
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import product from "@/public/assets/images/packet.webp";
import { downloadRecipt, getOrderById } from "@/utils/SecureDataService";

// Types for order data
type OrderProduct = {
  productId: string;
  productName: string;
  brandName: string;
  categoryName: string;
  sellingPrice: number;
};

type OrderDetail = {
  id: string;
  qty: number;
  amount: number;
  product: OrderProduct;
};

type DeliveryAddress = {
  addressId: number;
  custID: string;
  country: string;
  state: string;
  city: string;
  dist: string;
  pinCode: string;
  fullAddress: string;
};

type Seller = {
  id: number;
  name: string;
  addline1: string | null;
  addline2: string | null;
  city: string | null;
  zipCode: string | null;
  panNo: string | null;
  gstNo: string | null;
  email: string | null;
  contactNo: string | null;
  webSite: string | null;
  sellerLogoPath: string | null;
};

type Order = {
  orderId: string;
  date: string;
  orderStatus: string;
  orderType: string;
  custId: string;
  billId?: string;
  courierId?: string;
  totalAmount: number;
  orderDetails: OrderDetail[];
  deliveryAddress?: DeliveryAddress;
  seller?: Seller;
};

const OrderDetailPage = (props: any) => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [order, setOrder] = React.useState<Order | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  useEffect(() => {
    setLoading(true);
    setError(null);

    getOrderById(props.params.orderId as string)
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setOrder(data[0]);
        } else if (typeof data === "object" && data !== null) {
          setOrder(data as Order);
        } else {
          setError("Order not found");
          setOrder(null);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching order:", error);
        setError("Failed to load order details");
        setLoading(false);
      });
  }, [props.params.orderId]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="w-full max-w-md text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading your order details...</p>
        </div>
      </div>
    );
  }

  // Return placeholder if order is not found
  if (!order || error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <Card className="w-full max-w-md shadow-sm">
          <CardContent className="flex flex-col items-center py-8">
            <AlertCircle className="text-red-500 mb-4" size={36} />
            <h2 className="text-lg font-medium mb-2">
              {error || "Order not found"}
            </h2>
            <p className="text-gray-500 mb-6 text-center">
              This order doesn&apos;t exist or has been deleted.
            </p>
            <Button onClick={() => router.push("/orders")} variant="outline">
              <ArrowLeft className="mr-2" size={16} /> Back to Orders
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status?: string) => {
    if (!status) return "bg-gray-100 text-gray-700";

    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "processing":
      case "created":
        return "bg-blue-100 text-blue-700";
      case "shipped":
        return "bg-purple-100 text-purple-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status?: string) => {
    if (!status) return <HelpCircle size={16} />;

    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle size={16} />;
      case "created":
      case "processing":
        return <Clock size={16} />;
      case "shipped":
        return <Truck size={16} />;
      case "cancelled":
        return <AlertCircle size={16} />;
      default:
        return <Package size={16} />;
    }
  };

  // Format dates safely with null checking
  const orderDate = order?.date ? new Date(order.date) : new Date();
  const formattedDate = orderDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const formattedTime = orderDate.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit"
  });

  // Estimated delivery date calculation
  const deliveryStartDate = new Date(orderDate);
  deliveryStartDate.setDate(deliveryStartDate.getDate() + 3);
  const deliveryEndDate = new Date(orderDate);
  deliveryEndDate.setDate(deliveryEndDate.getDate() + 7);

  const formattedDeliveryDate = `${deliveryStartDate.getDate()}-${deliveryEndDate.getDate()} ${deliveryStartDate.toLocaleString("default", { month: "short" })}`;
  const handleDownloadRecipt = async (orderId: string) => {
    downloadRecipt(orderId).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `receipt-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  };
  const handleProductClick = (productId: string) => {
    router.push(`/products/${productId}`);
  };
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/orders")}
            className="text-gray-600"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-medium">Order Details</h1>
          <div className="w-20" /> {/* Spacer for alignment */}
        </div>

        {/* Order summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="mb-6 overflow-hidden shadow-sm">
            <CardContent className="p-0">
              {/* Order header */}
              <div className="bg-white p-6 border-b">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`${getStatusColor(order.orderStatus)}`}>
                        <span className="flex items-center gap-1.5">
                          {getStatusIcon(order.orderStatus)}
                          {order.orderStatus || "Unknown"}
                        </span>
                      </Badge>
                      {order.orderType && (
                        <Badge variant="outline" className="text-gray-600">
                          {order.orderType}
                        </Badge>
                      )}
                    </div>
                    <h2 className="text-lg font-medium">
                      Order #{order.orderId}
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <Calendar size={14} />
                      <span>
                        {formattedDate} • {formattedTime}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-sm text-gray-500">Total Amount</span>
                    <span className="text-xl font-medium text-green-600">
                      ₹{order.totalAmount?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery info */}
              <div className="p-6 bg-gray-50">
                <div className="flex items-center gap-2 mb-3 text-gray-700">
                  <Truck size={16} />
                  <span className="font-medium">Delivery Information</span>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">
                      Estimated Delivery
                    </p>
                    <p className="text-gray-700">{formattedDeliveryDate}</p>
                  </div>

                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">Payment Method</p>
                    <p className="text-gray-700">
                      {order.orderType === "PREPAID"
                        ? "Online Payment"
                        : "Cash on Delivery"}
                    </p>
                  </div>

                  {order.courierId && (
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-1">Courier ID</p>
                      <p className="text-gray-700">{order.courierId}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Order items */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="mb-6 shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
                <ShoppingBag size={18} />
                Items ({order.orderDetails?.length || 0})
              </h2>

              <div className="space-y-4">
                {order.orderDetails && order.orderDetails.length > 0 ? (
                  order.orderDetails.map((item, index) => (
                    <button
                     type="button"
                      key={item.id || index}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() =>
                        handleProductClick(item.product?.productId || "")
                      }
                      // onKeyDown={(e) => {
                      //   if (e.key === "Enter" || e.key === " ") {
                      //     handleProductClick(item.product?.productId || "");
                      //   }
                      // }}
                    >
                      <div className="h-16 w-16 bg-white rounded flex items-center justify-center border">
                        <Image
                          src={product}
                          alt={item.product?.productName || "Product"}
                          width={60}
                          height={60}
                          className="object-contain"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">
                          {item.product?.productName || "Unknown Product"}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {item.product?.brandName || "Unknown"} •{" "}
                          {item.product?.categoryName?.replace("_", " ") ||
                            "Uncategorized"}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <div className="text-center">
                          <p className="text-gray-500">Qty</p>
                          <p className="font-medium">{item.qty || 0}</p>
                        </div>

                        <div className="text-right">
                          <p className="text-gray-500">Price</p>
                          <p className="font-medium">
                            ₹{item.amount?.toFixed(2) || "0.00"}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <Package className="mx-auto text-gray-400 mb-2" size={28} />
                    <p className="text-gray-500">No items in this order</p>
                  </div>
                )}
              </div>

              {/* Order summary */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{order.totalAmount?.toFixed(2) || "0.00"}</span>
                </div>

                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Shipping</span>
                  <span>₹0.00</span>
                </div>

                <div className="flex justify-between font-medium text-base mt-4">
                  <span>Total</span>
                  <span className="text-green-600">
                    ₹{order.totalAmount?.toFixed(2) || "0.00"}
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                className="mt-6 text-gray-700"
                size="sm"
                onClick={() => handleDownloadRecipt(order.orderId)}
              >
                <Download size={16} className="mr-2" /> Download Recipt
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Address information */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="mb-6 shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
                <MapPin size={18} />
                Address Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Delivery Address */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Delivery Address
                  </h3>

                  {order.deliveryAddress ? (
                    <div className="text-sm">
                      <p className="text-gray-700">
                        {order.deliveryAddress.fullAddress}
                      </p>
                      <p className="text-gray-700">
                        {order.deliveryAddress.city}-
                        {order.deliveryAddress.pinCode},
                      </p>
                      <p className="text-gray-700">
                        {order.deliveryAddress.state},{" "}
                        {order.deliveryAddress.country}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm italic">
                      No delivery address available
                    </p>
                  )}
                </div>

                {/* Seller Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Seller Information
                  </h3>

                  {order.seller ? (
                    <div className="text-sm">
                      <p className="font-medium text-gray-700">
                        {order.seller.name}
                      </p>
                      {(order.seller.addline1 ||
                        order.seller.addline2 ||
                        order.seller.city) && (
                        <p className="text-gray-600 mt-1">
                          {order.seller.addline1} {order.seller.addline2},
                          {order.seller.city} {order.seller.zipCode}
                        </p>
                      )}
                      {order.seller.contactNo && (
                        <p className="text-gray-600 mt-1">
                          Contact: {order.seller.contactNo}
                        </p>
                      )}
                      {order.seller.email && (
                        <p className="text-gray-600">
                          Email: {order.seller.email}
                        </p>
                      )}
                      {order.seller.gstNo && (
                        <p className="text-gray-600">
                          GST: {order.seller.gstNo}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm italic">
                      No seller information available
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="flex justify-center gap-4 mt-8"
        >
          <Button variant="outline" onClick={() => router.push("/orders")}>
            View All Orders
          </Button>

          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={() => router.push("/")}
          >
            Continue Shopping
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
