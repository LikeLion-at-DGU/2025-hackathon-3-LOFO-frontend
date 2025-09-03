 function parseDeadlineLocalEnd(deadline) {
   if (!deadline) return null;
   // ISO(시간 포함)면 그대로
   if (/\dT\d/.test(deadline)) return new Date(deadline);
   // YYYY-MM-DD면 로컬 타임의 그 날 23:59:59.999 로 설정
   const [y, m, d] = deadline.split("-").map(Number);
   return new Date(y, (m || 1) - 1, d || 1, 23, 59, 59, 999);
 }

 
  export function getMissionButtonState({
    stepNo,         // 1 | 2 | 3
    status,         // "TODO" | "DONE"
    missionDone,    // boolean
  }) {
    // 전체 미션 완료면 전부 잠금
    if (missionDone) return { label: "업로드 완료", disabled: true, variant: "ghost" };

    // 3단계 규칙
    if (stepNo === 3) {
      if (status === "DONE") return { label: "업로드 완료", disabled: true, variant: "ghost" };
      return { label: "미션 업로드", disabled: false, variant: "primary" };
    }

    // 1·2단계 규칙
    if (status === "DONE") return { label: "추가 업로드", disabled: false, variant: "secondary" };
    return { label: "미션 업로드", disabled: false, variant: "primary" };
  }

  // 버튼 라벨/비활성화 계산 (필요 시 공용 utils/steps로 이동)
//export function getStepButtonState({ status, deadline, missionDone }) {
  //const now = new Date();
  //const due = deadline ? new Date(deadline) : null;
  //const isClosed = due && now > due;

 // 최종 제출 후(상태가 DONE)엔 전부 잠금
 
  //if (status === "DONE") return { label: "업로드 완료", disabled: true, variant: "ghost" };
  //if (isClosed) return { label: "업로드 완료", disabled: true,  variant: "ghost" };
  //if (status === "DONE") return { label: "추가 업로드", disabled: false, variant: "secondary" };
  //return { label: "미션 업로드",   disabled: false, variant: "primary" };
//}
