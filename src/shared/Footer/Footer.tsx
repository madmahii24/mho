import Image from "next/image";
import Link from "next/link";
import React from "react";

import Logo from "../Logo/Logo";

const Footer: React.FC = () => {
  return (
    <footer className="bg-green-600 text-white">
      <div className="container grid gap-10 py-16 lg:grid-cols-3 lg:gap-12">
        {/* Logo & Description */}
        <div className="space-y-6 bg-white p-6 text-black rounded-lg">
          <Logo className="block" />
          <p className="text-gray-300">
            Your go-to destination for quality products and seamless shopping.
            Secure payments powered by Razorpay.
            <Link href="/about" className="text-white underline ml-2">
              read more...
            </Link>
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid gap-5">
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Policies</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://merchant.razorpay.com/policy/Pe6PNrvtTaPceS/privacy"
                  className="hover:underline"
                  target="_blank"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="https://merchant.razorpay.com/policy/Pe6PNrvtTaPceS/refund"
                  className="hover:underline"
                  target="_blank"
                >
                  Refund Policy
                </a>
              </li>
              <li>
                <a
                  href="https://merchant.razorpay.com/policy/Pe6PNrvtTaPceS/shipping"
                  className="hover:underline"
                  target="_blank"
                >
                  Shipping Policy
                </a>
              </li>
              <li>
                <a
                  href="https://merchant.razorpay.com/policy/Pe6PNrvtTaPceS/terms"
                  className="hover:underline"
                  target="_blank"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Details */}
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span>+91 7249492878</span>
              </li>
              <li className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>team@medininatural.com</span>
              </li>
              <li className="flex items-center">
                <a
                  href="https://merchant.razorpay.com/policy/Pe6PNrvtTaPceS/contact_us"
                  target="_blank"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div className="pt-3">
            <p className="text-sm mb-2">Secure Payments By</p>
            <a
              href="https://razorpay.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="https://badges.razorpay.com/badge-light.png"
                width={180}
                height={65}
                className="sm:h-[65px] sm:w-[180px] h-[45px] w-[113px]"
                alt="Razorpay | Payment Gateway | Neobank"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="border-t border-gray-700 py-5 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} Medini. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
