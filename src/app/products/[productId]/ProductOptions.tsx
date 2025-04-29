import React from 'react';

export interface OptionItem {
  value: string;
  label: string;
  inStock: boolean;
  price?: number; // Additional price for this option, if any
}

export interface ProductOptionsProps {
  optionName: string;
  options: OptionItem[];
  selectedOption: string;
  onChange: (option: string) => void;
}

const ProductOptions: React.FC<ProductOptionsProps> = ({
  optionName,
  options,
  selectedOption,
  onChange,
}) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium text-gray-700">{optionName}</h3>
        <span className="text-xs text-gray-500">
          {options.filter(option => option.inStock).length} options available
        </span>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            disabled={!option.inStock}
            onClick={() => onChange(option.value)}
            className={`
              px-4 py-2 text-sm rounded-lg transition-all
              ${selectedOption === option.value 
                ? 'bg-green-600 text-white ring-2 ring-green-600 ring-offset-1' 
                : 'bg-white border border-gray-300 text-gray-700 hover:border-green-600'}
              ${!option.inStock && 'opacity-50 cursor-not-allowed line-through'}
            `}
          >
            {option.label}
            {option.price && option.price > 0 && ` (+₹${option.price})`}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductOptions;
