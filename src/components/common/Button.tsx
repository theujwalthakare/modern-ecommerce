import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'ghost';
}

export default function Button({
  children,
  variant = 'primary',
  className = '',
  ...buttonProps
}: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} ${className}`.trim()}
      type="button"
      {...buttonProps}
    >
      {children}
    </button>
  );
}
