export function toAbsUrl(path) {
  if (!path) return "/fallback.jpg";
  if (/^https?:\/\//.test(path)) return path;

  let base = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "";
  base = base.replace(/\/api\/?$/, ""); // 뒤에 /api 잘라내기

  //const base = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "";
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}
