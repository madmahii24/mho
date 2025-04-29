import React from 'react';

import type { ButtonProps } from '@/shared/Button/Button';
import Button from '@/shared/Button/Button';

export interface ButtonPrimaryProps extends ButtonProps {
  href?: any;
}

const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({
  className = '',
  ...args
}) => {
  return (
    <Button
      className={`rounded-full bg-green-700 text-white hover:bg-green-800/80 disabled:bg-opacity-70 ${className}`}
      {...args}
    />
  );
};

export default ButtonPrimary;
