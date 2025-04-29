'use client';

import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateQuantity } from '@/store/cartSlice';

export interface InputNumberProps {
  className?: string;
  defaultValue?: number;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
  productId: string | number;
}

const InputNumber: FC<InputNumberProps> = ({
  className = '',
  defaultValue = 1,
  min = 1,
  max = 99,
  onChange,
  productId,
}) => {
  const [value, setValue] = useState(defaultValue);
  const dispatch = useDispatch();

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const updateQuantityInStore = (newValue: number) => {
    setValue(newValue);
    dispatch(updateQuantity({ productId, quantity: newValue }));
    onChange?.(newValue);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-200 text-lg font-bold text-gray-700 transition hover:bg-gray-300 disabled:opacity-50"
        onClick={() => updateQuantityInStore(value - 1)}
        disabled={value <= min}
        aria-label="Decrease quantity"
        type='button'
      >
        −
      </button>
      <span className="w-6 text-center font-semibold">{value}</span>
      <button
      type='button'
        className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-200 text-lg font-bold text-gray-700 transition hover:bg-gray-300 disabled:opacity-50"
        onClick={() => updateQuantityInStore(value + 1)}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
};

export default InputNumber;
