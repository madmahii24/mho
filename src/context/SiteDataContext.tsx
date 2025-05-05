// src/context/SiteDataContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type SiteData = {
  carousel: { image: string; path: string }[];
  [key: string]: any;
};

const SiteDataContext = createContext<SiteData | null>(null);

export const SiteDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [siteData, setSiteData] = useState<SiteData | null>(null);

  useEffect(() => {
    const fetchSiteData = async () => {
      try {
        const res = await fetch("https://api.medininatural.com/nodeApi/site-config/medininatural");
        const json = await res.json();
        setSiteData(json);
      } catch (err) {
        console.error("Failed to fetch site data:", err);
      }
    };

    fetchSiteData();
  }, []);

  return (
    <SiteDataContext.Provider value={siteData}>
      {children}
    </SiteDataContext.Provider>
  );
};

export const useSiteData = () => {
  const context = useContext(SiteDataContext);
  if (!context) {
    console.warn("SiteDataContext not found.");
  }
  return context;
};
