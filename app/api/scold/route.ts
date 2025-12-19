import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { character, task, deadline, mood, conditions } = body

    console.log("[v0] Scolding request received:", { character, task, deadline, mood, conditions })

    // Character-specific system prompts
    const characterPrompts = {
      friend: `당신은 직설적이고 현실적인 친구입니다. 반말을 사용하고, 짧고 강하게 말합니다.
욕설은 **로 처리하되 강한 어감이 느껴지도록 합니다.
사용자가 미루고 있는 일에 대해 현실을 직격하는 말투로 혼내주세요.`,
      principal: `당신은 진지하고 엄격한 교장 선생님입니다. 존댓말을 사용하고, 실망감과 교훈이 담긴 훈화조로 말합니다.
품위를 유지하면서도 따끔한 충고를 해주세요.`,
      grandma: `당신은 구수하고 공격적인 욕쟁이 할머니입니다. 잔소리를 폭격처럼 쏟아냅니다.
욕설은 **로 처리하되 구수하고 강한 어감이 느껴지도록 합니다.`,
    }

    const moodDescriptions = {
      okay: "괜찮다고 생각하지만",
      lazy: "귀찮아서 미루고 있는",
      doomed: "망할 것 같은 상황인",
    }

    const conditionText =
      conditions.length > 0
        ? `추가로 다음 상황도 있습니다: ${conditions
            .map((c: string) => {
              if (c === "d-day") return "마감 D-1"
              if (c === "incomplete") return "오늘 할 일 미완료"
              if (c === "below-target") return "목표 시간 미달"
              return c
            })
            .join(", ")}`
        : ""

    const userPrompt = `
사용자가 미루고 있는 일: ${task}
마감일: ${deadline}
현재 상태: ${moodDescriptions[mood as keyof typeof moodDescriptions]}
${conditionText}

위 상황에 대해 반드시 다음 형식으로만 답변해주세요:

[혼내는 핵심 한 문장]
→ [현재 상황 팩트 한 줄]
→ [지금 당장 해야 할 행동 1개]

예시:
지금 이러고 있을 상황이 아님
마감까지 6시간 남았는데 아직 시작 안 함
지금 바로 자료 조사 10분만 하고 와라
`

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: characterPrompts[character as keyof typeof characterPrompts],
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        temperature: 0.9,
        max_tokens: 300,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const message = data.choices[0].message.content

    console.log("[v0] Generated scolding:", message)

    return NextResponse.json({ message })
  } catch (error) {
    console.error("[v0] Error in scold API:", error)
    return NextResponse.json({ error: "잔소리 생성에 실패했습니다. 다시 시도해주세요." }, { status: 500 })
  }
}
