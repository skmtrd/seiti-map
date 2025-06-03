import { useEffect, useRef } from "react";

interface UsePreventScrollOptions {
  wheel?: boolean;
  touch?: boolean;
  keyboard?: boolean;
  enabled?: boolean;
}

export function usePreventScroll<T extends HTMLElement = HTMLDivElement>(
  options: UsePreventScrollOptions = {}
) {
  const { wheel = true, touch = true, keyboard = false, enabled = true } = options;

  const elementRef = useRef<T>(null);

  useEffect(() => {
    if (!enabled) return;

    const element = elementRef.current;
    if (!element) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleTouchStart = (e: TouchEvent) => {
      e.stopPropagation();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // スクロール関連のキーを無効化
      const scrollKeys = ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", "Space"];
      if (scrollKeys.includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // イベントリスナーを条件付きで追加
    if (wheel) {
      element.addEventListener("wheel", handleWheel, { passive: false });
    }

    if (touch) {
      element.addEventListener("touchmove", handleTouchMove, { passive: false });
      element.addEventListener("touchstart", handleTouchStart, { passive: false });
    }

    if (keyboard) {
      element.addEventListener("keydown", handleKeyDown, { passive: false });
    }

    return () => {
      // クリーンアップ
      if (wheel) {
        element.removeEventListener("wheel", handleWheel);
      }
      if (touch) {
        element.removeEventListener("touchmove", handleTouchMove);
        element.removeEventListener("touchstart", handleTouchStart);
      }
      if (keyboard) {
        element.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [wheel, touch, keyboard, enabled]);

  return elementRef;
}
