 function parseDeadlineLocalEnd(deadline) {
   if (!deadline) return null;
   // ISO(시간 포함)면 그대로
   if (/\dT\d/.test(deadline)) return new Date(deadline);
   // YYYY-MM-DD면 로컬 타임의 그 날 23:59:59.999 로 설정
   const [y, m, d] = deadline.split("-").map(Number);
   return new Date(y, (m || 1) - 1, d || 1, 23, 59, 59, 999);
 }

 export function getStepButtonState({ status, deadline }) {
   const now = new Date();
   const due = parseDeadlineLocalEnd(deadline);
   const isClosed = !!due && now > due;

   
  if (isClosed) return { label: "업로드 완료", disabled: true, variant: "ghost" };
  if (status === "DONE") return { label: "추가 업로드", disabled: false, variant: "secondary" };
  return { label: "미션 업로드", disabled: false, variant: "primary" };
}
