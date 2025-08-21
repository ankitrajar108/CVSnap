"use client";
import React, { useState } from "react";
import { useFormStatus } from "react-dom";
import { type ComponentProps } from "react";

interface InputProps {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
  required?: boolean;
}

const EmailInput: React.FC<InputProps> = ({ label, name, placeholder, required }) => {
  return (
    <div className="mb-4">
      <label className="text-md" htmlFor={name}>
        {label}
      </label>
      <input
        className="rounded-md px-4 py-2 bg-gray-100 border border-gray-300 text-gray-800 w-full mt-1"
        type="email"
        name={name}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
};

const PasswordInput: React.FC<InputProps> = ({ label, name, placeholder, required }) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const togglePasswordVisibility = (): void => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="mb-4">
      <label className="text-md" htmlFor={name}>
        {label}
      </label>
      <div className="relative mt-1">
        <input
          className="rounded-md px-4 py-2 bg-gray-100 border border-gray-300 text-gray-800 w-full pr-10"
          type={showPassword ? "text" : "password"}
          name={name}
          placeholder={placeholder}
          required={required}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

type AuthButtonProps = ComponentProps<"button"> & {
  pendingText?: string;
  variant?: 'default' | 'outline' | 'google';
};

const AuthButton: React.FC<AuthButtonProps> = ({
  children,
  pendingText,
  variant = 'default',
  className = "",
  ...props
}) => {
  const { pending, action } = useFormStatus();

  // The `formAction` prop is a function, so we compare it directly to show the pending text
  const isPending = pending && action === props.formAction;

  const baseClasses =
    "w-full flex items-center justify-center rounded-md px-4 py-2 mb-2 transition-colors font-semibold gap-2";

  const variantClasses = {
    default: 'bg-mainBlack text-white hover:bg-opacity-80',
    outline: 'border border-gray-300 bg-transparent text-mainBlack hover:bg-gray-100',
    google: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 shadow-sm',
  } as const;

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  // Default to submit so forms with <form action={...}> work without needing formAction on the button.
  // Allow override by passing an explicit type prop.
  const type = props.type ?? "submit";

  return (
    <button
      {...props}
      className={buttonClasses}
      type={type}
      disabled={pending}
    >
      {isPending ? pendingText : children}
    </button>
  );
};

const GoogleIcon = ({ className = "", ...props }) => (
  <svg
    className={`w-5 h-5 ${className}`}
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <title>Google icon</title>
    <path 
      fill="#4285F4" 
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path 
      fill="#34A853" 
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path 
      fill="#FBBC05" 
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path 
      fill="#EA4335" 
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

// Enhanced Google Sign-in Button Component
interface GoogleSignInButtonProps {
  formAction?: any;
  pendingText?: string;
  children: React.ReactNode;
  [key: string]: any;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ 
  formAction, 
  pendingText = "Signing in...", 
  children, 
  ...props 
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Call the server action directly
      if (formAction) {
        await formAction();
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      setIsLoading(false);
    }
  };

  return (
    <button
      {...props}
      onClick={handleClick}
      className="relative w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      type="button"
      disabled={isLoading}
    >
      {/* Google Icon */}
      <div className="flex-shrink-0">
        <GoogleIcon className="w-5 h-5" />
      </div>
      
      {/* Button Text */}
      <span className="text-gray-700 font-medium text-sm group-hover:text-gray-800 transition-colors">
        {isLoading ? pendingText : children}
      </span>
      
      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute right-4">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Subtle shine effect on hover */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
    </button>
  );
};

export { EmailInput, PasswordInput, AuthButton, GoogleIcon, GoogleSignInButton };
