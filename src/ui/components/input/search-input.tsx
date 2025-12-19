import { InputHTMLAttributes, forwardRef } from 'react';
import { FaSearch } from '@icons';

export interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className = '', ...props }, ref) => {
    const baseStyles = 'w-full h-12 pl-12 pr-4 rounded-lg font-medium text-base bg-gray-100 text-gray-900 border-2 border-transparent focus:border-gray-300 transition-all duration-200 outline-none';

    return (
      <div className="relative w-full">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <FaSearch className="text-lg" />
        </div>
        <input
          ref={ref}
          type="search"
          className={`${baseStyles} ${className}`}
          {...props}
        />
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';
