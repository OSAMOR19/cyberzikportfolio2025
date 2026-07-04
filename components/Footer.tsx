import React from "react";
import Image from "next/image";
import { MdOutlineEmail } from "react-icons/md";
import { FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";

const Footer = () => {
  const socials = [
    {
      icon: <FaTwitter />,
      link: "https://twitter.com/",
    },
    {
      icon: <FaLinkedin />,
      link: "https://www.linkedin.com/in/peter-osamor-isaac-chukwuka-003ab51a4/",
    },
    {
      icon: <FaGithub />,
      link: "https://github.com/OSAMOR19",
    },
  ];

  return (
    <footer className="w-full bg-black pt-20">
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-20 xl:px-32">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Left */}
          <div className="flex flex-col gap-6">
            <Image src="/logo.png" alt="logo" width={45} height={50} />

            <h3 className="text-2xl font-semibold text-white">Isaac Osamor</h3>

            <p className="leading-7 text-gray-400">
              Frontend Engineer with full-stack capabilities. I craft stunning,
              high-performance web experiences that blend creativity with clean
              code.
            </p>

            <a href="mailto:info@cyberzik.online">
              <button className="flex w-fit items-center gap-2 rounded-full bg-[#f5a764] px-6 py-3 font-semibold text-black transition hover:scale-105">
                <MdOutlineEmail size={20} />
                Email Me
              </button>
            </a>

            <div className="flex flex-wrap gap-4">
              {socials.map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#f5a764] hover:text-black"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-5">
            <h4 className="text-lg font-semibold text-white">Navigation</h4>

            <ul className="space-y-3 text-gray-400">
              <li>
                <a href="#home" className="hover:text-[#f5a764]">
                  Home
                </a>
              </li>

              <li>
                <a href="#work" className="hover:text-[#f5a764]">
                  Work
                </a>
              </li>

              <li>
                <a href="#skills" className="hover:text-[#f5a764]">
                  Skills
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-5">
            <h4 className="text-lg font-semibold text-white">Services</h4>

            <ul className="space-y-3 text-gray-400">
              <li>
                <a href="#" className="hover:text-[#f5a764]">
                  Frontend Development
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-[#f5a764]">
                  Mobile Applications
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-[#f5a764]">
                  Fullstack Solutions
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-5">
            <h4 className="text-lg font-semibold text-white">Connect</h4>

            <ul className="space-y-3 text-gray-400">
              <li>
                <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="hover:text-[#f5a764]">
                  Twitter
                </a>
              </li>

              <li>
                <a href="https://www.linkedin.com/in/peter-osamor-isaac-chukwuka-003ab51a4/" target="_blank" rel="noopener noreferrer" className="hover:text-[#f5a764]">
                  LinkedIn
                </a>
              </li>

              <li>
                <a href="https://github.com/OSAMOR19" target="_blank" rel="noopener noreferrer" className="hover:text-[#f5a764]">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-12 h-px w-full bg-white/10"></div>
      </div>

      {/* Marquee */}
      <div className="overflow-hidden whitespace-nowrap py-6">
        <div className="flex w-max animate-marquee">
          {[...Array(8)].map((_, i) => (
            <span
              key={i}
              className="mx-4 text-4xl font-bold uppercase text-[#f5a764] md:mx-6 md:text-6xl lg:mx-8 lg:text-8xl font-orbitron"
            >
              LET&apos;S WORK TOGETHER
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
