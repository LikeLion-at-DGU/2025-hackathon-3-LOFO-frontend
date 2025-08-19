export async function generatePlanServer(goal, dueDate) {
  const res = await fetch("/.netlify/functions/generate-plan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ goal, dueDate }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`서버 호출 실패: ${text}`);
  }
  const data = await res.json(); // { steps: [...] }
  if (!Array.isArray(data.steps)) throw new Error("서버 응답 형식 오류");
  return data.steps;
}
