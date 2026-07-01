"use client";

import Image from "next/image";
import { IoMdClose } from "react-icons/io";
import { useState } from "react";
import "animate.css";
import Link from "next/link";

function Navbar() {
  const [menu, setMenu] = useState(false);

  return (
    <>
      {/* Navbar */}
      <div className="fixed top-6 left-1/2 z-[9999] w-full -translate-x-1/2 px-4">
        <div className="mx-auto flex h-14 w-full max-w-sm items-center justify-between rounded-full border border-[#f5a764] bg-white/10 px-5 backdrop-blur-xl md:max-w-md lg:max-w-lg">
          <Image
            src="/logo.png"
            alt="logo"
            width={35}
            height={35}
            className="h-8 w-8 md:h-9 md:w-9"
          />

          <p className="font-orbitron text-sm font-semibold text-white md:text-base">
            HERO
          </p>

          <button
            onClick={() => setMenu(true)}
            className="flex cursor-pointer flex-col gap-1"
          >
            <div className="h-[2px] w-6 rounded-full bg-[#f5a764]" />
            <div className="h-[2px] w-6 rounded-full bg-[#f5a764]" />
          </button>
        </div>
      </div>

      {/* Fullscreen Menu */}
      {menu && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 px-4">
          <div className="animate__animated animate__fadeInDown h-[90vh] w-full max-w-6xl overflow-y-auto rounded-[30px] border border-[#f5a764] bg-white/10 backdrop-blur-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-6 md:px-10">
              <Image
                src="/logo.png"
                alt="logo"
                width={60}
                height={60}
                className="h-12 w-12 md:h-16 md:w-16"
              />

              <button onClick={() => setMenu(false)}>
                <IoMdClose
                  size={36}
                  color="#f5a764"
                  className="cursor-pointer transition hover:rotate-90"
                />
              </button>
            </div>

            {/* Navigation */}
            <ul className="px-6 pb-10 font-orbitron text-2xl font-bold text-gray-100 md:px-12 md:text-5xl">
              {["Home", "About", "Projects", "Contact", "Pricing"].map(
                (item, index) => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase()}`}
                      onClick={() => setMenu(false)}
                      className="group flex items-center gap-4 py-6 transition hover:text-[#f5a764]"
                    >
                      <span className="text-sm text-[#f5a764] md:text-lg">
                        {String(index + 1).padStart(2, "0")}.
                      </span>

                      {item === "Pricing" ? (
                        <Link href={`/${item.toLowerCase()}`}>{item}</Link>
                      ) : (
                        <span>{item}</span>
                      )}
                    </a>

                    <div className="h-px w-full bg-[#f5a764]/30" />
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
