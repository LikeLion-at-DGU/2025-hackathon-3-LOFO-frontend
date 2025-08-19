// netlify/functions/generate-plan.js
export async function handler(event) {
  try {
    const { goal, dueDate } = JSON.parse(event.body || "{}");
    if (!goal || !dueDate) {
      return { statusCode: 400, body: JSON.stringify({ error: "goal/dueDate required" }) };
    }

    // 프롬프트: JSON만 출력하도록 강하게 유도
    const prompt = [
      `목표: ${goal}`,
      `최종 마감기한(3단계): ${dueDate}`,
      "- 총 3단계",
      "- 각 단계 객체는 { idx, title, bullets(2~4개), dueDate(YYYY-MM-DD) } 형식",
      '- 최종 출력은 오직 하나의 JSON: {"steps":[...]} 만 반환',
    ].join("\n");

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          // Structured output: JSON으로만 응답하도록 힌트
          response_mime_type: "application/json",
        },
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      return { statusCode: 500, body: JSON.stringify({ error: "gemini_failed", detail: text }) };
    }

    const out = await resp.json();

    // 응답 파싱 (response_mime_type을 줬어도 text로 올 수 있어 방어적으로 처리)
    const part =
      out?.candidates?.[0]?.content?.parts?.find((p) => typeof p?.text === "string")?.text ?? "{}";

    let parsed;
    try {
      parsed = JSON.parse(part);
    } catch {
      // 앞뒤 설명문을 붙이는 경우가 드물게 있어 JSON 덩어리만 추출
      const start = part.indexOf("{");
      const end = part.lastIndexOf("}");
      parsed = start >= 0 && end > start ? JSON.parse(part.slice(start, end + 1)) : {};
    }

    const steps = Array.isArray(parsed.steps) ? parsed.steps : [];

    // 간단 보정: idx 누락/문자열일 경우 재설정, dueDate 없으면 최종 마감으로 채워 넣기
    steps.forEach((s, i) => {
      if (typeof s.idx !== "number") s.idx = i + 1;
      if (!s.dueDate) s.dueDate = dueDate;
    });

    return { statusCode: 200, body: JSON.stringify({ steps }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: "server_error", message: e.message }) };
  }
}
