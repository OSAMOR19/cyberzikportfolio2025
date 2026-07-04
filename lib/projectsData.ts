export interface Project {
  slug: string;
  title: string;
  category: string;
  description: string;
  about: string;
  tech: string[];
  images: string[];
  orientation: "landscape" | "portrait";
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
    orientation: "landscape",
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
    category: "Music / AI",
    description:
      "AI-powered African drum plugin for music producers — smart sample discovery, BPM matching, and authentic percussion loops.",
    about:
      "Roots AI is an AI-powered African drum web application and plugin built for music producers and beatmakers. Developed by Manifxt Audio, it uses AI as a smart recommendation engine to match producers with authentic, human-recorded African percussive drum loops across genres like Afrobeats, Amapiano, Afrohouse, and Miliki. Producers can search via text prompts or upload their melody tracks for automatic BPM detection and loop matching. Every loop in the library is recorded by real musicians and professionally mixed — no synthetic AI-generated patterns. The platform also supports multi-track stem downloads and drag-and-drop workflow integration with DAWs like Ableton, FL Studio, and Logic Pro.",
    tech: ["Next.js", "AI/ML", "Python", "TypeScript"],
    orientation: "landscape",
    images: [
      "/projects/rootsai1.png",
      "/projects/rootsai2.png",
      "/projects/rootsai3.png",
    ],
    live: "https://rootsai.space",
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
    orientation: "portrait",
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
    orientation: "landscape",
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
    orientation: "portrait",
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
    orientation: "landscape",
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
    category: "Web3 / Onchain",
    description:
      "The creative engine powering the next generation of builders and creators onchain.",
    about:
      "Cre8core Labs is the creative engine powering the next generation of builders and creators onchain. At Cre8core, we connect talented individuals with high-impact opportunities, from bounties and grants to gigs and collaborations with top projects onchain. Our platform equips the onchain ecosystem with a reliable way to source talent, amplify innovation, and reward meaningful contributions. Whether you're a storyteller, designer, developer, or community builder, Cre8core Labs gives you the tools, incentives, and access to high-paying opportunities to thrive.",
    tech: ["React", "Tailwind"],
    orientation: "landscape",
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
    orientation: "landscape",
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
    orientation: "landscape",
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
    orientation: "landscape",
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
