import { useEffect, useRef, useState } from 'react';

const VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_041744_63efcd78-bf7d-4039-99e2-2461e8a61903.mp4';
const SENSITIVITY = 0.8;
const EMAIL = 'hello@mainframe.co';
const NAV_LINKS = ['Labs', 'Studio', 'Openings', 'Shop'];
const PILLS = ['Pitch us an idea', 'Come work here', 'Send a brief hello', 'See how we operate'];

function useTypewriter(text: string, speed = 38, startDelay = 600) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let interval: number | undefined;
    const timeout = window.setTimeout(() => {
      interval = window.setInterval(() => {
        setCount((c) => {
          if (c >= text.length) {
            window.clearInterval(interval);
            return c;
          }
          return c + 1;
        });
      }, speed);
    }, startDelay);
    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, [text, speed, startDelay]);

  return { displayed: text.slice(0, count), done: count >= text.length };
}

function CopyIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <rect x="4" y="4" width="7" height="7" rx="1" />
      <rect x="1" y="1" width="7" height="7" rx="1" />
    </svg>
  );
}

export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetTime = useRef(0);
  const seeking = useRef(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pillsVisible, setPillsVisible] = useState(false);

  const { displayed, done } = useTypewriter(
    'Glad you stopped in. Good taste tends to find us. Now, what are we building?'
  );

  useEffect(() => {
    const t = window.setTimeout(() => setPillsVisible(true), 400);
    return () => window.clearTimeout(t);
  }, []);

  const seek = () => {
    const video = videoRef.current;
    if (!video || seeking.current || !isFinite(video.duration)) return;
    seeking.current = true;
    video.currentTime = targetTime.current;
  };

  const handleSeeked = () => {
    seeking.current = false;
    const video = videoRef.current;
    if (video && Math.abs(targetTime.current - video.currentTime) > 0.01) seek();
  };

  useEffect(() => {
    let prevX: number | null = null;
    const onMove = (e: MouseEvent) => {
      const video = videoRef.current;
      if (!video || !isFinite(video.duration)) return;
      if (prevX === null) {
        prevX = e.clientX;
        return;
      }
      const delta = e.clientX - prevX;
      prevX = e.clientX;
      const offset = (delta / window.innerWidth) * SENSITIVITY * video.duration;
      targetTime.current = Math.min(video.duration, Math.max(0, targetTime.current + offset));
      seek();
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const pillBase =
    'inline-flex items-center justify-center rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap';

  return (
    <div className="relative min-h-screen text-white" style={{ fontFamily: 'var(--font-body)' }}>
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        muted
        playsInline
        preload="auto"
        onSeeked={handleSeeked}
        className="fixed inset-0 w-full h-full object-cover"
        style={{ zIndex: 0, objectPosition: '70% center' }}
      />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 flex justify-between items-center px-5 sm:px-8 py-4 sm:py-5" style={{ zIndex: 10 }}>
        <div className="flex items-center gap-3">
          <span className="text-[21px] sm:text-[26px] tracking-tight text-white" style={{ fontFamily: 'var(--font-heading)' }}>
            Mainframe®
          </span>
          <span className="text-[25px] sm:text-[30px] text-white select-none" style={{ letterSpacing: '-0.02em' }}>
            ✳︎
          </span>
        </div>

        <div className="hidden md:flex text-[23px] text-white">
          {NAV_LINKS.map((label, i) => (
            <span key={label}>
              <a href="#" className="hover:opacity-60 transition-opacity">{label}</a>
              {i < NAV_LINKS.length - 1 && ', '}
            </span>
          ))}
        </div>

        <a href="#" className="hidden md:block text-[23px] text-white underline underline-offset-2 hover:opacity-60 transition-opacity">
          Get in touch
        </a>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
          className="md:hidden flex flex-col gap-[5px]"
        >
          <span className={`block w-6 h-[2px] bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`block w-6 h-[2px] bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-[2px] bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </button>
      </nav>

      {/* Mobile overlay */}
      <div
        className="md:hidden fixed inset-0 bg-black/90 backdrop-blur-md flex flex-col justify-center items-start px-8 gap-8 transition-opacity duration-300"
        style={{ zIndex: 9, opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? 'auto' : 'none' }}
      >
        {NAV_LINKS.map((label) => (
          <a key={label} href="#" className="text-[32px] font-medium text-white" onClick={() => setMenuOpen(false)}>
            {label}
          </a>
        ))}
        <a href="#" className="text-[32px] font-medium text-white underline" onClick={() => setMenuOpen(false)}>
          Get in touch
        </a>
      </div>

      {/* Hero */}
      <section
        className="relative h-screen flex flex-col justify-end pb-12 md:justify-center md:pb-0 px-5 sm:px-8 md:px-10 overflow-hidden"
        style={{ zIndex: 1 }}
      >
        <div className="relative max-w-xl" style={{ zIndex: 10 }}>
          <p
            className="pointer-events-none select-none mb-5 sm:mb-6 text-white"
            style={{ fontSize: 'clamp(18px, 4vw, 26px)', lineHeight: 1.3, fontWeight: 400, filter: 'blur(4px)' }}
          >
            Hey there, meet A.R.I.A,
            <br />
            Mainframe&apos;s Adaptive Response Interface Agent
          </p>

          <p
            className="text-white mb-5 sm:mb-6"
            style={{ fontSize: 'clamp(18px, 4vw, 26px)', lineHeight: 1.35, fontWeight: 400, minHeight: 54 }}
          >
            {displayed}
            {!done && (
              <span
                className="inline-block w-[2px] h-[1.1em] bg-white align-middle ml-[2px]"
                style={{ animation: 'blink 1s step-end infinite' }}
              />
            )}
          </p>

          <div
            className="flex flex-wrap gap-y-1"
            style={{
              opacity: pillsVisible ? 1 : 0,
              transform: pillsVisible ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
            }}
          >
            {PILLS.map((label) => (
              <button
                key={label}
                type="button"
                className={`${pillBase} bg-white text-black border border-black/10 hover:bg-black hover:text-white transition-colors duration-200`}
              >
                {label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(EMAIL)}
              className={`${pillBase} gap-2 sm:gap-3 text-white bg-transparent border border-white hover:bg-white hover:text-black transition-colors duration-200`}
            >
              <span>
                Reach us: <span className="underline underline-offset-1">{EMAIL}</span>
              </span>
              <CopyIcon />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
