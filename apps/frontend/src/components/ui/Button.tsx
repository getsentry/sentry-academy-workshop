import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-cyber-dark disabled:opacity-50 disabled:pointer-events-none border font-cyber';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-cyber-cyan to-cyber-purple text-cyber-dark hover:from-cyber-purple hover:to-cyber-pink focus-visible:ring-cyber-cyan border-cyber-cyan shadow-neon-cyan hover:shadow-neon-purple',
    secondary: 'bg-cyber-surface-light text-cyber-cyan border-cyber-cyan/50 hover:bg-cyber-surface-hover hover:border-cyber-cyan hover:text-cyber-text focus-visible:ring-cyber-cyan hover:shadow-glow-sm',
    outline: 'border-cyber-cyan/50 bg-transparent text-cyber-cyan hover:bg-cyber-cyan/10 hover:border-cyber-cyan hover:shadow-glow-sm focus-visible:ring-cyber-cyan',
    ghost: 'bg-transparent text-cyber-text-muted hover:bg-cyber-surface-hover hover:text-cyber-cyan border-transparent focus-visible:ring-cyber-cyan',
    link: 'bg-transparent underline-offset-4 hover:underline text-cyber-cyan hover:text-cyber-pink p-0 h-auto border-transparent'
  };
  
  const sizeClasses = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-11 px-8 text-lg'
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`;

  return (
    <button
      className={classes}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};