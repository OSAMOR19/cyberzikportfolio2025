"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { MdOutlineEmail } from "react-icons/md";
import { FaGithub, FaLinkedin, FaTwitter, FaArrowRight } from "react-icons/fa";
import { Check, CircleAlert, CircleCheck, Copy } from "lucide-react";
import { gsap, ScrollTrigger, SplitText, prefersReducedMotion } from "@/lib/gsap";

const EMAIL = "info@cyberzik.online";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Radius of the card's drawn border: rounded-[40px] minus half the 1px stroke. */
const CARD_RADIUS = 39.5;

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f5a764]";

const MONO_LABEL = "font-mono text-[11px] uppercase tracking-[0.22em]";

const socials = [
  {
    name: "Github",
    icon: <FaGithub size={22} />,
    link: "https://github.com/OSAMOR19",
  },
  {
    name: "LinkedIn",
    icon: <FaLinkedin size={22} />,
    link: "https://www.linkedin.com/in/peter-osamor-isaac-chukwuka-003ab51a4/",
  },
  {
    name: "Twitter",
    icon: <FaTwitter size={22} />,
    link: "https://twitter.com/",
  },
];

type FieldName = "name" | "email" | "message";
type Fields = Record<FieldName, string>;
type Errors = Partial<Record<FieldName, string>>;

const FIELD_ORDER: FieldName[] = ["name", "email", "message"];
const EMPTY_FIELDS: Fields = { name: "", email: "", message: "" };

function validate(values: Fields): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = "Please tell me your name.";
  const email = values.email.trim();
  if (!email) errors.email = "Please add your email so I can reply.";
  else if (!EMAIL_RE.test(email))
    errors.email = "That email address doesn't look right. Check it for typos.";
  if (!values.message.trim()) errors.message = "Please write a short message about your project.";
  return errors;
}

const INPUT_BASE =
  "w-full rounded-2xl border bg-white/[.04] text-white placeholder:text-white/35 outline-none transition-[border-color,box-shadow,background-color] duration-200 hover:border-white/30 focus:border-[#f5a764] focus:bg-white/[.06] focus:shadow-[0_0_0_4px_rgba(245,167,100,.18)]";

