import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  className = '',
  id,
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        className={`w-full border rounded-lg px-3 py-2 text-sm transition-all focus:outline-none focus:ring-2 ${
          error 
            ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500' 
            : `${className.includes('border-') ? '' : 'border-slate-200'} focus:ring-emerald-500/20 focus:border-emerald-500`
        } ${
          className.includes('bg-') ? '' : 'bg-slate-50 focus:bg-white'
        } ${
          className.includes('text-') ? '' : 'text-slate-900'
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-rose-505 font-medium text-rose-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
