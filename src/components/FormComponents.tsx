"use client";

import { useState, ReactNode } from "react";

interface FormFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  autoComplete?: string;
}

const FormField = ({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  autoComplete,
}: FormFieldProps) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        className={`block w-full px-4 py-3 rounded-lg border ${
          error 
            ? "border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500" 
            : "border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
        } dark:bg-gray-700 dark:text-white text-gray-900 focus:outline-none focus:ring-2 transition-colors`}
        placeholder={placeholder}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

interface FormProps {
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  submitText: string;
  loadingText?: string;
  error?: string | null;
  children: ReactNode;
}

export default function Form({
  onSubmit,
  isLoading,
  submitText,
  loadingText,
  error,
  children,
}: FormProps) {
  return (
    <form className="mt-8 space-y-6" onSubmit={onSubmit}>
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        {children}
      </div>
      
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary py-3 relative"
        >
          {isLoading ? (
            <>
              <span className="absolute inset-0 flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              <span className="opacity-0">{loadingText || submitText}</span>
            </>
          ) : (
            submitText
          )}
        </button>
      </div>
    </form>
  );
}

export { FormField };