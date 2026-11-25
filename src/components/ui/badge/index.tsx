import type { HTMLAttributes, PropsWithChildren } from 'react'

type BadgeProps = PropsWithChildren<HTMLAttributes<HTMLSpanElement> & {
  variant?: 'success' | 'expense' | 'neutral'
}>

export function Badge({ children, className = '', variant = 'neutral', ...props }: BadgeProps) {
  return (
    <span className={`badge badge-${variant} ${className}`.trim()} {...props}>
      {children}
    </span>
  )
}