const inputBorder = (error?: string) => (error ? "border-[#ff9b8f]/70" : "border-white/15");

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className={`mb-3 block text-gray-300 ${MONO_LABEL}`}>
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-2 flex items-start gap-2 text-sm text-[#ff9b8f]">
          <CircleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

export default function Contact() {
  const rootRef = useRef<HTMLElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  /** Fills the station node and fires its ring burst. Set only when motion is allowed. */
  const burstRef = useRef<(() => void) | null>(null);
  const copyTimer = useRef<number | undefined>(undefined);

  const [values, setValues] = useState<Fields>(EMPTY_FIELDS);
  const [errors, setErrors] = useState<Errors>({});
  const [attempted, setAttempted] = useState(false);
  /** Increments on every successful submit (0 = no success message). */
  const [sentKey, setSentKey] = useState(0);
  const [copied, setCopied] = useState(false);

  // ---------------------------------------------------------------------------
  // Scroll choreography. The markup's default is the finished state (line lit,
  // node filled, heading and card visible, border solid), which is what reduced
  // motion and no-JS visitors get. Only the motion branch rewinds things first.
  // ---------------------------------------------------------------------------
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia(root);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const q = <T extends Element = HTMLElement>(sel: string) => root.querySelector<T>(sel);
      const track = q("[data-arrival]");
      const lit = q("[data-arrival-lit]");
      const head = q("[data-arrival-head]");
      const node = q("[data-node]");
      const ring = q("[data-node-ring]");
      const core = q("[data-node-core]");
      const halo = q("[data-node-halo]");
      const bursts = gsap.utils.toArray<HTMLElement>("[data-node-burst]", root);
      const heading = q("[data-heading]");
      const intro = gsap.utils.toArray<HTMLElement>("[data-intro]", root);
      const card = q("[data-card]");
      const cardItems = gsap.utils.toArray<HTMLElement>("[data-card-item]", root);
      const rect = q<SVGRectElement>("[data-card-border]");
      if (!track || !lit || !head || !node || !ring || !core || !halo || !heading || !card || !rect)
        return;

      // 1. Arrival line: the lit part grows down the dashed track as you approach,
      //    with a hot head riding its tip. It lands on the node at 55% of the viewport.
      gsap.set(lit, { scaleY: 0, transformOrigin: "50% 0%" });
      gsap.set(head, { autoAlpha: 0, y: 0 });
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: track,
            start: "top 92%",
            end: "bottom 55%",
            scrub: 0.6,
            invalidateOnRefresh: true,
            refreshPriority: -1,
          },
        })
        .to(lit, { scaleY: 1, duration: 1 }, 0)
        .to(head, { y: () => track.offsetHeight, duration: 1 }, 0)
        .to(head, { autoAlpha: 1, duration: 0.08 }, 0)
        .to(head, { autoAlpha: 0, duration: 0.06 }, 0.94);

      // 2. Station node: hollow until the line arrives, then it fills and bursts.
      const empty = { borderColor: "rgba(255,255,255,0.35)" };
      gsap.set(ring, empty);
      gsap.set(core, { scale: 0 });
      gsap.set(halo, { autoAlpha: 0, scale: 0.4 });
      gsap.set(bursts, { autoAlpha: 0, scale: 1 });

      const fill = () => {
        gsap.to(ring, { borderColor: "rgba(245,167,100,1)", duration: 0.3, overwrite: true });
        gsap.to(core, { scale: 1, duration: 0.6, ease: "back.out(2.4)", overwrite: true });
        gsap.to(halo, { autoAlpha: 1, scale: 1, duration: 0.8, ease: "expo.out", overwrite: true });
      };
      const unfill = () => {
        gsap.to(ring, { ...empty, duration: 0.3, overwrite: true });
        gsap.to(core, { scale: 0, duration: 0.3, ease: "power2.in", overwrite: true });
        gsap.to(halo, { autoAlpha: 0, scale: 0.4, duration: 0.3, overwrite: true });
      };
      const burst = () => {
        bursts.forEach((b, i) =>
          gsap.fromTo(
            b,
            { scale: 1, autoAlpha: i === 0 ? 0.9 : 0.5 },
            {
              scale: i === 0 ? 3 : 4,
              autoAlpha: 0,
              duration: 0.8 + i * 0.2,
              delay: i * 0.12,
              ease: "expo.out",
              overwrite: true,
            }
          )
        );
      };

      ScrollTrigger.create({
        trigger: node,
        start: "top 55%",
        refreshPriority: -1,
        onEnter: () => {
          fill();
          burst();
        },
        onLeaveBack: unfill,
      });
      burstRef.current = () => {
        fill();
        burst();
      };

      // 3. Heading: words rise out of masks, once.
      const split = SplitText.create(heading, { type: "words", mask: "words" });
      // Room for Orbitron's descenders (g) inside the clipping masks.
      gsap.set(split.masks, { paddingBottom: "0.16em", marginBottom: "-0.16em" });
      gsap.set(split.words, { yPercent: 120 });
      gsap.set(intro, { autoAlpha: 0, y: 24 });
      gsap
        .timeline({
          scrollTrigger: { trigger: heading, start: "top 85%", once: true, refreshPriority: -1 },
        })
        .to(split.words, { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.08 })
        .to(intro, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.1 }, 0.35);

      // 4. Card: rises in, then its border draws itself outward from the top centre
      //    (where the journey line enters) and meets at the bottom.
      gsap.set(card, { autoAlpha: 0, y: 48 });
      gsap.set(cardItems, { autoAlpha: 0, y: 20 });
      rect.setAttribute("stroke-dasharray", "0 1");
      const draw = { p: 0 };
      let length = 0;
      let topCentre = 0;
      gsap
        .timeline({
          scrollTrigger: { trigger: card, start: "top 82%", once: true, refreshPriority: -1 },
        })
        .to(card, { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out" }, 0)
        .to(cardItems, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.05 }, 0.25)
        .to(
          draw,
          {
            p: 1,
            duration: 1.4,
            ease: "power2.inOut",
            onStart: () => {
              length = rect.getTotalLength();
              // A rect's path starts at (rx, 0) and runs clockwise.
              topCentre = rect.getBBox().width / 2 - CARD_RADIUS;
            },
            onUpdate: () => {
              const half = (draw.p * length) / 2;
              rect.setAttribute("stroke-dasharray", `${2 * half} ${Math.max(0, length - 2 * half)}`);
              rect.setAttribute("stroke-dashoffset", String(half - topCentre));
            },
            onComplete: () => {
              rect.removeAttribute("stroke-dasharray");
              rect.removeAttribute("stroke-dashoffset");
            },
          },
          0.15
        );

      return () => {
        burstRef.current = null;
        split.revert();
        rect.removeAttribute("stroke-dasharray");
        rect.removeAttribute("stroke-dashoffset");
      };
    });

    // 5. Magnetic CTAs: precise pointers only.
    mm.add("(prefers-reduced-motion: no-preference) and (pointer: fine)", () => {
      const magnets = gsap.utils.toArray<HTMLElement>("[data-magnetic]", root);
      const cleanups = magnets.map((el) => {
        const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });
        const strength = Number(el.dataset.magnetic) || 10;
        let cx = 0;
        let cy = 0;
        let hw = 1;
        let hh = 1;
        const enter = () => {
          // Measure once per hover, removing the offset we have already applied.
          const r = el.getBoundingClientRect();
          cx = r.left + r.width / 2 - (Number(gsap.getProperty(el, "x")) || 0);
          cy = r.top + r.height / 2 - (Number(gsap.getProperty(el, "y")) || 0);
          hw = Math.max(1, r.width / 2);
          hh = Math.max(1, r.height / 2);
        };
        const move = (e: PointerEvent) => {
          const dx = gsap.utils.clamp(-1, 1, (e.clientX - cx) / hw);
          const dy = gsap.utils.clamp(-1, 1, (e.clientY - cy) / hh);
          xTo(dx * strength);
          yTo(dy * strength * 0.6);
        };
        const leave = () => {
          xTo(0);
          yTo(0);
        };
        el.addEventListener("pointerenter", enter);
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        return () => {
          el.removeEventListener("pointerenter", enter);
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        };
      });
      return () => cleanups.forEach((fn) => fn());
    });

    return () => mm.revert();
  }, []);

  // Success message: slide in and echo the station burst (motion only).
  useEffect(() => {
    const el = successRef.current;
    if (!sentKey || !el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from(el, { autoAlpha: 0, y: 12, duration: 0.6, ease: "power3.out" });
      gsap.fromTo(
        "[data-success-burst]",
        { scale: 1, autoAlpha: 0.9 },
        { scale: 3, autoAlpha: 0, duration: 0.8, ease: "expo.out", delay: 0.1 }
      );
    }, el);
    return () => ctx.revert();
  }, [sentKey]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const key = e.target.name as FieldName;
    const next = { ...values, [key]: e.target.value };
    setValues(next);
    // After the first attempt, keep the messages in step with what is typed.
    if (attempted) setErrors(validate(next));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAttempted(true);
    const nextErrors = validate(values);
    setErrors(nextErrors);

    const firstInvalid = FIELD_ORDER.find((k) => nextErrors[k]);
    if (firstInvalid) {
      setSentKey(0);
      const field = e.currentTarget.elements.namedItem(firstInvalid);
      if (field instanceof HTMLElement) field.focus();
      return;
    }

    const name = values.name.trim();
    const email = values.email.trim();
    const message = values.message.trim();
    window.location.href =
      `mailto:${EMAIL}?subject=` +
      encodeURIComponent("Project enquiry from " + name) +
      "&body=" +
      encodeURIComponent(message + "\n\n" + name + " <" + email + ">");

    setSentKey((k) => k + 1);
    burstRef.current?.();
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: the address is right there to copy by hand.
    }
  };

  const describedBy = (key: FieldName) => (errors[key] ? `contact-${key}-error` : undefined);

  return (
    <section
      ref={rootRef}
      id="contact"
      aria-labelledby="contact-heading"
      className="relative overflow-hidden px-6 pb-28 md:pb-36"
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-40 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#f5a764]/10 blur-[180px]"
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Arrival: the journey line drops in from the pathway above and ends at the final station. */}
        <div className="flex flex-col items-center">
          <div data-arrival aria-hidden="true" className="relative h-28 w-[2px] md:h-44">
            <span
              className="absolute inset-0"
              style={{
                background:
                  "repeating-linear-gradient(to bottom, rgba(255,255,255,.2) 0 6px, transparent 6px 14px)",
                maskImage: "linear-gradient(to bottom, transparent, #000 45%)",
                WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 45%)",
              }}
            />
            <span data-arrival-lit className="absolute inset-0 will-change-transform">
              <span
                className="absolute inset-y-0 -left-[5px] -right-[5px] blur-[5px]"
                style={{
                  background: "linear-gradient(to bottom, transparent 10%, rgba(245,167,100,.6))",
                }}
              />
              <span
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(201,119,58,0), #c9773a 35%, #f5a764 75%, #f5c895)",
                }}
              />
            </span>
            <span
              data-arrival-head
              className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fff4e6] opacity-0 shadow-[0_0_12px_4px_rgba(245,200,149,.9),0_0_44px_12px_rgba(245,167,100,.4)]"
            />
          </div>

          {/* Station node */}
          <div data-node aria-hidden="true" className="relative grid h-6 w-6 place-items-center">
            <span
              data-node-halo
              className="absolute -inset-3 rounded-full bg-[rgba(245,167,100,.18)]"
            />
            <span
              data-node-burst
              className="absolute inset-0 rounded-full border-2 border-[#f5a764] opacity-0"
            />
            <span
              data-node-burst
              className="absolute inset-0 rounded-full border border-[#f5c895] opacity-0"
            />
            <span
              data-node-ring
              className="absolute inset-0 rounded-full border-2 border-[#f5a764] bg-black"
            />
            <span
              data-node-core
              className="relative h-3 w-3 rounded-full bg-[#f5c895] shadow-[0_0_14px_rgba(245,167,100,.85)]"
            />
          </div>

          <p className={`mt-5 flex items-center gap-3 ${MONO_LABEL}`}>
            <span className="text-white">Final stop</span>
            <span aria-hidden="true" className="text-white/30">
              ·
            </span>
            <span className="text-[#f5a764]">Contact</span>
          </p>
        </div>

        {/* Heading */}
        <div className="mt-8 text-center">
          <h2
            id="contact-heading"
            data-heading
            className="mx-auto max-w-4xl font-orbitron text-4xl font-bold leading-[1.1] text-white sm:text-5xl md:text-6xl"
          >
            Let&apos;s Build Something <span className="text-[#f5a764]">Amazing</span>
          </h2>

          <p data-intro className="mx-auto mt-6 max-w-2xl text-gray-400">
            Whether you have an exciting startup idea, need a frontend engineer, or simply want to
            collaborate, I&apos;d love to hear about it.
          </p>
        </div>

        {/* Card */}
        <div
          data-card
          className="relative mt-16 rounded-[40px] border border-white/[.08] bg-[#0c0c0e]/90 shadow-[0_50px_140px_-60px_rgba(245,167,100,.35)] md:mt-20"
        >
          {/* Drawn border, centred on the 1px CSS border (svg spans the border box minus half a pixel). */}
          <svg
            aria-hidden="true"
            focusable="false"
            className="pointer-events-none absolute left-[-0.5px] top-[-0.5px] h-[calc(100%+1px)] w-[calc(100%+1px)] overflow-visible"
          >
            <rect
              data-card-border
              x="0"
              y="0"
              width="100%"
              height="100%"
              rx={CARD_RADIUS}
              ry={CARD_RADIUS}
              fill="none"
              stroke="#f5a764"
              strokeOpacity={0.5}
              strokeWidth={1}
            />
          </svg>

          <div className="relative grid lg:grid-cols-2">
            {/* LEFT */}
            <div className="flex flex-col justify-center p-7 sm:p-10 md:p-16">
              <p
                data-card-item
                className={`flex items-center gap-2.5 text-white/70 ${MONO_LABEL}`}
              >
                <span aria-hidden="true" className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[#f5a764] opacity-75 motion-safe:animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#f5a764]" />
                </span>
                Available for new projects
              </p>

              <h3 data-card-item className="mt-5 font-orbitron text-3xl font-bold text-white">
                Ready to start?
              </h3>

              <p data-card-item className="mt-6 max-w-lg leading-8 text-gray-400">
                I&apos;m currently available for freelance projects, contract work, and full-time
                opportunities. If you&apos;re looking for someone passionate about crafting
                exceptional digital experiences, let&apos;s talk.
              </p>

              <div data-card-item className="mt-10">
                <a
                  data-magnetic="10"
                  href={`mailto:${EMAIL}`}
                  className={`inline-flex min-h-12 w-fit items-center gap-3 rounded-full bg-[#f5a764] px-7 py-4 font-bold text-black transition-[scale,box-shadow] duration-300 hover:scale-105 hover:shadow-[0_12px_40px_-10px_rgba(245,167,100,.75)] ${FOCUS_RING}`}
                >
                  <MdOutlineEmail size={22} aria-hidden="true" />
                  Send an Email
                </a>
              </div>

              {/* Socials */}
              <div data-card-item className="mt-12 flex gap-5">
                {socials.map((item) => (
                  <a
                    key={item.name}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${item.name} (opens in a new tab)`}
                    className={`flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition duration-300 hover:scale-110 hover:border-[#f5a764] hover:bg-[#f5a764] hover:text-black ${FOCUS_RING}`}
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* RIGHT */}
            <div className="border-t border-white/[.06] p-7 sm:p-10 md:p-16 lg:border-l lg:border-t-0">
              <form noValidate onSubmit={handleSubmit} className="space-y-6">
                <div data-card-item>
                  <Field id="contact-name" label="Your Name" error={errors.name}>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="John Doe"
                      value={values.name}
                      onChange={handleChange}
                      aria-invalid={errors.name ? true : undefined}
                      aria-describedby={describedBy("name")}
                      className={`h-14 px-5 ${INPUT_BASE} ${inputBorder(errors.name)}`}
                    />
                  </Field>
                </div>

                <div data-card-item>
                  <Field id="contact-email" label="Email Address" error={errors.email}>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      inputMode="email"
                      spellCheck={false}
                      placeholder="john@email.com"
                      value={values.email}
                      onChange={handleChange}
                      aria-invalid={errors.email ? true : undefined}
                      aria-describedby={describedBy("email")}
                      className={`h-14 px-5 ${INPUT_BASE} ${inputBorder(errors.email)}`}
                    />
                  </Field>
                </div>

                <div data-card-item>
                  <Field id="contact-message" label="Message" error={errors.message}>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={6}
                      required
                      autoComplete="off"
                      placeholder="Tell me about your project..."
                      value={values.message}
                      onChange={handleChange}
                      aria-invalid={errors.message ? true : undefined}
                      aria-describedby={describedBy("message")}
                      className={`resize-none p-5 ${INPUT_BASE} ${inputBorder(errors.message)}`}
                    />
                  </Field>
                </div>

                <div data-card-item>
                  <button
                    type="submit"
                    data-magnetic="8"
                    className={`group flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-[#f5a764] py-4 font-orbitron font-bold text-black transition-[scale,box-shadow] duration-300 hover:scale-[1.02] hover:shadow-[0_12px_40px_-10px_rgba(245,167,100,.75)] ${FOCUS_RING}`}
                  >
                    Send Message
                    <FaArrowRight
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </button>
                  <p className={`mt-3 text-center text-white/40 ${MONO_LABEL}`}>
                    Opens in your email app
                  </p>
                </div>

                <div role="status" aria-live="polite">
                  {sentKey > 0 && (
                    <div
                      key={sentKey}
                      ref={successRef}
                      className="flex gap-4 rounded-2xl border border-[#f5a764]/30 bg-[#f5a764]/[.06] p-5"
                    >
                      <span aria-hidden="true" className="relative mt-0.5 grid h-6 w-6 shrink-0 place-items-center">
                        <span
                          data-success-burst
                          className="absolute inset-0 rounded-full border-2 border-[#f5a764] opacity-0"
                        />
                        <CircleCheck className="relative h-6 w-6 text-[#f5a764]" />
                      </span>
                      <div className="min-w-0">
                        <p className="leading-7 text-white">
                          Your email app should open with your message. If it didn&apos;t, email{" "}
                          <a
                            href={`mailto:${EMAIL}`}
                            className={`rounded-sm text-[#f5a764] underline decoration-[#f5a764]/40 underline-offset-4 hover:decoration-[#f5a764] ${FOCUS_RING}`}
                          >
                            {EMAIL}
                          </a>{" "}
                          directly.
                        </p>
                        <button
                          type="button"
                          onClick={copyEmail}
                          className={`mt-3 inline-flex min-h-10 items-center gap-2 rounded-full border border-white/15 px-4 text-white/80 transition-colors hover:border-[#f5a764] hover:text-white ${MONO_LABEL} ${FOCUS_RING}`}
                        >
                          {copied ? (
                            <Check aria-hidden="true" className="h-3.5 w-3.5 text-[#f5a764]" />
                          ) : (
                            <Copy aria-hidden="true" className="h-3.5 w-3.5" />
                          )}
                          {copied ? "Copied" : "Copy address"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
