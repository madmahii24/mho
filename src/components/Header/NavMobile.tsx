import Link from 'next/link';
import React, { useState } from 'react';
import { FiLogOut } from 'react-icons/fi';
import { MdClose } from 'react-icons/md';

import {type NavItemType } from '@/components/NavItem';
import { useAuth } from '@/hooks/useAuth';
import Logo from '@/shared/Logo/Logo';

export const NavLinks: NavItemType[] = [
  {
    id: 'eexct',
    name: 'Explore Products',
    href: '/products',
  },
  {
    id: 'h6ii8g',
    name: 'Contact',
    href: '/contact',
  },
  {
    id: 'h678ty',
    name: 'FAQ',
    href: '/faqs',
  },
  {
    id: 'h6i78g',
    name: 'Checkout',
    href: '/checkout',
  },
  {
    id: 'f678ty',
    name: 'My Cart',
    href: '/cart',
  },
  {
    id: 'login123',
    name: 'LogIn',
    href: '/login',
  },
];
export interface NavMobileProps {
  onClickClose?: () => void;
}

const NavMobile: React.FC<NavMobileProps> = ({ onClickClose }) => {
  const { isAuthenticated, logout } = useAuth();
  const [logoutError, setLogoutError] = useState<string | null>(null);
  
  const handleLogout = async () => {
    try {
      setLogoutError(null);
      if (logout) {
        await logout();
      }
      if (onClickClose) onClickClose();
    } catch (error) {
      console.error('Logout error:', error);
      setLogoutError('Failed to logout. Please try again.');
    }
  };

  const filteredNavLinks = NavLinks.filter(item => {
    // Skip the login link if user is authenticated
    if (item.name === 'LogIn' && isAuthenticated) {
      return false;
    }
    return true;
  });
  
  return (
    <div className="h-screen w-full divide-y divide-neutral-300 overflow-y-auto bg-white py-2 shadow-lg ring-1 transition">
      <div className="flex items-center justify-between px-5 py-4">
        <Logo className="block" />
        <button 
          className="rounded-full p-2 hover:bg-gray-200 transition-colors" 
          onClick={onClickClose}
          aria-label="Close navigation menu"
          type='button'
        >
          <MdClose className="text-2xl" />
        </button>
      </div>
      <nav className="px-5 py-6">
        <ul className="flex flex-col space-y-4">
          {filteredNavLinks.map((item) => (
            <li key={item.id}>
              <Link 
                href={item.href} 
                onClick={onClickClose} 
                className="block rounded-md px-4 py-2 capitalize hover:bg-gray-100 transition-colors"
              >
                {item.name}
              </Link>
            </li>
          ))}
          
          {isAuthenticated && (
            <li>
              <button 
                onClick={handleLogout}
                type='button'
                className="flex w-full items-center rounded-md px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
              >
                <FiLogOut className="mr-2" />
                <span>Logout</span>
              </button>
            </li>
          )}
        </ul>
        
        {logoutError && (
          <div className="mt-4 p-2 bg-red-100 text-red-700 rounded-md text-sm">
            {logoutError}
          </div>
        )}
      </nav>
    </div>
  );
};

export default NavMobile;
