'use client'

import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-bold transition-all duration-150 cursor-pointer select-none border-3 border-shin-black active:translate-y-0.5 active:shadow-[1px_1px_0_#1A1A1A] disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none',
  {
    variants: {
      variant: {
        primary:
          'bg-shin-red text-white hover:-translate-y-1 hover:shadow-[4px_4px_0_#1A1A1A]',
        secondary:
          'bg-shin-yellow text-shin-black hover:-translate-y-1 hover:shadow-[4px_4px_0_#1A1A1A]',
        ghost:
          'bg-transparent text-shin-black border-dashed hover:-translate-y-1',
        success:
          'bg-shin-green text-white hover:-translate-y-1 hover:shadow-[4px_4px_0_#1A1A1A]',
        danger:
          'bg-shin-red text-white border-red-900 hover:-translate-y-1 hover:shadow-[4px_4px_0_#1A1A1A]',
      },
      size: {
        sm: 'text-sm px-3 py-1.5 rounded-md',
        md: 'text-base px-4 py-2 rounded-lg',
        lg: 'text-lg px-6 py-3 rounded-lg font-display',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return (
    <button className={buttonVariants({ variant, size, className })} {...props} />
  )
}
