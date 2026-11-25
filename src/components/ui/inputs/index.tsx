import { useId, type InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
}

export function Input({ label, error, id, className = '', ...props }: InputProps) {
  const generatedId = useId()
  const inputId = id ?? props.name ?? generatedId

  return (
    <label className="field-label" htmlFor={inputId}>
      {label}
      <input
        id={inputId}
        className={`field-input ${className}`.trim()}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && <span className="form-error" id={`${inputId}-error`}>{error}</span>}
    </label>
  )
}