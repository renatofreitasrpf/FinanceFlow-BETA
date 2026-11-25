import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'

type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'text'
}>

export function Button({
  children,
  className = '',
  variant = 'primary',
  ...props
}: ButtonProps) {
  const variantClass = {
    primary: 'primary-button',
    secondary: 'secondary-button',
    text: 'text-button',
  }[variant]

  return (
    <button className={`${variantClass} ${className}`.trim()} {...props}>
      {children}
    </button>
  )
}