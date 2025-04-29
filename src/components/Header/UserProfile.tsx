import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

import { custEmailCheck, custMobileCheck } from "@/utils/SecureDataService";

import type {
  UserInfo} from "./UserProfileFields";
import {
  contactInfoFields,
  personalInfoFields,
  renderFormFieldGroup,
  renderViewModeField} from "./UserProfileFields";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: UserInfo;
  onSave: (updatedData: UserInfo) => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  userData,
  onSave
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<UserInfo>(userData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens or userData changes
  useEffect(() => {
    if (isOpen) {
      setFormData(userData);
      setErrors({});
    }
  }, [isOpen, userData]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      // Disable scrolling on body when modal is open
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "15px"; // Prevent layout shift
    } else {
      // Re-enable scrolling when modal is closed
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // NEW: If userData is not available, show a loading modal instead of profile content
  if (!userData?.customerId) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative bg-white text-black rounded-xl shadow-xl w-full max-w-md p-8 text-center"
        >
          <div className="text-lg font-semibold">Loading Profile...</div>
        </motion.div>
      </motion.div>
    );
  }

  const isEmailExist = async (email: string): Promise<boolean> => {
    try {
      const res = await custEmailCheck(email);
      return res.status === 302;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return false; // Email not found
      }
      console.error("Error checking email:", error);
      throw error; // Rethrow other errors
    }
  };
  
  const isMobileExist = async (mobile: string): Promise<boolean> => {
    try {
      const res = await custMobileCheck(mobile);
      return res.status === 302;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return false; // Mobile not found
      }
      console.error("Error checking mobile:", error);
      throw error; // Rethrow other errors
    }
  };
  
  const handleEditClick = () => {
    setFormData(userData);
    setIsEditing(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? null : value
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = async (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Email validation
    if (name === "email") {
      if (!value?.trim()) {
        setErrors(prev => ({ ...prev, email: "Email is required" }));
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        setErrors(prev => ({ ...prev, email: "Email format is invalid" }));
      } else if (value !== userData.email) {
        try {
          const exists = await isEmailExist(value);
          if (exists) {
            setErrors(prev => ({ ...prev, email: "Email already used by another user" }));
          } else {
            setErrors(prev => ({ ...prev, email: "" }));
          }
        } catch (error) {
          console.error("Error checking email:", error);
        }
      }
    }
    
    // Mobile validation
    if (name === "mobileNo") {
      if (!value?.trim()) {
        setErrors(prev => ({ ...prev, mobileNo: "Mobile number is required" }));
      } else if (!/^(?:\+\d{1,4})?\d{10}$/.test(value)) {
        setErrors(prev => ({ ...prev, mobileNo: "Invalid mobile number" }));
      } else if (value !== userData.mobileNo) {
        try {
          const exists = await isMobileExist(value);
          if (exists) {
            setErrors(prev => ({ ...prev, mobileNo: "Mobile number already used by another user" }));
          } else {
            setErrors(prev => ({ ...prev, mobileNo: "" }));
          }
        } catch (error) {
          console.error("Error checking mobile:", error);
        }
      }
    }
  };

  const validateForm = async (): Promise<boolean> => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) newErrors.name = "Name is required";

    // Email validation: only check existence if email has been edited
    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email format is invalid";
    } else if (formData.email !== userData.email) {
      if (await isEmailExist(formData.email)) {
        newErrors.email = "Email already used by another user";
      }
    }

    // Mobile validation: validate non-empty and mobile pattern with optional country code
    if (!formData.mobileNo?.trim()) {
      newErrors.mobileNo = "Mobile number is required";
    } else if (!/^(?:\+\d{1,4})?\d{10}$/.test(formData.mobileNo)) {
      newErrors.mobileNo = "Invalid mobile number";
    } else if (formData.mobileNo !== userData.mobileNo) {
      if (await isMobileExist(formData.mobileNo)) {
        newErrors.mobileNo = "Mobile number already used by another user";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const hasChanges = (): boolean => {
    return JSON.stringify(formData) !== JSON.stringify(userData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Skip API calls if no changes were made
    if (!hasChanges()) {
      setIsEditing(false);
      return;
    }

    if (await validateForm()) {
      onSave(formData);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(userData);
    setErrors({});
  };

  const handleCloseModal = () => {
    setIsEditing(false);
    setFormData(userData);
    setErrors({});
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleCloseModal();
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative bg-white text-black rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 py-5 bg-green-500 text-white flex justify-between items-center sticky top-0 z-10">
          <motion.h2
            className="text-xl font-semibold"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {isEditing ? (
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                Edit Profile
              </div>
            ) : (
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                User Profile
              </div>
            )}
          </motion.h2>
          <motion.button
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.2 }}
            onClick={handleCloseModal}
            className="text-white hover:text-green-100 transition duration-150"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </motion.button>
        </div>

        {/* Body - Scrollable content */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
          {!isEditing ? (
            <div className="space-y-8">
              <motion.div
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-lg font-semibold text-green-700 mb-5 border-b border-gray-100 pb-2 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderViewModeField(
                    "Name",
                    userData.name,
                    personalInfoFields[0]?.icon
                  )}
                  {renderViewModeField(
                    "Gender",
                    userData.gender,
                    personalInfoFields[1]?.icon
                  )}
                  {renderViewModeField(
                    "Date of Birth",
                    userData.dob,
                    personalInfoFields[2]?.icon
                  )}
                </div>
              </motion.div>

              <motion.div
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <h3 className="text-lg font-semibold text-green-700 mb-5 border-b border-gray-100 pb-2 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                    />
                  </svg>
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderViewModeField(
                    "Email",
                    userData.email,
                    contactInfoFields[0]?.icon
                  )}
                  {renderViewModeField(
                    "Mobile Number",
                    userData.mobileNo,
                    contactInfoFields[1]?.icon
                  )}
                </div>
              </motion.div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {renderFormFieldGroup(
                "Personal Information", 
                personalInfoFields, 
                formData, 
                errors, 
                handleInputChange,
                handleBlur
              )}
              {renderFormFieldGroup(
                "Contact Information", 
                contactInfoFields, 
                formData, 
                errors, 
                handleInputChange,
                handleBlur
              )}
            </form>
          )}
        </div>

        {/* Footer - Action buttons */}
        <div className="px-6 py-4 border-t border-gray-200 sticky bottom-0 bg-white z-10 flex justify-end">
          {!isEditing ? (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleEditClick}
              className="px-5 py-2.5 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all duration-300 flex items-center justify-center shadow-sm"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              Edit Profile
            </motion.button>
          ) : (
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleCancel}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-all duration-300 flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleSubmit}
                className="px-5 py-2.5 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all duration-300 flex items-center shadow-sm"
              >
                <svg
                  className="w-5 h-5 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Save Changes
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UserProfileModal;
