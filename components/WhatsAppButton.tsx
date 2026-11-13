import { FaWhatsapp } from "react-icons/fa";

const PHONE = "2349042865358"; // +234 904 286 5358, international format without "+" for wa.me
const MESSAGE = "Hi Isaac, I found your portfolio and I'd like to talk about a project.";

/**
 * Floating "Chat on WhatsApp" button, fixed bottom-right on every page.
 * On phones/tablets it sits higher so it clears the projects pathway's bottom dock.
 */
export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${PHONE}?text=${encodeURIComponent(MESSAGE)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Isaac on WhatsApp"
      className="group fixed right-4 z-[9000] flex items-center gap-3 rounded-full bg-[#25D366] p-3.5 text-white shadow-[0_10px_30px_rgba(37,211,102,.45)] transition-[transform,box-shadow] duration-300 hover:scale-105 hover:shadow-[0_14px_40px_rgba(37,211,102,.6)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#25D366] bottom-[calc(env(safe-area-inset-bottom)+88px)] sm:right-6 lg:bottom-6 lg:pr-5"
    >
      {/* gentle attention ring */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full bg-[#25D366] opacity-40 motion-safe:animate-ping [animation-duration:2.4s]"
      />
      <FaWhatsapp aria-hidden className="relative h-7 w-7" />
      <span className="relative hidden whitespace-nowrap text-sm font-bold lg:inline">Chat on WhatsApp</span>
    </a>
  );
}
