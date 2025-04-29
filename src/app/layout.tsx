"use client";

import "@/styles/global.css";

import React, { Suspense } from "react";
import { Provider } from "react-redux";

import Header from "@/components/Header/Header";
import { Toaster as ToasterUI } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/shared/Footer/Footer";
import { store } from "@/store/store";

import Loading from "./loading";
// const metadata: Metadata = {
//   title: "Hotkicks Ecommerce Template",
//   icons: [
//     {
//       rel: "apple-touch-icon",
//       url: "/apple-touch-icon.png",
//     },
//     {
//       rel: "icon",
//       type: "image/png",
//       sizes: "32x32",
//       url: "/favicon.png",
//     },
//     {
//       rel: "icon",
//       type: "image/png",
//       sizes: "16x16",
//       url: "/favicon.png",
//     },
//     {
//       rel: "icon",
//       url: "/favicon.ico",
//     },
//   ],
// };

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="">
        <Provider store={store}>
          <Header />
          <Suspense fallback={<Loading />}>{children}</Suspense>
          <Footer />
          <Toaster />
          <ToasterUI />
        </Provider>
      </body>
    </html>
  );
}

// Enable edge runtime, but you are required to disable the `migrate` function in `src/libs/DB.ts`
// Unfortunately, this also means it will also disable the automatic migration of the database
// And, you will have to manually migrate it with `drizzle-kit push`
// export const runtime = 'edge';
