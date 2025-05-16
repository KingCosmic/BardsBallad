import { useEffect, useRef, useState } from 'react';

export function useLiveRect(selector: string | null, active: boolean) {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    let el: Element | null = null;

    const update = () => {
      if (!selector) return;
      el = document.querySelector(selector);
      if (el) {
        const newRect = el.getBoundingClientRect();
        setRect(prev =>
          !prev || JSON.stringify(prev) !== JSON.stringify(newRect)
            ? newRect
            : prev
        );
      }

      frameRef.current = requestAnimationFrame(update);
    };

    if (active && selector) {
      update(); // Start loop
    }

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [selector, active]);

  return rect;
}