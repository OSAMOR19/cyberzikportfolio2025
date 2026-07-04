import Image from "next/image";
import TextType from "./TextType";

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-16 md:px-10 lg:px-16">
      {/* Heading */}
      <TextType
        typingSpeed={75}
        pauseDuration={1500}
        showCursor
        cursorCharacter="|"
        text={["Hi, I'm Cyberzik, a Software Engineer."]}
        deletingSpeed={50}
        startOnVisible
        className="max-w-4xl text-center font-orbitron font-bold tracking-tight leading-[1.05] text-[#f5a764] text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
      />

      {/* CTA */}
      <a href="#contact" className="mt-8 rounded-full bg-[#f5a764] px-8 py-3 text-base font-bold text-black transition-all duration-300 hover:scale-105 md:px-10 md:py-4 md:text-xl font-orbitron inline-block">
        Let&apos;s Talk
      </a>

      {/* Bottom Content */}
      <div className="mt-20 grid w-full max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-3">
        {/* Left */}
        <p className="text-center font-mono leading-8 text-gray-300 lg:text-left">
          I'm a passionate fullstack and blockchain developer with extensive
          experience building web applications, e-commerce platforms, and
          decentralized solutions. My journey in tech began over 5 years ago,
          and I've been pushing the boundaries of what's possible ever since.
        </p>

        {/* Center Logo */}
        <div className="flex justify-center">
          <Image
            src="/logo.png"
            width={260}
            height={260}
            priority
            alt="Cyberzik Logo"
            className="w-40 sm:w-52 md:w-64 lg:w-72 h-auto"
          />
        </div>

        {/* Right */}
        <p className="text-center font-mono leading-8 text-gray-300 lg:text-left">
          I specialize in creating seamless user experiences backed by robust,
          scalable architectures. Whether it's a complex web application or a
          cutting-edge blockchain solution, I approach every project with
          creativity, technical expertise, and a commitment to excellence.
        </p>
      </div>
    </section>
  );
}