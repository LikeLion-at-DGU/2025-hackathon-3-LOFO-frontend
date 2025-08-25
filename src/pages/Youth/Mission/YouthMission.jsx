import * as S from "./Styled";
import { YouthTopnav } from "../../../components/Topnav/YouthTopnav";
import MissionEditor from "./MissionEditor";
import { useMyMission } from "../../../hooks/useMyMission";
import { toAbsUrl } from "../../../utils/url";

export default function YouthMission() {
  const { data, loading, error } = useMyMission();

  if (loading) {
    return (
      <S.Page><S.Shell><YouthTopnav />
        <div style={{padding:40, textAlign:"center"}}>불러오는 중…</div>
      </S.Shell></S.Page>
    );
  }

  if (error) {
    return (
      <S.Page><S.Shell><YouthTopnav />
        <div style={{padding:40, color:"#b91c1c"}}>오류: {String(error.message || error)}</div>
      </S.Shell></S.Page>
    );
  }

  // 없으면 “빈 상태” 화면
  if (!data?.steps || data.steps.length === 0) {
    return (
      <S.Page><S.Shell><YouthTopnav />
        <EmptyMission />
      </S.Shell></S.Page>
    );
  }

  // 있으면 MissionEditor를 "plan 단계"로 바로 오픈
  const init = mapServerToEditor(data);

  return (
    <S.PlanPage>
      <S.Shell>
        <YouthTopnav />
        <MissionEditor
          // 서버에서 가져온 값으로 즉시 plan 단계 진입
          key={data?.mission?.id || "no-mission"}
          initialSteps={init.steps}
          initialGoal={init.goal}
          initialDueDate={init.dueDate}
          serverShop={init.shop}
          forcePlanPhase
          missionId={data?.mission?.id}
        />
      </S.Shell>
    </S.PlanPage>
  );
}

function EmptyMission() {
  return (
    <div style={{
      minHeight: 360, display:"grid", placeItems:"center",
      borderRadius:12,
    }}>
      <div style={{textAlign:"center", color:"#475569"}}>
        <div style={{fontSize:18, fontWeight:700, marginBottom:8}}>진행 중인 미션이 없어요!</div>
        <div>지금 바로 상인의 요청을 들어주고 미션을 시작하세요</div>
      </div>
    </div>
  );
}

// 서버 응답 → MissionEditor prop으로 변환
function mapServerToEditor(payload) {
  const { mission, request, steps } = payload || {};
  const toYMD = (d) => (d ? String(d).slice(0,10) : "");

  const shop = {
    id: request?.id,
    name: request?.store_name || "가게",
    imageUrl: toAbsUrl(request?.image || ""),
    naverUrl: request?.url,
    request: `${request?.title ?? ""} · ${request?.category_display ?? ""}`,
  };

  const mappedSteps = Array.isArray(steps) ? steps.map(s => ({
    idx: s.step_no ?? 0,
    title: s.title ?? "단계",
    bullets: [
      s.description?.trim() || "",
      ...(typeof s.reference === "string"
        ? s.reference.split("\n").map(v => v.replace(/^\s*-\s*/, "").trim()).filter(Boolean)
        : []),
    ],
    dueDate: toYMD(s.due),
    status: s.status, // 필요 시 버튼 상태 제어에 사용
  })).sort((a,b)=>a.idx-b.idx) : [];

  return {
    goal: mission?.goal ?? request?.title ?? "AI 미션",
    dueDate: toYMD(mission?.deadline),
    steps: mappedSteps,
    shop,
    missionId: mission?.id,
  };
}
