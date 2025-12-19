"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { CharacterCard } from "@/components/character-card"
import { ScoldingResult } from "@/components/scolding-result"

type Character = "friend" | "principal" | "grandma"
type Mood = "okay" | "lazy" | "doomed"

interface ScoldingData {
  character: Character
  task: string
  deadline: string
  mood: Mood
  conditions: string[]
}

export default function HomePage() {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
  const [task, setTask] = useState("")
  const [deadline, setDeadline] = useState("")
  const [mood, setMood] = useState<Mood>("okay")
  const [conditions, setConditions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [scoldingMessage, setScoldingMessage] = useState<string | null>(null)

  const handleConditionChange = (condition: string, checked: boolean) => {
    if (checked) {
      setConditions([...conditions, condition])
    } else {
      setConditions(conditions.filter((c) => c !== condition))
    }
  }

  const handleScoldMe = async () => {
    if (!selectedCharacter || !task || !deadline) {
      alert("캐릭터, 미루고 있는 일, 마감일을 모두 입력해주세요!")
      return
    }

    setIsLoading(true)
    setScoldingMessage(null)

    try {
      const response = await fetch("/api/scold", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          character: selectedCharacter,
          task,
          deadline,
          mood,
          conditions,
        }),
      })

      const data = await response.json()
      setScoldingMessage(data.message)
    } catch (error) {
      console.error("[v0] Error fetching scolding:", error)
      alert("잔소리를 생성하는 중 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-violet-100 py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3 pt-4">
          <h1 className="text-5xl md:text-6xl font-bold text-balance tracking-tight">혼내줘 AI</h1>
          <p className="text-lg md:text-xl text-muted-foreground text-pretty max-w-2xl mx-auto leading-relaxed">
            해야 할 일을 미루고 있을 때, 내가 고른 캐릭터가 대신 나를 혼내주고 지금 당장 해야 할 행동을 한 줄로
            알려줍니다
          </p>
        </div>

        {/* Character Selection */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center">누구한테 혼나고 싶으세요?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CharacterCard
              character="friend"
              title="부랄친구"
              description="친구처럼 직설적이고 현실적으로 혼내줍니다"
              emoji="😤"
              selected={selectedCharacter === "friend"}
              onClick={() => setSelectedCharacter("friend")}
            />
            <CharacterCard
              character="principal"
              title="교장 쌤 훈화"
              description="진지하고 실망스러운 톤으로 훈계합니다"
              emoji="👔"
              selected={selectedCharacter === "principal"}
              onClick={() => setSelectedCharacter("principal")}
            />
            <CharacterCard
              character="grandma"
              title="욕쟁이 할머니"
              description="구수하게 잔소리 폭격을 날립니다"
              emoji="👵"
              selected={selectedCharacter === "grandma"}
              onClick={() => setSelectedCharacter("grandma")}
            />
          </div>
        </div>

        {/* Input Form */}
        <Card className="p-6 md:p-8 bg-white/80 backdrop-blur shadow-lg border-2">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="task" className="text-base font-semibold">
                지금 미루고 있는 일
              </Label>
              <Textarea
                id="task"
                placeholder="예: 프로젝트 제안서 작성"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                className="resize-none h-20"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="deadline" className="text-base font-semibold">
                  마감일 또는 목표 시간
                </Label>
                <Input
                  id="deadline"
                  type="text"
                  placeholder="예: 내일 오후 3시"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mood" className="text-base font-semibold">
                  현재 상태
                </Label>
                <select
                  id="mood"
                  value={mood}
                  onChange={(e) => setMood(e.target.value as Mood)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                >
                  <option value="okay">😐 괜찮음</option>
                  <option value="lazy">😓 귀찮음</option>
                  <option value="doomed">😱 망함 직전</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">추가 조건</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="d-day"
                    checked={conditions.includes("d-day")}
                    onCheckedChange={(checked) => handleConditionChange("d-day", checked as boolean)}
                  />
                  <label
                    htmlFor="d-day"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    마감 D-1
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="incomplete"
                    checked={conditions.includes("incomplete")}
                    onCheckedChange={(checked) => handleConditionChange("incomplete", checked as boolean)}
                  />
                  <label
                    htmlFor="incomplete"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    오늘 할 일 미완료
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="below-target"
                    checked={conditions.includes("below-target")}
                    onCheckedChange={(checked) => handleConditionChange("below-target", checked as boolean)}
                  />
                  <label
                    htmlFor="below-target"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    목표 시간 미달
                  </label>
                </div>
              </div>
            </div>

            <Button
              onClick={handleScoldMe}
              disabled={isLoading || !selectedCharacter || !task || !deadline}
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white shadow-lg"
            >
              {isLoading ? "혼내는 중..." : "지금 혼내줘 🔥"}
            </Button>
          </div>
        </Card>

        {/* Result */}
        {scoldingMessage && <ScoldingResult message={scoldingMessage} character={selectedCharacter!} />}
      </div>
    </div>
  )
}
