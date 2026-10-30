import { MouseEvent, PointerEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { config } from '@/config';
import { WhatsAppIcon } from '@/components/icons/Icons';

type Offset = { x: number; y: number };

const storageKey = 'soliance-whatsapp-offset';
const dragThreshold = 6;
const edgeMargin = 8;

const readStoredOffset = (): Offset => {
  try {
    const stored = JSON.parse(window.localStorage.getItem(storageKey) ?? 'null') as Offset | null;
    return stored && Number.isFinite(stored.x) && Number.isFinite(stored.y) ? stored : { x: 0, y: 0 };
  } catch {
    return { x: 0, y: 0 };
  }
};

/** Floating WhatsApp link, bottom right, that the visitor can drag anywhere on screen. The offset is kept between visits. */
export const WhatsAppButton = () => {
  const { t } = useTranslation('common');
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 });
  const drag = useRef<{ pointerX: number; pointerY: number; start: Offset; rest: DOMRect; moved: boolean } | null>(null);
  const wasDragged = useRef(false);

  // Keeps the button fully on screen: the offset is relative to its resting place (offset 0, bottom right).
  const clamp = (next: Offset, rest: DOMRect): Offset => ({
    x: Math.min(0, Math.max(edgeMargin - rest.left, next.x)),
    y: Math.min(window.innerHeight - edgeMargin - rest.bottom, Math.max(edgeMargin - rest.top, next.y)),
  });

  const restRect = (current: Offset): DOMRect | null => {
    const rect = linkRef.current?.getBoundingClientRect();
    return rect ? new DOMRect(rect.left - current.x, rect.top - current.y, rect.width, rect.height) : null;
  };

  useEffect(() => {
    const keepOnScreen = () =>
      setOffset((current) => {
        const rest = restRect(current);
        return rest ? clamp(current, rest) : current;
      });
    setOffset(readStoredOffset());
    keepOnScreen();
    window.addEventListener('resize', keepOnScreen);
    return () => window.removeEventListener('resize', keepOnScreen);
  }, []);

  const startDrag = (event: PointerEvent<HTMLAnchorElement>) => {
    if (event.button !== 0) return;
    const rest = restRect(offset);
    if (!rest) return;
    drag.current = { pointerX: event.clientX, pointerY: event.clientY, start: offset, rest, moved: false };
  };

  const moveDrag = (event: PointerEvent<HTMLAnchorElement>) => {
    const state = drag.current;
    if (!state) return;
    const dx = event.clientX - state.pointerX;
    const dy = event.clientY - state.pointerY;
    if (!state.moved && Math.hypot(dx, dy) < dragThreshold) return;
    if (!state.moved) {
      state.moved = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    setOffset(clamp({ x: state.start.x + dx, y: state.start.y + dy }, state.rest));
  };

  const endDrag = () => {
    const state = drag.current;
    drag.current = null;
    wasDragged.current = Boolean(state?.moved);
    if (state?.moved) {
      setOffset((current) => {
        try {
          window.localStorage.setItem(storageKey, JSON.stringify(current));
        } catch {
          // Storage refused: the position only lasts for the visit.
        }
        return current;
      });
    }
  };

  const openUnlessDragged = (event: MouseEvent<HTMLAnchorElement>) => {
    if (wasDragged.current) event.preventDefault();
    wasDragged.current = false;
  };

  return (
    <a
      ref={linkRef}
      href={config.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('whatsapp.label')}
      title={t('whatsapp.label')}
      draggable={false}
      onPointerDown={startDrag}
      onPointerMove={moveDrag}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClick={openUnlessDragged}
      style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` }}
      className="fixed bottom-4 right-4 z-30 flex h-14 w-14 cursor-grab touch-none select-none items-center justify-center rounded-full bg-[#25D366] text-white shadow-lift transition-[box-shadow,filter] hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-night active:cursor-grabbing motion-reduce:transition-none lg:bottom-6 lg:right-6"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
};
