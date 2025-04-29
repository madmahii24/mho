import type { FC } from 'react';
import React from 'react';

interface ProgressBarProps {
  value: number;
}

const ProgressBar: FC<ProgressBarProps> = ({ value }) => {
  return (
    <div className="relative flex h-2 w-full overflow-hidden rounded-full bg-gray group-hover:h-3 transition-all duration-200">
      <div style={{ width: `${value}%` }} className="flex h-full bg-primary" />
    </div>
  );
};

export default ProgressBar;
