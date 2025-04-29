"use client";

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect,useState } from 'react';

import { policies } from './data';

interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  label: string | undefined;
}

const TabButton: React.FC<TabButtonProps> = ({isActive, onClick, label }) => {
  const baseClass = "px-4 py-2 rounded-md border transition-colors duration-200 focus:outline-none";
  const activeClass = "bg-white text-green-600 border-green-600";
  const inactiveClass = "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200";
  return (
    <button className={`${baseClass} ${isActive ? activeClass : inactiveClass}`} onClick={onClick} type="button">
      {label}
    </button>
  );
};

interface PolicyContentProps {
  activeTab: string;
}

const PolicyContent: React.FC<PolicyContentProps> = ({ activeTab }) => {
  const policy = policies[activeTab];
  if (!policy) return null;
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{policy.title}</h1>
      {policy.content}
    </div>
  );
};

const PoliciesPage: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const validTabs = ['privacy', 'refund', 'shipping', 'terms'];

  const policyParam = searchParams.get('policy');
  const [activeTab, setActiveTab] = useState('privacy');

  // Sync tab state with URL parameter
  useEffect(() => {
    if (policyParam && validTabs.includes(policyParam)) {
      setActiveTab(policyParam);
    } else {
      setActiveTab('privacy');
    }
  }, [policyParam]);

  const handleTabClick = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('policy', tab);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap gap-2 justify-center">
          {validTabs.map((tab) => (
            <TabButton
              key={tab}
              isActive={activeTab === tab}
              onClick={() => handleTabClick(tab)}
              label={policies[tab]?.title}
            />
          ))}
        </div>
        <div className="bg-white p-6 sm:p-8 rounded-md shadow-md">
          <PolicyContent activeTab={activeTab} />
        </div>
      </div>
    </div>
  );
};

export default PoliciesPage;
