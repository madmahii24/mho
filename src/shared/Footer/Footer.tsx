import Image from "next/image";
import Link from "next/link";
import React from "react";

import Logo from "../Logo/Logo";

const Footer: React.FC = () => {
  return (
    <footer className="bg-green-700 text-white">
      <div className="container grid gap-10 py-16 lg:grid-cols-3 lg:gap-12">
        {/* Logo & Description */}
        <div className="space-y-6">
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
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Policies</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/contact?policy=privacy"
                  className="hover:underline"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact?policy=refund" className="hover:underline">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/contact?policy=shipping"
                  className="hover:underline"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/contact?policy=terms" className="hover:underline">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-6">
        <a href="https://razorpay.com/" target="_blank">
        <Image
          src="https://badges.razorpay.com/badge-light.png "
          width={180}
          height={65}
          className="sm:h-[65px] sm:w-[180px] h-[45px] w-[113px]"
          alt="Razorpay | Payment Gateway | Neobank"
        />
      </a>
        </div>
      </div>
      
      {/* Copyright Section */}
      <div className="border-t border-gray-700 py-5 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} YourCompany. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
