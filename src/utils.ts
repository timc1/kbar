import React from "react";

export function swallowEvent(event) {
  event.stopPropagation();
  event.preventDefault();
}

export function useOuterClick(
  dom: React.RefObject<HTMLElement>,
  cb: () => void
) {
  const cbRef = React.useRef(cb);
  cbRef.current = cb;

  React.useEffect(() => {
    function handleMouseDown(event) {
      if (dom.current?.contains(event.target)) {
        return;
      }
      cbRef.current();
    }
    window.addEventListener("mousedown", handleMouseDown);
    return () => window.removeEventListener("mousedown", handleMouseDown);
  }, [dom]);
}
