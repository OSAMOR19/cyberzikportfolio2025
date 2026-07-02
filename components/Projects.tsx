import Folder from "./Folder";

interface Project {
  title: string;
  description: string;
  tech: string[];
  images: string[];
  live?: string;
  playStore?: string;
  appStore?: string;
  github?: string;
}

const projects: Project[] = [
  {
    title: "SymphoMe",
    description:
      "Music education platform connecting students with professional tutors for personalized learning experiences.",
    tech: ["Next.js", "TypeScript", "Tailwind"],
    images: [
      "/projects/symphome1.png",
      "/projects/symphome2.png",
      "/projects/symphome3.png",
    ],
    live: "https://app.symphome.com",
  },
  {
    title: "Roots AI",
    description:
      "AI-powered platform leveraging intelligent automation to deliver smart, data-driven solutions.",
    tech: ["Next.js", "AI/ML", "Python"],
    images: [
      "/projects/rootsai1.png",
      "/projects/rootsai2.png",
      "/projects/rootsai3.png",
    ],
    live: "#",
  },
  {
    title: "VendCliq",
    description:
      "Mobile commerce application streamlining vendor management and customer engagement on iOS and Android.",
    tech: ["React Native", "Node.js", "Firebase"],
    images: [
      "/projects/vendcliq1.webp",
      "/projects/vendcliq2.webp",
      "/projects/vendcliq3.webp",
    ],
    playStore: "https://play.google.com/store/apps/details?id=com.vendcliq.app.prod&hl=en",
    appStore: "https://apps.apple.com/ng/app/vendcliq-app/id6758526174",
  },
  {
    title: "Cybernovr",
    description:
      "Cybersecurity company website with premium UI and smooth user experience.",
    tech: ["Next.js", "Framer Motion"],
    images: [
      "/projects/project3.png",
      "/projects/project3.1.png",
      "/projects/project3.2.png",
    ],
    live: "https://www.cybernovr.com/",
  },
  {
    title: "Ace Embedded Systems",
    description:
      "Industrial IoT and embedded systems company website built with modern frontend technologies.",
    tech: ["Next.js", "React", "Tailwind"],
    images: [
      "/projects/project1.png",
      "/projects/project1.1.png",
      "/projects/project1.2.png",
    ],
    live: "https://aceembedded.io/",
  },
  {
    title: "CR8CORELABS",
    description:
      "Hackathon landing page showcasing innovation and startup ideas.",
    tech: ["React", "Tailwind"],
    images: [
      "/projects/cre8core1.png",
      "/projects/cre8core2.png",
      "/projects/cre8core3.png",
      "/projects/cre8core4.png",
    ],
    live: "https://cre8core.fun",
  },
  {
    title: "Royal Fits",
    description:
      "Complete e-commerce platform with modern shopping experience.",
    tech: ["React", "Node", "Stripe"],
    images: [
      "/projects/project6.png",
      "/projects/project6.2.png",
      "/projects/project6.1.png",
    ],
    live: "https://www.ephronroyalfits.com/",
  },
  {
    title: "Syndeo Collaboration",
    description:
      "Business collaboration platform focused on productivity and workflow management.",
    tech: ["Next.js", "Node", "MongoDB"],
    images: [
      "/projects/project2.png",
      "/projects/project2.1.png",
      "/projects/project2.2.png",
    ],
    live: "https://www.syndeoltd.com/",
  },
  {
    title: "Play2Learn",
    description:
      "Educational gaming platform designed for engaging digital learning experiences.",
    tech: ["React", "Firebase"],
    images: [
      "/projects/project4.png",
      "/projects/project4.1.png",
      "/projects/project4.2.png",
    ],
    live: "https://play2learngame.vercel.app/",
  },
];

export default function Projects() {
  return (
    <section
      id="projects"
      className="relative mx-auto max-w-7xl px-6 py-28"
    >
      <div className="mb-20 text-center">
        <p className="font-orbitron uppercase tracking-[8px] text-[#f5a764]">
          Portfolio
        </p>

        <h2 className="mt-4 text-5xl md:text-7xl font-bold font-orbitron text-white">
          Featured Projects
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-gray-400">
          Some products I&apos;ve built for startups, companies and clients over the
          last few years.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project, index) => (
          <div
            key={index}
            className="group overflow-hidden rounded-3xl bg-white/[0.04] backdrop-blur-xl transition duration-500 hover:-translate-y-3 hover:border-[#f5a764]/60 hover:shadow-[0_0_45px_rgba(245,167,100,.15)]"
          >
            <div className="flex justify-center pt-30">
              <Folder
                size={1.45}
                color="#f5c895"
                items={project.images}
                className="custom-folder"
              />
            </div>

            <div className="px-7 py-6">
              <h3 className="font-orbitron text-2xl text-white">
                {project.title}
              </h3>

              <p className="mt-4 leading-7 text-gray-400">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-3 py-4">
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 rounded-full px-8 bg-[#f5a764] py-3 text-center font-bold text-white transition hover:scale-105"
                  >
                    Live Demo
                  </a>
                )}
                {project.playStore && (
                  <a
                    href={project.playStore}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 rounded-full px-4 bg-[#34a853] py-3 text-center font-bold text-white transition hover:scale-105 whitespace-nowrap"
                  >
                    Google Play
                  </a>
                )}
                {project.appStore && (
                  <a
                    href={project.appStore}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 rounded-full px-4 bg-[#0a84ff] py-3 text-center font-bold text-white transition hover:scale-105 whitespace-nowrap"
                  >
                    App Store
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}