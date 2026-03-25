'use client'

import { cva, type VariantProps } from 'class-variance-authority'

const cardVariants = cva('rounded-xl', {
  variants: {
    variant: {
      game: 'bg-white border-4 border-shin-black shadow-[6px_6px_0_#1A1A1A] p-4',
      player: 'border-3 border-shin-black p-3',
      question: 'bg-white border-l-8 p-6',
      phrase: 'bg-shin-cream border-3 border-shin-black p-2 cursor-pointer hover:-translate-y-0.5 transition-transform',
      score: 'bg-shin-yellow border-4 border-shin-black p-4 text-center',
      result: 'bg-white border-5 border-shin-black shadow-[8px_8px_0_#1A1A1A] p-8',
    },
  },
  defaultVariants: {
    variant: 'game',
  },
})

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export function Card({ variant, className, ...props }: CardProps) {
  return <div className={cardVariants({ variant, className })} {...props} />
}
