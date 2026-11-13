'use client';

import { ElementType, useEffect, useMemo, useRef, useSyncExternalStore } from 'react';
import { gsap } from '@/lib/gsap';
import './TextType.css';

interface TextTypeProps {
  className?: string;
  showCursor?: boolean;
  hideCursorWhileTyping?: boolean;
  cursorCharacter?: string | React.ReactNode;
  cursorBlinkDuration?: number;
  cursorClassName?: string;
  text: string | string[];
  as?: ElementType;
  typingSpeed?: number;
  initialDelay?: number;
  pauseDuration?: number;
  deletingSpeed?: number;
  loop?: boolean;
  textColors?: string[];
  variableSpeed?: { min: number; max: number };
  onSentenceComplete?: (sentence: string, index: number) => void;
  startOnVisible?: boolean;
  reverseMode?: boolean;
}

const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';
const subscribeReduced = (cb: () => void) => {
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};
const getReduced = () => window.matchMedia(REDUCED_QUERY).matches;
const getReducedServer = () => false;

// Joins the sentences into one stable key so a new array literal with the same text
// doesn't restart the typing loop on every parent render.
const SEP = '\u0000';

/**
 * Typewriter text that never changes size.
 *
 * The longest sentence is rendered invisibly in the same grid cell as the typed text, so
 * the box keeps its final size while text is typed and deleted (no layout shift, which
 * matters for every ScrollTrigger below it). The typed layer is aria-hidden and the full
 * text is exposed to assistive tech once, as visually hidden text.
 *
 * Typing writes straight to the DOM (no React re-render per character). Under
 * prefers-reduced-motion the first sentence is shown in full, without typing or blinking.
 */
const TextType = ({
  text,
  as: Tag = 'div',
  typingSpeed = 50,
  initialDelay = 0,
  pauseDuration = 2000,
  deletingSpeed = 30,
  loop = true,
  className = '',
  showCursor = true,
  hideCursorWhileTyping = false,
  cursorCharacter = '|',
  cursorClassName = '',
  cursorBlinkDuration = 0.5,
  textColors = [],
  variableSpeed,
  onSentenceComplete,
  startOnVisible = false,
  reverseMode = false,
  ...props
}: TextTypeProps & React.HTMLAttributes<HTMLElement>) => {
  const containerRef = useRef<HTMLElement>(null);
  const typedRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const reduced = useSyncExternalStore(subscribeReduced, getReduced, getReducedServer);

  const textKey = Array.isArray(text) ? text.join(SEP) : text;
  const textArray = useMemo(() => textKey.split(SEP), [textKey]);
  const longest = useMemo(
    () => textArray.reduce((a, b) => (b.length > a.length ? b : a), ''),
    [textArray]
  );
  const colorsKey = textColors.join(SEP);
  const minSpeed = variableSpeed?.min;
  const maxSpeed = variableSpeed?.max;

  // Keep the latest callback without restarting the loop when it changes identity.
  const onCompleteRef = useRef(onSentenceComplete);
  useEffect(() => {
    onCompleteRef.current = onSentenceComplete;
  }, [onSentenceComplete]);

  // Typing state machine.
  useEffect(() => {
    const container = containerRef.current;
    const typed = typedRef.current;
    if (!container || !typed) return;
    // Lets the CSS failsafe know JS is in charge (see TextType.css).
    container.setAttribute('data-typing', 'on');

    const colors = colorsKey ? colorsKey.split(SEP) : [];
    const cursor = cursorRef.current;
    const prepare = (s: string) => (reverseMode ? s.split('').reverse().join('') : s);
    const setColor = (index: number) => {
      typed.style.color = colors.length ? colors[index % colors.length] : '';
    };
    const setCursorHidden = (hidden: boolean) => {
      cursor?.classList.toggle('text-type__cursor--hidden', hideCursorWhileTyping && hidden);
    };

    if (reduced) {
      typed.textContent = prepare(textArray[0] ?? '');
      setColor(0);
      setCursorHidden(false);
      return;
    }

    let timeout: ReturnType<typeof setTimeout> | undefined;
    let observer: IntersectionObserver | undefined;
    let textIndex = 0;
    let charIndex = 0;
    let deleting = false;
    typed.textContent = '';
    setColor(0);

    const speed = () =>
      minSpeed !== undefined && maxSpeed !== undefined
        ? Math.random() * (maxSpeed - minSpeed) + minSpeed
        : typingSpeed;

    const tick = () => {
      const current = prepare(textArray[textIndex]);
      if (deleting) {
        if (charIndex > 0) {
          charIndex -= 1;
          typed.textContent = current.slice(0, charIndex);
          setCursorHidden(true);
          timeout = setTimeout(tick, deletingSpeed);
          return;
        }
        deleting = false;
        onCompleteRef.current?.(textArray[textIndex], textIndex);
        textIndex = (textIndex + 1) % textArray.length;
        setColor(textIndex);
        timeout = setTimeout(tick, pauseDuration);
        return;
      }
      if (charIndex < current.length) {
        charIndex += 1;
        typed.textContent = current.slice(0, charIndex);
        setCursorHidden(charIndex < current.length);
        timeout = setTimeout(tick, speed());
        return;
      }
      setCursorHidden(false);
      if (!loop && textIndex === textArray.length - 1) return;
      deleting = true;
      timeout = setTimeout(tick, pauseDuration);
    };

    const start = () => {
      timeout = setTimeout(tick, initialDelay);
    };

    if (startOnVisible) {
      observer = new IntersectionObserver(
        entries => {
          if (entries.some(e => e.isIntersecting)) {
            observer?.disconnect();
            start();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(container);
    } else {
      start();
    }

    return () => {
      clearTimeout(timeout);
      observer?.disconnect();
    };
  }, [
    reduced,
    textArray,
    colorsKey,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    initialDelay,
    loop,
    reverseMode,
    minSpeed,
    maxSpeed,
    startOnVisible,
    hideCursorWhileTyping
  ]);

  // Cursor blink (off under reduced motion).
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!showCursor || !cursor || reduced) return;
    const tween = gsap.fromTo(
      cursor,
      { opacity: 1 },
      { opacity: 0, duration: cursorBlinkDuration, repeat: -1, yoyo: true, ease: 'power2.inOut' }
    );
    return () => {
      tween.kill();
      gsap.set(cursor, { clearProps: 'opacity' });
    };
  }, [showCursor, cursorBlinkDuration, reduced]);

  return (
    <Tag ref={containerRef} className={`text-type ${className}`} {...props}>
      <span className="text-type__sr">{textArray.join(' ')}</span>
      <span className="text-type__stage" aria-hidden="true">
        {/* Reserves the final size; never visible (except as a no-JS fallback). */}
        <span className="text-type__ghost">
          {longest}
          {showCursor && <span className="text-type__cursor">{cursorCharacter}</span>}
        </span>
        <span className="text-type__live">
          <span ref={typedRef} className="text-type__content" />
          {showCursor && (
            <span ref={cursorRef} className={`text-type__cursor ${cursorClassName}`}>
              {cursorCharacter}
            </span>
          )}
        </span>
      </span>
    </Tag>
  );
};

export default TextType;
