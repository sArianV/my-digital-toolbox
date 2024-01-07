import { useEffect, useRef, useState } from 'react';

interface Size {
  width: number;
  height: number;
}

const useResizeObserver = (elementId: string): Size => {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = document.getElementById(elementId);
    if (!element) return;

    elementRef.current = element;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      }
    });

    resizeObserver.observe(elementRef.current);

    return () => {
      if (elementRef.current) {
        resizeObserver.unobserve(elementRef.current!);
        resizeObserver.disconnect();
      }
    };
  }, [elementId]);

  return size;
};

export default useResizeObserver;