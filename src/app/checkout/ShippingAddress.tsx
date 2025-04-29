"use client";

import { Plus } from "lucide-react";
import type { FC } from "react";
import React, { useEffect, useState } from "react";
import { TbTruckDelivery } from "react-icons/tb";

import { useToast } from "@/hooks/use-toast";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import FormItem from "@/shared/FormItem";
import Input from "@/shared/Input/Input";
import Select from "@/shared/Select/Select";
import { LOCAL_CUSTINFO_KEY, LOCAL_SHIPPING_KEY } from "@/utils/constants";
import { type Address,getAddress, saveAddress } from "@/utils/dataService";


interface Props {
  isActive: boolean;
  onOpenActive: () => void;
  onCloseActive: () => void;
  selectedAddressId: number | null;
  setSelectedAddressId: any
  isUserLoggedIn: boolean; 
}

const ShippingAddress: FC<Props> = ({
  isActive,
  onOpenActive,
  onCloseActive,
  selectedAddressId,
  setSelectedAddressId,
  isUserLoggedIn
}) => {
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);

  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Address>({
    custID: 0,
    country: "India",
    state: "",
    city: "",
    dist: "",
    pinCode: "",
    fullAddress: ""
  });

  // Fetch addresses only if isUserLoggedIn is true.
  const handleGetAddress = async (custID: string) => {
    try {
      const res = await getAddress(custID);
      if (res) {
        setAddresses(res);
        // Set the first address as default if available.
        if (res.length > 0) {
          setSelectedAddressId(res[0].addressId);
          // Save the selected address ID to localStorage
          localStorage.setItem(LOCAL_SHIPPING_KEY, JSON.stringify(res[0].addressId));
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error fetching addresses. Please try again.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (!isUserLoggedIn) {
      // If the user hasn't provided contact information, skip fetching.
      return;
    }
    const customer = localStorage.getItem(LOCAL_CUSTINFO_KEY);
    if (customer) {
      const custId = JSON.parse(customer).customerId;
      handleGetAddress(custId);
      setFormData((prev) => ({ ...prev, custID: custId }));
    }
  }, [isUserLoggedIn]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewAddress = () => {
    setFormData({
      custID: formData.custID,
      country: "India",
      state: "",
      city: "",
      dist: "",
      pinCode: "",
      fullAddress: ""
    });
    onOpenActive();
  };

  const handlesaveAddress = async () => {
    // Simple validation check.
    if (
      !formData.fullAddress ||
      !formData.city ||
      !formData.state ||
      !formData.pinCode
    ) {
      toast({
        title: "Missing Fields",
        description: "Please fill out all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      const res = await saveAddress(formData);
      if (res?.data) {
        setAddresses(res.data);
        // After saving, if no address is selected, make the first one default.
        if (res.data.length > 0 && !selectedAddressId) {
          const firstAddressId = res.data[0].addressId || null;
          setSelectedAddressId(firstAddressId);
          // Also save to localStorage when auto-selecting after save
          if (firstAddressId) {
            localStorage.setItem(LOCAL_SHIPPING_KEY, JSON.stringify(firstAddressId));
          }
        }
        const action = formData.addressId ? "updated" : "saved";
        toast({
          title: "Success",
          description: `Address ${action} successfully!`,
          variant: "default"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          "There was an error saving your address. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
      onCloseActive();
    }
  };
  const toggleAddress = (address: any) => {
    const { addressId } = address;
    if (addressId) {
      setSelectedAddressId(addressId);
      localStorage.setItem(LOCAL_SHIPPING_KEY, JSON.stringify(addressId));
    }
  };
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between p-4 md:p-6">
        <div className="flex items-start space-x-4 mb-4 md:mb-0">
          {/* <div className="bg-primary-50 text-primary-600 flex size-12 items-center justify-center rounded-full shrink-0">
          </div> */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-800 flex gap-5">
              <TbTruckDelivery className="text-2xl" />
              Shipping Address
            </h3>
            <div className="mt-1 text-sm text-slate-500">
              {(() => {
                if (!isUserLoggedIn) {
                  return "Add contact information first.";
                }
                if (addresses.length === 0) {
                  return "No address saved yet. Please add your shipping address.";
                }
                return (
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    {addresses.map((address) => (
                      <div
                        key={address.addressId}
                        className={`dark:bg-gray-900 border-gray-300 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 group flex flex-col items-start rounded-lg border bg-white p-4 shadow-sm transition duration-200 ${
                          selectedAddressId === address.addressId
                            ? "border-primary-500 ring-2 ring-primary-500/20"
                            : ""
                        }`}
                        onClick={() => toggleAddress(address)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            toggleAddress(address);
                          }
                        }}
                        tabIndex={0}
                        role="button"
                        aria-pressed={selectedAddressId === address.addressId}
                      >
                        <div className="flex w-full items-start gap-3">
                          <input
                            type="radio"
                            name="selectedAddress"
                            checked={selectedAddressId === address.addressId}
                            onChange={() => toggleAddress(address)}
                            className="mt-1 h-4 w-4 accent-blue-500 shrink-0"
                          />
                          <div className="flex-1">
                            <p className="text-gray-900 dark:text-gray-100 font-medium mb-1">
                              {address.fullAddress}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                              {`${address.city}, ${address.dist}, ${address.state} - ${address.pinCode}`}
                            </p>
                          </div>
                     
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
        {isUserLoggedIn && (
          <ButtonSecondary
            disabled={!isUserLoggedIn}
            className={`border-slate-300 text-slate-600 hover:bg-primary hover:text-white ${!isUserLoggedIn ? "cursor-not-allowed opacity-50" : ""} w-full md:w-auto`}
            onClick={() => {
              if (!isUserLoggedIn) return;
              handleNewAddress();
            }}
          >
            <Plus size={18} />
          </ButtonSecondary>
        )}
      </div>

      {/* Form Section */}
      {isUserLoggedIn && (
        <div
          className={`border-t border-slate-200 px-4 py-5 md:px-6 md:py-6 ${isActive ? "block" : "hidden"}`}
        >
          <div className="space-y-5">
            <div className="grid gap-4 md:gap-5">
              <FormItem label="Full Address" className="col-span-full">
                <Input
                  name="fullAddress"
                  value={formData.fullAddress}
                  onChange={handleChange}
                  placeholder="Street address or P.O. Box"
                  className="w-full"
                />
              </FormItem>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                <FormItem label="City">
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    className="w-full"
                  />
                </FormItem>

                <FormItem label="District">
                  <Input
                    name="dist"
                    value={formData.dist}
                    onChange={handleChange}
                    placeholder="Enter district"
                    className="w-full"
                  />
                </FormItem>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                <FormItem label="State">
                  <Select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full"
                  >
                    <option value="">Select State</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                  </Select>
                </FormItem>

                <FormItem label="PIN Code">
                  <Input
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={handleChange}
                    placeholder="6-digit postal code"
                    className="w-full"
                    maxLength={6}
                  />
                </FormItem>
              </div>
            </div>

            <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0 pt-2">
              <ButtonPrimary
                className="w-full sm:w-auto"
                onClick={handlesaveAddress}
                disabled={isSaving}
              >
                {isSaving ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0  0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Saving...
                  </span>
                ) : formData.addressId ? (
                  "Update Address"
                ) : (
                  "Save Address"
                )}
              </ButtonPrimary>
              <ButtonSecondary
                className="w-full sm:w-auto"
                onClick={() => {
                  setFormData({
                    custID: formData.custID,
                    country: "India",
                    state: "",
                    city: "",
                    dist: "",
                    pinCode: "",
                    fullAddress: ""
                  });
                  onCloseActive();
                }}
              >
                Cancel
              </ButtonSecondary>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingAddress;
