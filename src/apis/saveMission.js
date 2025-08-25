import { instance } from "./instance";

function parse(data) {
  return {
    saved: typeof data?.saved === "boolean" ? data.saved : undefined,
    saved_count: typeof data?.saved_count === "number" ? data.saved_count : undefined,
  };
}

export async function toggleSaveMission({ id }) {   // ← id만 받게
  const payload = { request_id: id };              // ★ 핵심: request_id
  const { data } = await instance.post("/youth/home/save-mission", payload);
  return parse(data);
}
