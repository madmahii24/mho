"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  ChevronDown,
  ChevronUp,
  Package,
  ShoppingCart,
  Truck} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import product from "@/public/assets/images/packet.webp";
import { LOCAL_CUSTINFO_KEY } from "@/utils/constants";
import { getOrdersByCustomerId } from "@/utils/SecureDataService";

const OrdersPage = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data and orders
  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) {
        setError("login_required");
        setLoading(false);
        return;
      }
      
      try {
        const userStr = localStorage.getItem(LOCAL_CUSTINFO_KEY);
        if (!userStr) {
          setError("login_required");
          setLoading(false);
          return;
        }
        
        const userData = JSON.parse(userStr);
        if (!userData.customerId) {
          setError("login_required");
          setLoading(false);
          return;
        }
        
        await fetchOrders(userData);
      } catch (error) {
        console.error("Error accessing user data:", error);
        setError("login_required");
        setLoading(false);
      }
    };
    
    fetchData();
  }, [isAuthenticated]);

  const fetchOrders = async (userData: any) => {
    setLoading(true);
    try {
      const res = await getOrdersByCustomerId(userData.customerId);
      if (!res || res.length === 0) {
        setError("no_orders");
      } else {
        setOrders(res.reverse());
        setError(null);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("fetch_error");
    } finally {
      setLoading(false);
    }
  };

  const toggleOrderDetails = (orderId: any) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusColor = (status: any) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-emerald-50 text-emerald-700";
      case "processing":
        return "bg-blue-50 text-blue-700";
      case "shipped":
        return "bg-violet-50 text-violet-700";
      case "cancelled":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const renderEmptyOrErrorState = () => {
    if (loading) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-4xl"
        >
          <Card className="bg-white shadow-lg rounded-xl border border-green-100 overflow-hidden p-8 text-center">
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="animate-spin h-12 w-12 border-4 border-green-500 rounded-full border-t-transparent" />
              <h2 className="text-2xl font-bold text-gray-800">Retrieving your orders...</h2>
            </div>
          </Card>
        </motion.div>
      );
    }
    
    // Error scenarios with professional messaging
    let icon = <AlertCircle size={40} className="text-amber-600" />;
    let title = "Unable to Retrieve Orders";
    let message = "We're experiencing technical difficulties. Please try again later.";
    let buttonText = "Browse Products";
    let buttonAction = () => router.push("/");
    let bgColor = "bg-amber-50";
    let iconColor = "text-amber-600";
    
    if (error === "login_required") {
      icon = <ShoppingCart size={40} className="text-blue-600" />;
      title = "Login Required";
      message = "Please sign in to your account to view your order history and track your purchases.";
      buttonText = "Sign In";
      buttonAction = () => router.push("/login");
      bgColor = "bg-blue-50";
      iconColor = "text-blue-600";
    } else if (error === "no_orders") {
      icon = <Package size={40} className="text-green-600" />;
      title = "Your Order History is Empty";
      message = "You haven't placed any orders with us yet. Explore our products and make your first purchase today.";
      buttonText = "Explore Products";
      buttonAction = () => router.push("/");
      bgColor = "bg-green-50";
      iconColor = "text-green-600";
    }
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-4xl"
      >
        <Card className="bg-white shadow-lg rounded-xl border border-green-100 overflow-hidden p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className={`${bgColor} p-4 rounded-full`}>
              <div className={iconColor}>{icon}</div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <p className="text-gray-600 max-w-md leading-relaxed">{message}</p>

            <Button 
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-lg mt-4 transition-all duration-300"
              onClick={buttonAction}
            >
              {buttonText}
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-8 flex flex-col items-center bg-white">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-3xl font-medium text-gray-900 mb-10 flex items-center"
      >
        <ShoppingCart className="mr-3 text-green-600" size={28} /> Your Orders
      </motion.h1>

      {loading || error || orders.length === 0 ? (
        renderEmptyOrErrorState()
      ) : (
        <div className="w-full max-w-4xl space-y-6">
          {orders.map((order, index) => (
            <motion.div
              key={order.orderId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <Card className="bg-white rounded-lg border border-gray-100 overflow-hidden hover:border-gray-200 transition-all duration-300">
                <CardHeader className="bg-white pb-3 pt-4 border-b border-gray-50">
                  <CardTitle className="flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-900">
                      Order #{order.orderId}
                    </span>
                    <div className="flex space-x-3">
                      <Badge
                        className={`${getStatusColor(order.orderType)} py-1.5 px-3 text-xs font-medium rounded-md`}
                      >
                        {order.orderType}
                      </Badge>
                      <Badge
                        className={`${getStatusColor(order.orderStatus)} py-1.5 px-3 text-xs font-medium rounded-md`}
                      >
                        {order.orderStatus}
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-5 pb-6 px-6">
                  <div className="flex justify-between items-center">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500 flex items-center">
                        <Calendar className="mr-2 text-gray-400" size={16} />
                        {new Date(order.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center">
                        <Truck className="mr-2 text-gray-400" size={16} />
                        Delivery estimate: {new Date(order.date).getDate() + 3}-
                        {new Date(order.date).getDate() + 7}{" "}
                        {new Date(order.date).toLocaleString("default", {
                          month: "short"
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        ₹{order.totalAmount.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.orderDetails.length} item
                        {order.orderDetails.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-6">
                    <Button
                      variant="ghost"
                      className="text-gray-600 hover:bg-gray-50 flex items-center px-4 py-2 transition-all duration-300"
                      onClick={() => toggleOrderDetails(order.orderId)}
                    >
                      {expandedOrder === order.orderId ? (
                        <>
                          Hide Items <ChevronUp className="ml-2" size={16} />
                        </>
                      ) : (
                        <>
                          View Items <ChevronDown className="ml-2" size={16} />
                        </>
                      )}
                    </Button>

                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 transition-all duration-300"
                      onClick={() => router.push(`/orders/${order.orderId}`)}
                    >
                      Order Details <ArrowRight className="ml-2" size={16} />
                    </Button>
                  </div>

                  <AnimatePresence>
                    {expandedOrder === order.orderId && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="mt-8 bg-gray-50 p-6 rounded-lg space-y-5">
                          <h2 className="text-base font-medium text-gray-800 flex items-center pb-3 border-b border-gray-100">
                            <Package className="mr-3 text-green-600" size={18} />{" "}
                            Order Items
                          </h2>
                          <div className="space-y-4">
                            {order.orderDetails.map((item:any, itemIndex:number) => (
                              <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                onClick={() =>
                                  router.push(
                                    `/products/${item.product.productId}`
                                  )
                                }
                                transition={{
                                  duration: 0.2,
                                  delay: itemIndex * 0.05
                                }}
                                className="flex items-center space-x-5 p-4 bg-white rounded-lg hover:bg-gray-50 transition-all duration-300 cursor-pointer"
                              >
                                <div className="w-20 h-20 bg-white rounded-md flex items-center justify-center overflow-hidden flex-shrink-0">
                                  <Image
                                    src={product}
                                    alt={item.product.productName}
                                    width={80}
                                    height={80}
                                    className="object-contain p-1"
                                  />
                                </div>
                                <div className="flex-grow min-w-0">
                                  <p className="text-base font-medium text-gray-900 line-clamp-1">
                                    {item.product.productName}
                                  </p>
                                  <p className="text-sm text-gray-500 mt-1 flex items-center">
                                    <span className="font-medium text-gray-600 mr-1">
                                      Brand:
                                    </span>{" "}
                                    {item.product.brandName}
                                  </p>
                                  <div className="flex flex-wrap justify-between items-center mt-3">
                                    <div className="text-xs text-gray-500">
                                      Qty: <span className="font-medium">{item.qty}</span>
                                    </div>
                                    <p className="text-base font-medium text-gray-900">
                                      ₹{item.product.sellingPrice}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex-shrink-0 self-center">
                                  <ArrowRight
                                    size={16}
                                    className="text-gray-300 group-hover:text-green-600 transition-colors"
                                  />
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
