"use client";

import { MdOutlineEmail } from "react-icons/md";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaArrowRight,
} from "react-icons/fa";

export default function Contact() {
  const socials = [
    {
      name: "Github",
      icon: <FaGithub size={22} />,
      link: "https://github.com/",
    },
    {
      name: "LinkedIn",
      icon: <FaLinkedin size={22} />,
      link: "https://linkedin.com/",
    },
    {
      name: "Twitter",
      icon: <FaTwitter size={22} />,
      link: "https://twitter.com/",
    },
  ];

  return (
    <section
      id="contact"
      className="relative overflow-hidden py-28 px-6"
    >
      {/* Background Glow */}
      <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#f5a764]/10 blur-[180px]" />

      <div className="relative mx-auto max-w-7xl">

        {/* Heading */}

        <div className="text-center">
          <p className="font-mono uppercase tracking-[0.3em] text-[#f5a764]">
            CONTACT
          </p>

          <h2 className="mt-4 font-orbitron text-5xl md:text-6xl font-bold text-white">
            Let's Build Something Amazing
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-gray-400">
            Whether you have an exciting startup idea, need a frontend engineer,
            or simply want to collaborate, I'd love to hear about it.
          </p>
        </div>

        {/* Card */}

        <div className="mt-20 rounded-[40px] border border-[#f5a764]/40 bg-white/10 backdrop-blur-xl">

          <div className="grid lg:grid-cols-2">

            {/* LEFT */}

            <div className="flex flex-col justify-center p-10 md:p-16">

              <h3 className="font-orbitron text-3xl font-bold text-white">
                Ready to start?
              </h3>

              <p className="mt-6 max-w-lg leading-8 text-gray-400">
                I'm currently available for freelance projects,
                contract work, and full-time opportunities.
                If you're looking for someone passionate about
                crafting exceptional digital experiences,
                let's talk.
              </p>

              <a
                href="mailto:info@cyberzik.online"
                className="mt-10 inline-flex w-fit items-center gap-3 rounded-full bg-[#f5a764] px-7 py-4 font-bold text-black transition duration-300 hover:scale-105"
              >
                <MdOutlineEmail size={22} />
                Send an Email
              </a>

              {/* Socials */}

              <div className="mt-12 flex gap-5">

                {socials.map((item) => (
                  <a
                    key={item.name}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition duration-300 hover:scale-110 hover:border-[#f5a764] hover:bg-[#f5a764] hover:text-black"
                  >
                    {item.icon}
                  </a>
                ))}

              </div>

            </div>

            {/* RIGHT */}

            <div className="p-10 md:p-16">

              <form className="space-y-6">

                <div>
                  <label className="mb-3 block font-mono text-sm uppercase tracking-widest text-gray-300">
                    Your Name
                  </label>

                  <input
                    type="text"
                    placeholder="John Doe"
                    className="h-14 w-full rounded-2xl border border-white/20 bg-white/5 px-6 text-white outline-none backdrop-blur-xl transition focus:border-[#f5a764]"
                  />
                </div>

                <div>
                  <label className="mb-3 block font-mono text-sm uppercase tracking-widest text-gray-300">
                    Email Address
                  </label>

                  <input
                    type="email"
                    placeholder="john@email.com"
                    className="h-14 w-full rounded-2xl border border-white/20 bg-white/5 px-6 text-white outline-none backdrop-blur-xl transition focus:border-[#f5a764]"
                  />
                </div>

                <div>
                  <label className="mb-3 block font-mono text-sm uppercase tracking-widest text-gray-300">
                    Message
                  </label>

                  <textarea
                    rows={6}
                    placeholder="Tell me about your project..."
                    className="w-full resize-none rounded-2xl border border-white/20 bg-white/5 p-6 text-white outline-none backdrop-blur-xl transition focus:border-[#f5a764]"
                  />
                </div>

                <button
                  className="group flex w-full items-center justify-center gap-3 rounded-full bg-[#f5a764] py-4 font-orbitron font-bold text-black transition duration-300 hover:scale-[1.02]"
                >
                  Send Message

                  <FaArrowRight className="transition group-hover:translate-x-1" />
                </button>

              </form>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}