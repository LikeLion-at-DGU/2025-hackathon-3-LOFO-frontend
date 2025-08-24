import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import * as S from "./../Styled";

/**
 * 목표/기한/모드 배지를 보여주는 박스
 * - goal: string (없으면 "—")
 * - dueDate: YYYY-MM-DD 또는 Date 파싱 가능한 값 (없으면 "—")
 * - mode: "local" | "server" | 기타 (기타는 server 취급)
 */
export function PlanGoalBox({ goal, dueDate, mode }) {
  const goalText = goal || "—";
  const dateText = formatDate(dueDate);
  const resolvedMode = mode === "local" ? "local" : "server";
  const label =
    resolvedMode === "local" ? "LOCAL (무료·온디바이스)" : "SERVER (Netlify 함수)";

  return (
    <S.GoalBox>
      <S.GoalTitle>내 목표</S.GoalTitle>
      <S.GoalText>{goalText}</S.GoalText>

      <S.Row>
        <span>마감기한</span>
        <strong>{dateText}</strong>
      </S.Row>

      {/* Styled에서 $mode 프롭을 사용해 색상 분기 
      <S.ModePill $mode={resolvedMode}>{label}</S.ModePill>
      --> 제거 예정 */}
    </S.GoalBox>
  );
}

/* ---------- 내부 유틸 함수 ---------- */

/** YYYY-MM-DD로 표시. 값이 없거나 파싱 실패 시 "—"(또는 원문) */
function formatDate(input) {
  if (!input) return "—";
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return String(input);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}