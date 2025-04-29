"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { BsPerson, BsPhone } from "react-icons/bs";
// import { FaGoogle } from "react-icons/fa6";
import { IoMail } from "react-icons/io5";

import { useAuth } from "@/hooks/useAuth";
import { LOCAL_CUSTINFO_KEY, LOCAL_TOKEN_KEY } from "@/utils/constants";
import { saveCustomer, sendOTP, VerifyOTP } from "@/utils/dataService";

const PageAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [useEmail, setUseEmail] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userName, setUserName] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [timer, setTimer] = useState(90);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const [customer, setCustomer] = useState<any>({
    name: "",
    mobileNo: "",
    email: ""
  });
  const router = useRouter();
  const otpRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);
  useEffect(() => {
    const isUserLoggedIn = localStorage.getItem(LOCAL_TOKEN_KEY);
    if (isUserLoggedIn) {
      router.push("/");
    }
  })
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setUseEmail(false);
    setOtpSent(false);
    setIsConfirmed(false);
    setError("");
  };

  const sendOtp = () => {
    if (!phoneNumber.trim()) {
      setError("Please enter your mobile number");
      return;
    }

    if (!/^\d{10}$/.test(phoneNumber.trim())) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setIsLoading(true);
    setError("");

    sendOTP({ mobileNo: phoneNumber })
      .then(() => {
        setOtpSent(true);
        setTimer(90);
        setError("");
      })
      .catch((err) => {
        console.error("Failed to send OTP:", err);
        setError("Failed to send OTP. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setError("Please enter the OTP");
      otpRef.current?.focus();
      return;
    }

    setError("");

    try {
      const res = await VerifyOTP({
        username: phoneNumber,
        password: otp,
        type: "otp"
      });

      if (res?.Authorization && res?.status === "success") {
        localStorage.setItem(LOCAL_TOKEN_KEY, res.Authorization);

        const updatedCustomer = {
          ...customer,
          mobileNo: phoneNumber,
          name: userName,
        };

        try {
          const cust = await saveCustomer(updatedCustomer);
          if (cust) {
            localStorage.setItem(LOCAL_CUSTINFO_KEY, JSON.stringify(cust));
            setCustomer(cust);

            login();
            setOtp("");

            setIsConfirmed(true);
            setTimeout(() => {
              router.push("/");
            }, 1000);
          } else {
            throw new Error("Failed to save customer information");
          }
        } catch (saveError: any) {
          console.error("Customer save error:", saveError);
          setError(
            saveError.message ||
              "Failed to save customer information. Please try again."
          );
        }
      } else {
        throw new Error(res?.message || "Invalid OTP verification response");
      }
    } catch (error: any) {
      if (
        error.message.includes("Network") ||
        error.message.includes("fetch")
      ) {
        setError("Network error. Please check your connection and try again.");
      } else if (error.message.includes("expired")) {
        setError("OTP has expired. Please request a new one.");
        setOtpSent(false);
      } else {
        setError(error.message || "Invalid OTP. Please check and try again.");
      }
      console.error("Verify OTP error:", error);
    }
  };

  const handleResendOtp = () => {
    setIsLoading(true);
    setError("");
    setOtp("");
    sendOTP({ mobileNo: phoneNumber })
      .then(() => {
        setTimer(90);
        setError("");
        
      })
      .catch((err) => {
        console.error("Failed to resend OTP:", err);
        setError("Failed to resend OTP. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-50">
      <div className="w-full max-w-md p-4 sm:p-8">
        <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 transform transition-all duration-500 ease-out hover:shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6 text-gray-800">
            {isLogin ? "Welcome back" : "Create account"}
          </h2>

          {/* <button
            className="w-full mb-6 flex items-center justify-center gap-3 px-4 py-3 text-gray-700 
              bg-white border border-gray-200 rounded-lg hover:bg-gray-50 
              transition-all duration-200 active:scale-[0.98] group"
            type="button"
          >
            <FaGoogle className="text-lg text-black" />
            <span className="font-medium">Continue with Google</span>
          </button> */}

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 text-gray-400 bg-white text-xs uppercase tracking-wider">
                or
              </span>
            </div>
          </div>

          {error && (
            <div className="py-2 px-3 bg-red-50 border border-red-100 text-red-600 rounded-md text-sm mb-4 animate-fadeIn">
              {error}
            </div>
          )}

          <form className="space-y-5">
            {!useEmail ? (
              <div className="space-y-4">
                <div className="relative">
                  {!isLogin && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">
                        Enter Your Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <BsPerson className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          placeholder="eg. John Doe"
                          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-green-500 
                    focus:ring-1 focus:ring-green-500 transition-all duration-200 text-gray-800
                    placeholder:text-gray-400 text-base"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <BsPhone className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      placeholder="eg. 0000000000"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-green-500 
                        focus:ring-1 focus:ring-green-500 transition-all duration-200 text-gray-800
                        placeholder:text-gray-400 text-base"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                </div>

                {!otpSent ? (
                  <button
                    type="button"
                    className="w-full py-2.5 px-4 bg-green-600 text-white font-medium rounded-lg
                      hover:bg-green-700 transition-all duration-200 active:scale-[0.98]
                      disabled:opacity-70 disabled:cursor-not-allowed"
                    onClick={sendOtp}
                    disabled={!phoneNumber.trim() || isLoading}
                  >
                    {isLoading ? "Sending..." : "Send OTP"}
                  </button>
                ) : (
                  <div className="space-y-4 animate-fadeIn">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">
                        Enter OTP
                      </label>
                      <input
                        type="text"
                        placeholder="6-digit OTP"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-green-500 
                          focus:ring-1 focus:ring-green-500 transition-all duration-200 text-gray-800
                          placeholder:text-gray-400 text-base"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                      />
                      <div className="flex justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          Didn&apos;t receive OTP?
                        </span>
                        {timer > 0 ? (
                          <span className="text-xs text-gray-500">
                            Resend in {timer}s
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleResendOtp}
                            className="text-xs text-green-600 font-medium hover:text-green-700"
                            disabled={isLoading}
                          >
                            Resend OTP
                          </button>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="w-full py-2.5 px-4 bg-green-600 text-white font-medium rounded-lg
                        hover:bg-green-700 transition-all duration-200 active:scale-[0.98]
                        disabled:opacity-70 disabled:cursor-not-allowed"
                      onClick={handleVerifyOtp}
                      disabled={otp.length !== 6 || isLoading}
                      onKeyDown={(e) => e.key === "Enter" && handleVerifyOtp()}
                    >
                      {isLoading ? "Verifying..." : "Verify OTP"}
                    </button>
                    {isConfirmed && (
                      <div className="py-1.5 px-3 bg-green-50 border border-green-100 text-green-700 rounded-md text-sm animate-fadeIn">
                        OTP verified successfully!
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <IoMail className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-green-500 
                        focus:ring-1 focus:ring-green-500 transition-all duration-200 text-gray-800
                        placeholder:text-gray-400 text-base"
                      value={emailValue}
                      onChange={(e) => setEmailValue(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-green-500 
                      focus:ring-1 focus:ring-green-500 transition-all duration-200 text-gray-800
                      placeholder:text-gray-400 text-base"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  // onClick={() => {
                  //   if (isLogin) {
                  //     handlecheckMobile();
                  //   }
                  // }}
                  className="w-full py-2.5 px-4 bg-green-600 text-white font-medium rounded-lg
                    hover:bg-green-700 transition-all duration-200 active:scale-[0.98]"
                >
                  {isLogin ? "Sign in" : "Create account"}
                </button>
              </div>
            )}
          </form>

          {/* <button
            onClick={() => setUseEmail(!useEmail)}
            className="w-full mt-4 text-green-600 text-sm font-medium hover:text-green-700 transition-colors duration-200"
            type="button"
          >
            {useEmail ? "Use Mobile Number Instead" : "Use Email Instead"}
          </button> */}

          <div className="mt-6 pt-4 border-t border-gray-50 text-center text-sm text-gray-500">
            {isLogin ? (
              <>
                Don&apos;t have an account?{" "}
                <button
                  onClick={toggleAuthMode}
                  className="text-green-600 font-medium hover:text-green-700 transition-colors duration-200"
                  type="button"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={toggleAuthMode}
                  type="button"
                  className="text-green-600 font-medium hover:text-green-700 transition-colors duration-200"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageAuth;
