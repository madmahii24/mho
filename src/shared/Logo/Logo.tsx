import Image from 'next/image';
import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';

import logo from '@/public/assets/images/medini_logo.png';

interface LogoProps {
  className?: string;
}

const Logo: FC<LogoProps> = ({ className = 'hidden' }) => {
  return (
    <Link  href="/">
      {/* <RiMicrosoftLoopFill className="text-3xl text-primary" />{' '}
      <span className={`${className} text-2xl font-bold`}>Kleem</span> */}
      <Image src={logo} alt="KELA LOGO" className={`${className} sm:h-[50px] h-[43px] w-auto my-1`}/>
    </Link>
  );
};

export default Logo;
