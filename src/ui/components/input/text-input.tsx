import { InputHTMLAttributes, forwardRef } from 'react';

export type InputState = 'default' | 'error' | 'success' | 'disabled';

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  state?: InputState;
  errorMessage?: string;
  successMessage?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ state = 'default', errorMessage, successMessage, className = '', ...props }, ref) => {
    const baseStyles = 'w-full h-12 px-4 rounded-lg font-medium text-base transition-all duration-200 outline-none';

    const stateStyles = {
      default: 'bg-gray-100 text-gray-900 border-2 border-transparent focus:border-gray-300',
      error: 'bg-red-50 text-gray-900 border-2 border-error focus:border-error',
      success: 'bg-green-50 text-gray-900 border-2 border-success focus:border-success',
      disabled: 'bg-gray-100 text-gray-400 border-2 border-transparent cursor-not-allowed',
    };

    return (
      <div className="w-full">
        <input
          ref={ref}
          className={`${baseStyles} ${stateStyles[state]} ${className}`}
          disabled={state === 'disabled' || props.disabled}
          {...props}
        />
        {state === 'error' && errorMessage && (
          <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
        )}
        {state === 'success' && successMessage && (
          <p className="mt-1 text-sm text-green-600">{successMessage}</p>
        )}
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';
