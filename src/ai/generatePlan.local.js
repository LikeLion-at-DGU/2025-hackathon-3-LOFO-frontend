// src/ai/generatePlan.local.js
import { CreateMLCEngine } from "@mlc-ai/web-llm";

// 가벼운 모델부터 시작. 더 작게 쓰려면 다른 프리셋으로 교체 가능.
const MODEL = "Phi-3-mini-4k-instruct-q4f16_1-MLC";

let enginePromise = null;

async function getEngine(onProgress) {
  if (!("gpu" in navigator)) {
    throw new Error("이 브라우저/기기는 WebGPU를 지원하지 않습니다.");
  }
  if (!enginePromise) {
    enginePromise = CreateMLCEngine(MODEL, {
      initProgressCallback: (p) => {
        if (onProgress) onProgress(p.text ?? "");
        else console.log("[web-llm]", p.text);
      },
    });
  }
  return enginePromise;
}

function coerceJSON(text) {
  // 모델이 앞뒤에 설명을 붙였을 경우 JSON 덩어리만 추출
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start >= 0 && end > start) {
    return JSON.parse(text.slice(start, end + 1));
  }
  return JSON.parse(text);
}

export async function generatePlanLocal(goal, dueDate, onProgress) {
  const engine = await getEngine(onProgress);

  const prompt = [
    `목표: ${goal}`,
    `최종 마감기한(3단계): ${dueDate}`,
    "- 총 3단계로 나누고, 각 단계는 title, bullets(2~4개), dueDate(YYYY-MM-DD) 포함.",
    '- 반드시 하나의 JSON만 출력: {"steps":[{"idx":1,"title":"...","bullets":["..."],"dueDate":"YYYY-MM-DD"}, ...]}',
  ].join("\n");

  const reply = await engine.chat.completions.create({
    messages: [
      { role: "system", content: "한국어로, 반드시 JSON만 반환하세요." },
      { role: "user", content: prompt },
    ],
    temperature: 0.2,
  });

  const content = reply?.choices?.[0]?.message?.content ?? "{}";
  const parsed = coerceJSON(content);
  if (!Array.isArray(parsed.steps)) throw new Error("JSON 파싱 실패");

  // idx, dueDate 보정
  parsed.steps.forEach((s, i) => {
    if (typeof s.idx !== "number") s.idx = i + 1;
    if (!s.dueDate) s.dueDate = dueDate;
  });

  return parsed.steps;
}
