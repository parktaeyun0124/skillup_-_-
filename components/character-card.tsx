"use client"

import { Card } from "@/components/ui/card"

interface CharacterCardProps {
  character: string
  title: string
  description: string
  emoji: string
  selected: boolean
  onClick: () => void
}

export function CharacterCard({ title, description, emoji, selected, onClick }: CharacterCardProps) {
  return (
    <Card
      onClick={onClick}
      className={`p-6 cursor-pointer transition-all hover:scale-105 hover:shadow-xl ${
        selected
          ? "border-4 border-orange-500 bg-orange-50 shadow-xl"
          : "border-2 bg-white/60 backdrop-blur hover:border-orange-300"
      }`}
    >
      <div className="space-y-3 text-center">
        <div className="text-6xl">{emoji}</div>
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </Card>
  )
}
