'use client';

import Link from 'next/link';
import React from 'react';
import { MdArrowBack, MdChevronRight } from 'react-icons/md';

import ButtonCircle3 from '@/shared/Button/ButtonCircle3';

const SectionNavigation = ({ categoryName = "Snacks", productName = "Organic Banana Chips" }) => {
  return (
    <div className="my-8">
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/">
          <ButtonCircle3 size="w-10 h-10" className="border border-neutral-200 hover:border-neutral-300 transition-colors">
            <MdArrowBack className="text-xl" />
          </ButtonCircle3>
        </Link>

        <nav className="flex items-center text-sm text-neutral-500">
          <Link href="/" className="hover:text-neutral-800 transition-colors">
            Home
          </Link>
          <MdChevronRight className="mx-2" />
          <Link href="/category" className="hover:text-neutral-800 transition-colors">
            {categoryName}
          </Link>
          <MdChevronRight className="mx-2" />
          <span className="text-neutral-800 font-medium">{productName}</span>
        </nav>
      </div>
    </div>
  );
};

export default SectionNavigation;
