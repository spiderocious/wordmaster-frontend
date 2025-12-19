import { SelectHTMLAttributes, forwardRef } from 'react';
import { FaChevronDown } from '@icons';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, className = '', ...props }, ref) => {
    const baseStyles = 'w-full h-12 pl-4 pr-10 rounded-lg font-medium text-base bg-gray-100 text-gray-900 border-2 border-transparent focus:border-gray-300 transition-all duration-200 outline-none appearance-none cursor-pointer';

    return (
      <div className="relative w-full">
        <select
          ref={ref}
          className={`${baseStyles} ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <FaChevronDown className="text-sm" />
        </div>
      </div>
    );
  }
);

Select.displayName = 'Select';
