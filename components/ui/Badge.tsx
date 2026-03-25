'use client'

import { cva, type VariantProps } from 'class-variance-authority'

const badgeVariants = cva(
  'inline-flex items-center gap-1 font-bold border-2 border-shin-black',
  {
    variants: {
      variant: {
        points: 'bg-shin-yellow text-shin-black px-2.5 py-0.5 rounded text-sm',
        turn: 'bg-shin-red text-white px-2.5 py-0.5 rounded text-sm animate-pulse',
        language: 'px-2 py-0.5 rounded text-xs',
        online: 'bg-shin-green text-white px-2 py-0.5 rounded-full text-xs',
        difficulty: 'px-2 py-0.5 rounded text-xs uppercase',
      },
    },
    defaultVariants: {
      variant: 'points',
    },
  }
)

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ variant, className, ...props }: BadgeProps) {
  return <span className={badgeVariants({ variant, className })} {...props} />
}

export function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const colors = {
    easy: 'bg-shin-green text-white',
    medium: 'bg-shin-orange text-white',
    hard: 'bg-shin-red text-white',
  }
  const labels = { easy: 'Facil', medium: 'Media', hard: 'Alta' }
  const key = difficulty as keyof typeof colors
  return (
    <Badge variant="difficulty" className={colors[key] || colors.easy}>
      {labels[key] || difficulty}
    </Badge>
  )
}
