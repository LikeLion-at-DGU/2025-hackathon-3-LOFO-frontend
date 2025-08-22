import { useState, useCallback } from "react";

/**
 * parentOnClick: 부모가 클릭 핸들러를 주면 그쪽으로 위임
 * onSubmit: 모달에서 '완료' 눌렀을 때 실행(파일 업로드 API 등)
 */
export function useUploadModal({ parentOnClick, onSubmit } = {}) {
  const [open, setOpen] = useState(false);

  const handleClick = useCallback(() => {
    if (typeof parentOnClick === "function") parentOnClick();
    setOpen(true);
  }, [parentOnClick]);

  const handleClose = useCallback(() => setOpen(false), []);

  const handleSubmit = useCallback(
    async (payload) => {
      try {
        if (typeof onSubmit === "function") {
          await onSubmit(payload); // ex) 업로드 API
        }
      } finally {
        setOpen(false);
      }
    },
    [onSubmit]
  );

  return { open, handleClick, handleClose, handleSubmit, setOpen };
}
