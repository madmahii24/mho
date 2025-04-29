import { motion } from "framer-motion";
import React from "react";

export interface UserInfo {
  customerId: string;
  name: string;
  mobileNo: string;
  gender?: string | null;
  dob?: string | null;
  email?: string;
}

export interface FieldDefinition {
  id: keyof UserInfo;
  label: string;
  type: string;
  required?: boolean;
  icon: React.ReactNode;
  options?: { value: string; label: string }[];
}

// Field definitions for personal information
export const personalInfoFields: FieldDefinition[] = [
  {
    id: "name",
    label: "Name",
    type: "text",
    required: true,
    icon: (
      <svg
        className="w-5 h-5 text-green-600"
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
    )
  },
  {
    id: "gender",
    label: "Gender",
    type: "select",
    options: [
      { value: "", label: "Select Gender" },
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
      { value: "other", label: "Other" }
    ],
    icon: (
      <svg
        className="w-5 h-5 text-green-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    )
  },
  {
    id: "dob",
    label: "Date of Birth",
    type: "date",
    icon: (
      <svg
        className="w-5 h-5 text-green-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    )
  }
];

// Field definitions for contact information
export const contactInfoFields: FieldDefinition[] = [
  {
    id: "email",
    label: "Email",
    type: "email",
    required: true,
    icon: (
      <svg
        className="w-5 h-5 text-green-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2v4l.586-.586z"
        />
      </svg>
    )
  },
  {
    id: "mobileNo",
    label: "Mobile Number",
    type: "tel",
    required: true,
    icon: (
      <svg
        className="w-5 h-5 text-green-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    )
  }
];

// Renders an individual form field based on field definition
export const renderField = (
  field: FieldDefinition,
  formData: UserInfo,
  errors: Record<string, string>,
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void,
  handleBlur?: (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => void
) => {
  const value = formData[field.id] || "";
  const hasError = !!errors[field.id];

  if (field.id === "dob") {
    return (
      <div className="relative">
        {field.icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {field.icon}
          </div>
        )}
        <input
          type="date"
          id={field.id}
          name={field.id}
          value={value as string}
          onChange={handleInputChange}
          className={`pl-10 pr-4 py-3 border rounded-md w-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 appearance-none ${
            hasError
              ? "border-red-500"
              : "border-gray-200 hover:border-green-400"
          }`}
        />
      </div>
    );
  }

  if (field.type === "select" && field.options) {
    return (
      <div className="relative">
        {field.icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {field.icon}
          </div>
        )}
        <select
          id={field.id}
          name={field.id}
          value={value as string}
          onChange={handleInputChange}
          onBlur={field.id === "email" || field.id === "mobileNo" ? handleBlur : undefined}
          className={`pl-10 pr-4 py-3 border rounded-md w-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 ${
            hasError
              ? "border-red-500"
              : "border-gray-200 hover:border-green-400"
          }`}
          required={field.required}
        >
          {field.id === 'gender' ? (
            // For gender field, only show placeholder when no value is selected
            <>
              {!value && <option value="">Select Gender</option>}
              {field.options
                .filter(option => option.value !== "") // Filter out the empty placeholder option
                .map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))
              }
            </>
          ) : (
            // For other select fields, show all options
            field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))
          )}
        </select>
      </div>
    );
  }

  return (
    <div className="relative">
      {field.icon && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          {field.icon}
        </div>
      )}
      <input
        type={field.type}
        id={field.id}
        name={field.id}
        value={value as string}
        onChange={handleInputChange}
        onBlur={field.id === "email" || field.id === "mobileNo" ? handleBlur : undefined}
        className={`pl-10 pr-4 py-3 border rounded-md w-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 ${
          hasError
            ? "border-red-500"
            : "border-gray-200 hover:border-green-400"
        }`}
        required={field.required}
      />
    </div>
  );
};

// Renders a group of form fields with a title
export const renderFormFieldGroup = (
  title: string,
  fields: FieldDefinition[],
  formData: UserInfo,
  errors: Record<string, string>,
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void,
  handleBlur?: (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => void
) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="mb-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100"
  >
    <h3 className="text-lg font-semibold text-green-700 mb-5 border-b border-gray-100 pb-2 flex items-center">
      {title === "Personal Information" ? (
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
      ) : (
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
      )}
      {title}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
      {fields.map((field) => (
        <motion.div
          key={field.id}
          className="flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <label
            htmlFor={field.id}
            className="text-sm font-medium text-gray-600 mb-1.5 flex items-center"
          >
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {renderField(field, formData, errors, handleInputChange, handleBlur)}
          {errors[field.id] && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="text-red-500 text-xs mt-1.5"
            >
              {errors[field.id]}
            </motion.p>
          )}
        </motion.div>
      ))}
    </div>
  </motion.div>
);

// Renders a field in view mode (non-editable)
export const renderViewModeField = (
  label: string,
  value: string | null | undefined,
  icon: React.ReactNode
) => {
  // Check if value is null, undefined, or an empty string
  const isEmpty = value === null || value === undefined || value === "";

  return (
    <motion.div
      className="mb-4 flex"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mr-3 text-green-600 mt-1">{icon}</div>
      <div className="flex-1">
        <span className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
          {label}
        </span>
        <p
          className={`text-base font-semibold text-gray-800 ${isEmpty ? "italic text-gray-500 font-normal uppercase" : ""}`}
        >
          {isEmpty ? "Not Available" : value}
        </p>
      </div>
    </motion.div>
  );
};
