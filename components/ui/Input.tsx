'use client'

import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

const inputVariants = cva(
  'w-full border-3 border-shin-black rounded-lg px-4 py-3 bg-white font-body text-shin-black transition-all focus:outline-none',
  {
    variants: {
      variant: {
        default: 'focus:border-shin-red focus:shadow-[3px_3px_0_#E8272A]',
        error: 'border-shin-red bg-red-50',
        success: 'border-shin-green bg-green-50',
        code: 'font-display text-3xl text-center tracking-[0.3em] uppercase',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ variant, className, ...props }, ref) => {
    return (
      <input ref={ref} className={inputVariants({ variant, className })} {...props} />
    )
  }
)
Input.displayName = 'Input'
