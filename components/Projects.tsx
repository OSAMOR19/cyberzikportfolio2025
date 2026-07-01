import Folder from "./Folder";

const projects = [
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
    github: "#",
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
    github: "#",
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
    github: "#",
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
    github: "#",
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
    github: "#",
  },
  {
    title: "CR8CORELABS",
    description:
      "Hackathon landing page showcasing innovation and startup ideas.",
    tech: ["React", "Tailwind"],
    images: [
      "/projects/project5.png",
      "/projects/project5.2.png",
      "/projects/project5.1.png",
    ],
    live: "https://basebuildhathon.vercel.app/",
    github: "#",
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
          Some products I've built for startups, companies and clients over the
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

              <div className="py-4 ">
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-full px-12 bg-[#f5a764] py-3 text-center font-bold text-white transition hover:scale-105"
                >
                  Live Demo
                </a>

              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}