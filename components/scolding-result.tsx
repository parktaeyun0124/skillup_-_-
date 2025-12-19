import { Card } from "@/components/ui/card"

interface ScoldingResultProps {
  message: string
  character: string
}

export function ScoldingResult({ message, character }: ScoldingResultProps) {
  const characterEmoji = {
    friend: "😤",
    principal: "👔",
    grandma: "👵",
  }[character]

  return (
    <Card className="p-8 bg-gradient-to-br from-rose-100 to-orange-100 border-4 border-rose-300 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-5xl">{characterEmoji}</span>
          <h3 className="text-2xl font-bold">잔소리 시작!</h3>
        </div>
        <div className="bg-white/80 p-6 rounded-lg border-2 border-rose-200 shadow-inner">
          <p className="text-lg leading-relaxed whitespace-pre-line font-medium">{message}</p>
        </div>
      </div>
    </Card>
  )
}
