export interface Project {
  slug: string;
  title: string;
  category: string;
  description: string;
  about: string;
  tech: string[];
  images: string[];
  live?: string;
  playStore?: string;
  appStore?: string;
  github?: string;
}

export const projects: Project[] = [
  {
    slug: "symphome",
    title: "SymphoMe",
    category: "Music Education",
    description:
      "Music education platform connecting students with professional tutors for personalized learning experiences.",
    about:
      "SymphoMe is a comprehensive music education platform that bridges the gap between aspiring musicians and experienced tutors. Built with a focus on seamless user experience, the platform enables students to discover tutors, book lessons, and track their musical journey — all in one place. The interface was crafted to feel inviting and professional, with real-time scheduling, payment integration, and progress tracking features.",
    tech: ["Next.js", "TypeScript", "Tailwind"],
    images: [
      "/projects/symphome1.png",
      "/projects/symphome2.png",
      "/projects/symphome3.png",
      "/projects/symphome4.png",
      "/projects/symphome5.png",
      "/projects/symphome6.png",
    ],
    live: "https://app.symphome.com",
  },
  {
    slug: "roots-ai",
    title: "Roots AI",
    category: "AI / Machine Learning",
    description:
      "AI-powered platform leveraging intelligent automation to deliver smart, data-driven solutions.",
    about:
      "Roots AI harnesses the power of artificial intelligence and machine learning to deliver intelligent, data-driven solutions. The platform features automated workflows, predictive analytics, and smart decision-making tools designed for businesses looking to leverage AI without the complexity. From data ingestion to actionable insights, every step of the pipeline was built for speed and accuracy.",
    tech: ["Next.js", "AI/ML", "Python"],
    images: [
      "/projects/rootsai1.png",
      "/projects/rootsai2.png",
      "/projects/rootsai3.png",
    ],
    live: "#",
  },
  {
    slug: "vendcliq",
    title: "VendCliq",
    category: "Mobile Commerce",
    description:
      "Mobile commerce application streamlining vendor management and customer engagement on iOS and Android.",
    about:
      "VendCliq is a mobile-first commerce platform designed to simplify vendor management and amplify customer engagement. Available on both iOS and Android, the app empowers vendors to manage inventory, process orders, and connect with customers in real-time. The sleek, intuitive interface was built with React Native for a truly native feel across platforms, with Firebase powering the real-time backend.",
    tech: ["React Native", "Node.js", "Firebase"],
    images: [
      "/projects/vendcliq1.webp",
      "/projects/vendcliq2.webp",
      "/projects/vendcliq3.webp",
      "/projects/vendcliq4.webp",
    ],
    playStore:
      "https://play.google.com/store/apps/details?id=com.vendcliq.app.prod&hl=en",
    appStore: "https://apps.apple.com/ng/app/vendcliq-app/id6758526174",
  },
  {
    slug: "wbh-web",
    title: "WBH Web",
    category: "Web Application",
    description:
      "Full-featured web platform delivering a comprehensive digital experience with modern UI and robust functionality.",
    about:
      "WBH Web is a powerful web application built to deliver a complete digital experience. The platform features a modern, responsive interface with intuitive navigation, real-time data updates, and seamless user workflows. Every detail — from the dashboard layouts to the interactive components — was designed to provide a premium, professional experience that scales across devices and screen sizes.",
    tech: ["Next.js", "TypeScript", "Tailwind", "Node.js"],
    images: [
      "/projects/wbhweb1.png",
      "/projects/wbhweb2.png",
      "/projects/wbhweb3.png",
      "/projects/wbhweb4.png",
    ],
  },
  {
    slug: "wbh-mobile",
    title: "WBH Mobile",
    category: "Mobile App",
    description:
      "Native mobile application providing on-the-go access with a fluid, intuitive mobile experience.",
    about:
      "WBH Mobile brings the full WBH experience to your pocket. Designed as a standalone mobile application, it delivers fluid navigation, push notifications, and offline-capable features. The app was built with a mobile-first approach, ensuring every interaction feels natural and responsive — from quick actions to detailed views. The UI prioritizes ease of use while maintaining the premium feel of the web counterpart.",
    tech: ["React Native", "TypeScript", "Firebase"],
    images: [
      "/projects/wbhmobile1.png",
      "/projects/wbhmobile2.png",
      "/projects/wbhmobile3.png",
    ],
  },
  {
    slug: "cybernovr",
    title: "Cybernovr",
    category: "Cybersecurity",
    description:
      "Cybersecurity company website with premium UI and smooth user experience.",
    about:
      "Cybernovr is a cybersecurity company website that communicates trust, expertise, and cutting-edge protection through its design. The site features premium animations powered by Framer Motion, a sophisticated dark aesthetic, and clear information architecture that guides visitors from awareness to engagement. Every section was crafted to convey the company's authority in the cybersecurity space.",
    tech: ["Next.js", "Framer Motion"],
    images: [
      "/projects/project3.png",
      "/projects/project3.1.png",
      "/projects/project3.2.png",
    ],
    live: "https://www.cybernovr.com/",
  },
  {
    slug: "cre8corelabs",
    title: "CR8CORELABS",
    category: "Innovation",
    description:
      "Hackathon landing page showcasing innovation and startup ideas.",
    about:
      "CR8CORELABS is a vibrant hackathon landing page designed to inspire and attract innovators, developers, and entrepreneurs. The page features bold visuals, dynamic animations, and clear calls-to-action that drive registrations. Built with React and Tailwind, the design captures the energy and excitement of the hackathon while providing all essential event information in an engaging format.",
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
    slug: "royal-fits",
    title: "Royal Fits",
    category: "E-Commerce",
    description:
      "Complete e-commerce platform with modern shopping experience.",
    about:
      "Royal Fits is a full-featured e-commerce platform that delivers a modern, engaging shopping experience. From product browsing with smooth transitions to a streamlined checkout flow powered by Stripe, every touchpoint was designed for conversion. The platform includes inventory management, order tracking, and responsive design that looks stunning on every device.",
    tech: ["React", "Node", "Stripe"],
    images: [
      "/projects/project6.png",
      "/projects/project6.2.png",
      "/projects/project6.1.png",
    ],
    live: "https://www.ephronroyalfits.com/",
  },
  {
    slug: "syndeo-collaboration",
    title: "Syndeo Collaboration",
    category: "Productivity",
    description:
      "Business collaboration platform focused on productivity and workflow management.",
    about:
      "Syndeo Collaboration is a business productivity platform built for teams that value efficient workflows and clear communication. The platform offers project management tools, real-time collaboration features, and workflow automation — all wrapped in a clean, intuitive interface. Built with Next.js and MongoDB, it handles complex data relationships while maintaining snappy performance.",
    tech: ["Next.js", "Node", "MongoDB"],
    images: [
      "/projects/project2.png",
      "/projects/project2.1.png",
      "/projects/project2.2.png",
    ],
    live: "https://www.syndeoltd.com/",
  },
  {
    slug: "play2learn",
    title: "Play2Learn",
    category: "EdTech",
    description:
      "Educational gaming platform designed for engaging digital learning experiences.",
    about:
      "Play2Learn gamifies the educational experience, turning traditional learning into interactive, engaging gameplay. The platform features progress tracking, achievement systems, and adaptive difficulty that keeps learners motivated. Built with React and Firebase, it delivers real-time updates and seamless cross-device synchronization for learners of all ages.",
    tech: ["React", "Firebase"],
    images: [
      "/projects/project4.png",
      "/projects/project4.1.png",
      "/projects/project4.2.png",
    ],
    live: "https://play2learngame.vercel.app/",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAdjacentProjects(slug: string): {
  prev: Project | null;
  next: Project | null;
} {
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? projects[index - 1] : projects[projects.length - 1],
    next: index < projects.length - 1 ? projects[index + 1] : projects[0],
  };
}
