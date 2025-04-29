import { Check, Pencil, Send, User } from "lucide-react";
import type { FC } from "react";
import React, { useEffect, useRef, useState } from "react";

import { AUTH_CHANGE_EVENT,useAuth } from "@/hooks/useAuth";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import FormItem from "@/shared/FormItem";
import Input from "@/shared/Input/Input";
import { LOCAL_CUSTINFO_KEY, LOCAL_TOKEN_KEY } from "@/utils/constants";
import { saveCustomer, sendOTP, VerifyOTP } from "@/utils/dataService";

interface Props {
  isActive: boolean;
  onOpenActive: () => void;
  onCloseActive: () => void;
  setIsUserLoggedIn: (loggedIn: boolean) => void;
}

const ContactInfo: FC<Props> = ({
  isActive,
  onCloseActive,
  onOpenActive,
  setIsUserLoggedIn
}) => {
  const { logout ,isAuthenticated} = useAuth();
  const [customer, setCustomer] = useState({
    name: "",
    mobileNo: "",
    email: ""
  });
  const [showOtpField, setShowOtpField] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const otpRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedCustomer = localStorage.getItem(LOCAL_CUSTINFO_KEY);
    if (storedCustomer) {
      setCustomer(JSON.parse(storedCustomer));
    } else {
      nameRef.current?.focus();
    }
  }, []);

  // NEW: Listen for auth change events to refresh customer info
  useEffect(() => {
    const handleAuthChange = () => {
      const updated = localStorage.getItem(LOCAL_CUSTINFO_KEY);
      if (updated) {
        setCustomer(JSON.parse(updated));
      }
    };
    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
    return () => window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    if (showOtpField) {
      otpRef.current?.focus();
    }
  }, [showOtpField]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
    setError("");
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
    setError("");
  };

  const validateForm = () => {
    if (!customer.name.trim()) {
      setError("Please enter your name");
      nameRef.current?.focus();
      return false;
    }
    if (!customer.mobileNo.trim()) {
      setError("Please enter a valid 10-digit mobile number");
      return false;
    }

    return true;
  };

  const handleLogout = () => {    logout();
    setCustomer({ name: "", mobileNo: "", email: "" });
    setIsUserLoggedIn(false);
  };

  const handleSendOtp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await sendOTP({ mobileNo: customer.mobileNo, name: customer.name });
      setShowOtpField(true);
      setCountdown(90);
      setError("");
    } catch (error) {
      setError(
        "Failed to send OTP. Please check your mobile number and try again."
      );
      console.error("Send OTP error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    
    if (!customer.mobileNo) {
      setError("Invalid mobile number. Please edit your details.");
      return;
    }
    
    setLoading(true);
    try {
      await sendOTP({ mobileNo: customer.mobileNo, name: customer.name });
      setCountdown(90);
      setError("");
    } catch (error) {
      setError("Failed to resend OTP. Please try again later.");
      console.error("Resend OTP error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setError("Please enter the OTP");
      otpRef.current?.focus();
      return;
    }

    setLoading(true);
    try {
      const res = await VerifyOTP({
        username: customer.mobileNo,
        password: otp,
        type: "otp"
      });

      if (res?.Authorization && res?.status === "success") {
        localStorage.setItem(LOCAL_TOKEN_KEY, res.Authorization);
        const cust = await saveCustomer(customer);
        if (cust) {
          localStorage.setItem(LOCAL_CUSTINFO_KEY, JSON.stringify(cust));
          setCustomer(cust);
          // Trigger auth change event instead of storage event
          window.dispatchEvent(new Event("auth-state-change"));
          setIsUserLoggedIn(true);
          setShowOtpField(false);
          setOtp("");
          setError("");
          onCloseActive();
        } else {
          throw new Error("Failed to save verified customer.");
        }
      } else {
        throw new Error("Invalid OTP");
      }
    } catch (error) {
      setError("Invalid OTP. Please check and try again.");
      console.error("Verify OTP error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-neutral-200 bg-white shadow-sm">
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User size={24} />
          </div>
          <div>
            {isAuthenticated ? (
              <>
                <h4 className="font-semibold text-gray-800">{customer.name}</h4>
                <p className="text-gray-600">{customer.mobileNo}</p>
              </>
            ) : (
              <h4 className="font-semibold text-gray-800">
                Add your contact information
              </h4>
            )}
          </div>
        </div>
        <div>
          {isAuthenticated ? (
            <ButtonSecondary
              onClick={handleLogout}
              className="border-slate-300 text-slate-600 hover:bg-primary hover:text-white"
            >
              Logout
            </ButtonSecondary>
          ) : !isActive ? (
            <ButtonSecondary
              onClick={() => onOpenActive()}
              className="border-slate-300 text-slate-600 hover:bg-primary hover:text-white"
            >
              <Pencil size={18} />
            </ButtonSecondary>
          ) : null}
        </div>
      </div>

      <div
        className={`border-t border-neutral-200 transition-all duration-300 ease-in-out ${
          isActive
            ? "max-h-[1000px] opacity-100" // increased max height to accommodate OTP field
            : "max-h-0 overflow-hidden opacity-0"
        }`}
      >
        <div className="p-6">
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <FormItem label="Your Name">
              <Input
                name="name"
                value={customer.name}
                onChange={handleChange}
                ref={nameRef}
                placeholder="Enter your Name"
                className="focus:border-primary"
                disabled={loading || showOtpField}
              />
            </FormItem>

            <FormItem label="Your Mobile Number">
              <Input
                name="mobileNo"
                type="number"
                value={customer.mobileNo}
                onChange={handleChange}
                placeholder="Enter Your Mobile number"
                className="focus:border-primary disabled:bg-gray disabled:cursor-not-allowed"
                disabled={loading || showOtpField}
              />
            </FormItem>

            {showOtpField && (
              <div className="rounded-md border border-neutral-200 bg-neutral-50 p-4">
                <p>Enter OTP sent your WhatsApp</p>
                <FormItem label="">
                  <div className="flex gap-2">
                    <Input
                      name="otp"
                      value={otp}
                      onChange={handleOtpChange}
                      placeholder="Enter 6-digit OTP"
                      className="focus:border-primary"
                      ref={otpRef}
                      disabled={loading}
                      maxLength={6}
                      onKeyDown={(e) => e.key === "Enter" && handleVerifyOtp()}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    {countdown > 0 ? (
                      <p className="text-gray-500">
                        Resend OTP in {countdown}s
                      </p>
                    ) : (
                      <button
                        onClick={handleResendOtp}
                        className="text-primary hover:text-primary/80"
                        disabled={loading}
                        type="button"
                      >
                        Resend OTP
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setShowOtpField(false);
                        setOtp("");
                      }}
                      type="button"
                      className="text-gray-500 hover:text-gray-700"
                      disabled={loading}
                    >
                      Edit Details
                    </button>
                  </div>
                </FormItem>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              {!showOtpField ? (
                <ButtonPrimary
                  onClick={handleSendOtp}
                  disabled={loading || !customer.name || !customer.mobileNo}
                  className="flex items-center gap-2"
                >
                  {loading ? "Sending..." : "Send OTP"}
                  <Send size={16} />
                </ButtonPrimary>
              ) : (
                <ButtonPrimary
                  onClick={handleVerifyOtp}
                  disabled={loading || !otp}
                  className="flex items-center gap-2"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                  <Check size={16} />
                </ButtonPrimary>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
