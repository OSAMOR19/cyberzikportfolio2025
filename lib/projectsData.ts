export type ProjectGroupId =
  | "websites"
  | "ecommerce"
  | "education"
  | "ai"
  | "web3"
  | "saas";

export interface ProjectGroup {
  id: ProjectGroupId;
  label: string;
  /** Shorter name used on the filter tabs. */
  tab: string;
  blurb: string;
}

// Display order of the sections on the home page.
export const projectGroups: ProjectGroup[] = [
  {
    id: "websites",
    label: "Websites & Landing Pages",
    tab: "Websites",
    blurb: "Brand, personal and company websites built to tell a story and convert visitors.",
  },
  {
    id: "ecommerce",
    label: "E-Commerce",
    tab: "E-Commerce",
    blurb: "Online stores and commerce platforms, from storefronts to vendor dashboards.",
  },
  {
    id: "education",
    label: "Education & Games",
    tab: "Education & Games",
    blurb: "Learning platforms and games that make education interactive.",
  },
  {
    id: "ai",
    label: "AI Products",
    tab: "AI",
    blurb: "Products with machine learning at the core: vision, audio and recommendations.",
  },
  {
    id: "web3",
    label: "Web3 & Blockchain",
    tab: "Web3",
    blurb: "Onchain apps, token tools and crypto-powered experiences.",
  },
  {
    id: "saas",
    label: "SaaS & Business Tools",
    tab: "SaaS & Tools",
    blurb: "Software that helps teams and small businesses run their day-to-day work.",
  },
];

export interface Project {
  slug: string;
  group: ProjectGroupId;
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
  /** Not launched yet: the card is greyed out and opens a "coming soon" modal instead of the project page. */
  status?: "coming-soon";
}

export const projects: Project[] = [
  {
    slug: "symphome-landing",
    group: "websites",
    title: "SymphoMe Landing Page",
    category: "Landing Page / EdTech",
    description:
      "The marketing site for SymphoMe: the intelligence behind modern music education, for learners, tutors and enterprise.",
    about:
      "The public website for SymphoMe, an AI-powered music education platform. The landing page speaks to three audiences (learners, tutors and enterprise) and explains how SymphoMe listens through your microphone or MIDI keyboard, understands pitch and timing in real time, and guides you on what to practise next. Learners see the AI practice coach, 20+ quiz types, pitch detection, and lessons and assignments. Tutors see their own public booking page, payments through Stripe and Paystack, digital product sales, built-in video lessons, classes with Spaces and Performance Review. The site also includes pricing with a monthly/yearly toggle, community testimonials, an FAQ, a blog powered by the existing WordPress site, legal pages, and Google Analytics that loads only after cookie consent. Built with Next.js and Tailwind, with GSAP, Motion and Lenis for smooth, scroll-driven animation.",
    tech: ["Next.js", "TypeScript", "Tailwind", "GSAP", "Lenis"],
    orientation: "landscape",
    images: [
      "/projects/symphomelanding1.jpg",
      "/projects/symphomelanding2.jpg",
      "/projects/symphomelanding3.jpg",
      "/projects/symphomelanding4.jpg",
      "/projects/symphomelanding5.jpg",
      "/projects/symphomelanding6.jpg",
      "/projects/symphomelanding7.jpg",
    ],
    live: "https://symphome.com",
  },
  {
    slug: "symphome",
    group: "education",
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
    group: "ai",
    title: "Roots AI",
    category: "Music / AI",
    description:
      "AI-powered African drum plugin for music producers smart sample discovery, BPM matching, and authentic percussion loops.",
    about:
      "Roots AI is an AI-powered African drum web application and plugin built for music producers and beatmakers. Developed by Manifxt Audio, it uses AI as a smart recommendation engine to match producers with authentic, human-recorded African percussive drum loops across genres like Afrobeats, Amapiano, Afrohouse, and Miliki. Producers can search via text prompts or upload their melody tracks for automatic BPM detection and loop matching. Every loop in the library is recorded by real musicians and professionally mixed — no synthetic AI-generated patterns. The platform also supports multi-track stem downloads and drag-and-drop workflow integration with DAWs like Ableton, FL Studio, and Logic Pro.",
    tech: ["Next.js", "AI/ML", "Python", "TypeScript"],
    orientation: "landscape",
    images: [
      "/projects/rootsai1.png",
      "/projects/rootsai2.png",
      "/projects/rootsai3.png",
      "/projects/rootsai5.png",
      "/projects/rootsai6.png",
      "/projects/rootsai7.png",
      "/projects/rootsai8.png",
    ],
    live: "https://rootsai.space",
  },
  {
    slug: "vendcliq",
    group: "ecommerce",
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
    slug: "dr-jude-osamor",
    group: "websites",
    title: "Dr. Jude Osamor",
    category: "Personal Brand",
    description:
      "Executive personal brand website for a VP of Cybersecurity, academic researcher and CyBlack co-founder.",
    about:
      "A personal brand website for Dr. Jude Osamor, Vice President of Cybersecurity at a Fortune 500 financial institution, senior lecturer and co-founder of the non-profit CyBlack. The site follows his official brand identity guidelines: a midnight navy and warm beige palette, editorial typography and a light/dark theme toggle. It presents his three brand pillars, the CyBlack mission and impact stats, his published research, and talks and podcast appearances, with an advisory and speaking enquiry flow and an executive briefing newsletter signup handled by Resend.",
    tech: ["Next.js", "Tailwind", "Resend"],
    orientation: "landscape",
    images: [
      "/projects/judeosamor1.jpg",
      "/projects/judeosamor2.jpg",
      "/projects/judeosamor3.jpg",
      "/projects/judeosamor4.jpg",
    ],
    live: "https://judeosamor.vercel.app",
  },
  {
    slug: "lilian-nneji",
    group: "websites",
    title: "Minister Lilian Nneji",
    category: "Music / Artist Website",
    description:
      "Official website for a Nigerian gospel music minister: music, lyrics, gallery, awards and bookings.",
    about:
      "The official website of Minister Lilian Nneji, a Nigerian gospel music minister, songwriter and worship leader. The site opens with a bold full-bleed hero and a new album call-to-action, then leads fans through her biography, discography with streaming links, song lyrics, a concert photo gallery, an awards showcase and the latest music video. Churches and event organisers can book her directly through a booking form, and fans can join the newsletter or reach the team on WhatsApp. Content is managed through Supabase, emails go out through Resend, and the site is fully SEO-optimised for her name and songs.",
    tech: ["Next.js", "Supabase", "Tailwind", "Resend"],
    orientation: "landscape",
    images: [
      "/projects/liliannneji1.jpg",
      "/projects/liliannneji2.jpg",
      "/projects/liliannneji3.jpg",
      "/projects/liliannneji4.jpg",
    ],
    live: "https://www.liliannneji.com",
  },
  {
    slug: "247creativehub",
    group: "websites",
    title: "247CREATIVEHUB",
    category: "Consultancy Website",
    description:
      "Marketing site for a Glasgow-based procurement and supply chain consultancy serving UK SMEs.",
    about:
      "247CREATIVEHUB is a procurement and supply chain consultancy based in Glasgow that helps UK SMEs reduce avoidable cost, improve supplier delivery, release working capital and make risk visible. The website explains its services (spend analysis, supplier performance, inventory optimisation and supply chain resilience), shows how a project runs, and covers the industries it serves, with an interactive \"connected supply view\" widget in the hero. It also hosts the Photography & Video page for the 247 CreativeHub Ltd UK sub-brand. Built with Astro as a fully static site, it ships only about 5 KB of JavaScript, and every section still renders with JavaScript turned off.",
    tech: ["Astro", "TypeScript", "Lenis"],
    orientation: "landscape",
    images: [
      "/projects/247creativehub1.jpg",
      "/projects/247creativehub2.jpg",
      "/projects/247creativehub3.jpg",
      "/projects/247creativehub4.jpg",
    ],
    live: "https://247creativehub.vercel.app",
  },
  {
    slug: "my-pocket-gallery",
    group: "web3",
    title: "My Pocket Gallery",
    category: "Art / Web3",
    description:
      "Art collecting platform for Neftwerk: collector app, gallery owner portal and staff CMS on one backend.",
    about:
      "My Pocket Gallery is Neftwerk's platform for discovering, collecting and showcasing art. I worked across the web side of the ecosystem: the collector web app (forum, discover, gallery, wallet and profile), the staff CMS (Neftwerk Control Plane), and the Gallery Portal, where gallery owners sign in with a passwordless email code via Privy. In the portal, owners can reply to collector enquiries, manage artists, collections and artworks, print QR labels for physical pieces, edit their public gallery profile, and submit KYB documents for verification. These apps and the My Pocket Gallery iOS app (listed separately) share one backend, with role-based access for staff, gallery owners and collectors.",
    tech: ["Next.js", "TypeScript", "Tailwind", "Privy"],
    orientation: "landscape",
    images: [
      "/projects/mypocketgallery1.jpg",
      "/projects/mypocketgallery2.jpg",
      "/projects/mypocketgallery3.jpg",
      "/projects/mypocketgallery4.jpg",
      "/projects/mypocketgallery5.jpg",
      "/projects/mypocketgallery6.jpg",
    ],
    live: "https://mypocketgallery.com",
  },
  {
    slug: "my-pocket-gallery-app",
    group: "web3",
    title: "My Pocket Gallery iOS App",
    category: "Mobile / Art & Web3",
    description:
      "Your gallery, in your pocket: discover original art, browse curated galleries and collect with on-chain ownership.",
    about:
      "The My Pocket Gallery mobile app, live on the Apple App Store, brings Neftwerk's art platform to the phone. Collectors discover original paintings, drawings and mixed media from independent artists, step inside curated galleries from around the world, and open any artwork for full detail on the artist, gallery and collection. A built-in wallet makes buying art simple, and each purchase can be registered on-chain for a verifiable record of ownership. Collectors can message galleries directly, get notified about purchases and new posts in one inbox, join the community forum, and scan an artwork's QR label to jump straight to it. Built with React Native and Expo Router, with Privy for sign-in and wallets, viem for on-chain actions, and English and Spanish translations.",
    tech: ["React Native", "Expo", "TypeScript", "Privy", "viem"],
    orientation: "portrait",
    images: [
      "/projects/mypocketgalleryapp1.jpg",
      "/projects/mypocketgalleryapp2.jpg",
      "/projects/mypocketgalleryapp3.jpg",
      "/projects/mypocketgalleryapp4.jpg",
      "/projects/mypocketgalleryapp5.jpg",
      "/projects/mypocketgalleryapp6.jpg",
    ],
    appStore: "https://apps.apple.com/us/app/my-pocket-gallery/id6789494437",
  },
  {
    slug: "ushsus",
    status: "coming-soon",
    group: "saas",
    title: "Ushsus",
    category: "AI / Church Management",
    description:
      "AI-powered church attendance and usher management platform with live seating maps and AI head counts.",
    about:
      "Ushsus is an AI-powered attendance and usher management platform for churches. Admins get a dashboard of attendance, first-time guests, new converts and occupancy, plus AI insights that flag trends such as rising visitor numbers or falling midweek attendance. The interactive seating map shows occupancy across the main auditorium, balcony and overflow hall. The Head Count tool lets ushers upload or capture a photo of a section, and on-device object detection (TensorFlow.js with COCO-SSD) counts the people in it. The platform also covers services, calendar, departments, usher management, analytics and exportable reports.",
    tech: ["Next.js", "TypeScript", "TensorFlow.js", "Framer Motion"],
    orientation: "landscape",
    images: [
      "/projects/ushsus1.jpg",
      "/projects/ushsus2.jpg",
      "/projects/ushsus3.jpg",
      "/projects/ushsus4.jpg",
      "/projects/ushsus5.jpg",
      "/projects/ushsus6.jpg",
    ],
    live: "https://usechurch.vercel.app",
  },
  {
    slug: "base-terminal",
    group: "web3",
    title: "Base Terminal",
    category: "Web3 / DeFi",
    description:
      "Real-time terminal for discovering, tracking and trading tokens on the Base blockchain.",
    about:
      "Base Terminal is a token discovery and analytics terminal for the Base network. It streams live market data into a dense, trader-focused interface: newly launched tokens, trending tokens across 5m/1h/6h/24h windows, top volume, and launchpad analytics for platforms such as Uniswap, Aerodrome, Zora, Bankr and Clanker. Users can search by name, symbol or contract address, open detailed token pages, keep a watchlist and follow the latest liquidity activity, with wallet connection for trading.",
    tech: ["Next.js", "TypeScript", "Tailwind", "Zustand"],
    orientation: "landscape",
    images: [
      "/projects/baseterminal1.jpg",
      "/projects/baseterminal2.jpg",
      "/projects/baseterminal3.jpg",
      "/projects/baseterminal4.jpg",
    ],
    live: "https://baseterminal.vercel.app",
  },
  {
    slug: "cre8corelabs",
    group: "web3",
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
    slug: "wbh-web",
    group: "ai",
    title: "WBH Web",
    category: "AI / Skincare",
    description:
      "AI-powered skin detection web platform that scans users' faces to identify skin defects and recommends targeted treatments.",
    about:
      "WBH Web is an AI-powered skin analysis platform that uses advanced machine learning to scan users' faces and detect a wide range of skin defects and conditions. Once the AI identifies issues such as acne, hyperpigmentation, dryness, or other concerns, it provides a detailed diagnosis and recommends the best skincare products and treatments tailored to each user's unique skin profile. The web platform features an intuitive interface, real-time camera integration, and a comprehensive product recommendation engine.",
    tech: ["Next.js", "TypeScript", "Tailwind", "AI/ML"],
    orientation: "landscape",
    images: [
      "/projects/wbhweb1.png",
      "/projects/wbhweb2.png",
      "/projects/wbhweb3.png",
      "/projects/wbhweb4.png",
    ],
    live: "https://www.wbhskin.com",
  },
  {
    slug: "wbh-mobile",
    group: "ai",
    title: "WBH Mobile",
    category: "AI / Skincare",
    description:
      "AI skin detection mobile app that scans your face, identifies skin issues, and recommends the best treatment products.",
    about:
      "WBH Mobile brings the AI-powered skin analysis experience to your phone. The app uses your device's camera to scan your face in real-time, leveraging AI to detect skin defects such as acne, dark spots, wrinkles, and other conditions. After the scan, it provides a personalized diagnosis and recommends the best skincare products to treat each identified issue. Built with React Native for a smooth, native experience on both iOS and Android, the app prioritizes ease of use with a clean, intuitive interface.",
    tech: ["React Native", "TypeScript", "AI/ML"],
    orientation: "portrait",
    images: [
      "/projects/wbhmobile1.png",
      "/projects/wbhmobile2.png",
      "/projects/wbhmobile3.png",
    ],
  },
  {
    slug: "irontrack",
    group: "ai",
    title: "IronTrack",
    category: "AI / Fitness",
    description:
      "AI workout tracker that uses your camera to count reps, check form and coach you in real time.",
    about:
      "IronTrack is an AI-powered strength and cardio tracker. Using real-time pose detection with MediaPipe Pose, it watches your workout through the camera, counts your reps, scores your form quality and tracks time under tension. An AI coach handles intake, programming and voice feedback. Users can follow programs, log workouts, review replays and track progress over time, and an admin portal manages exercises, events, users and analytics. The web app is built with Next.js and Supabase, and a companion Expo (React Native) mobile app shares the same backend.",
    tech: ["Next.js", "TypeScript", "Supabase", "MediaPipe", "React Native"],
    orientation: "landscape",
    images: [
      "/projects/irontrack1.jpg",
      "/projects/irontrack2.jpg",
      "/projects/irontrack3.jpg",
    ],
  },
  {
    slug: "tayylo",
    status: "coming-soon",
    group: "saas",
    title: "Tayylo",
    category: "SaaS / Fashion",
    description:
      "The modern tailor's notebook: find any client in seconds and keep every measurement as a dated version.",
    about:
      "Tayylo is a mobile-first app for tailors and fashion designers that replaces the paper measurement book. Tailors can find any client in two seconds, record measurements with a keypad built for tailoring fractions, and keep every measurement as a dated version, so nothing is overwritten and they can see how a client's fit changes from visit to visit. It also handles orders, fitting notes and a daily overview, and installs as a PWA. Built with Next.js and Supabase, with Google and Apple sign-in.",
    tech: ["Next.js", "TypeScript", "Supabase", "Zustand"],
    orientation: "portrait",
    images: [
      "/projects/tayylo1.jpg",
      "/projects/tayylo2.jpg",
      "/projects/tayylo3.jpg",
      "/projects/tayylo4.jpg",
      "/projects/tayylo5.jpg",
    ],
  },
  {
    slug: "nimcapsule",
    group: "web3",
    title: "NimCapsule",
    category: "Web3 / Blockchain",
    description:
      "Digital time capsules with messages, photos and NIM crypto gifts, locked on-chain until the unlock date.",
    about:
      "NimCapsule lets people seal messages, photos and NIM cryptocurrency gifts inside a digital time capsule that opens on a future date, for birthdays, anniversaries, graduations or just because. Unlike other time-capsule apps, the lock is enforced on-chain rather than by a database flag: each gift uses a Nimiq Hash Time-Locked Contract (HTLC) on the Albatross blockchain, so nobody, not even the NimCapsule team, can open a capsule early. Users sign in with their Nimiq wallet or Google, walk through a guided four-step creation flow, and recipients claim the gift with a claim code once it unlocks.",
    tech: ["Next.js", "Supabase", "Nimiq", "Tailwind"],
    orientation: "landscape",
    images: [
      "/projects/nimcapsule1.jpg",
      "/projects/nimcapsule2.jpg",
      "/projects/nimcapsule3.jpg",
    ],
  },
  {
    slug: "storrverse",
    group: "ecommerce",
    title: "Storrverse",
    category: "E-Commerce SaaS",
    description:
      "Multi-tenant e-commerce platform for African merchants: vendor dashboard plus themeable storefronts.",
    about:
      "Storrverse is a multi-vendor e-commerce platform built to help African businesses build, sell and grow online. Merchants manage products, inventory, orders, fulfilment, customers, analytics, marketing, billing and payments from the vendor dashboard, which has two-factor authentication and team accounts. A single storefront deployment serves every store: it resolves the store from the request's subdomain and renders it with the theme the merchant published from the dashboard's Themes & Appearance editor.",
    tech: ["Next.js", "TypeScript", "Tailwind", "Zustand"],
    orientation: "landscape",
    images: [
      "/projects/storrverse1.jpg",
      "/projects/storrverse2.jpg",
      "/projects/storrverse3.jpg",
    ],
  },
  {
    slug: "purger",
    status: "coming-soon",
    group: "ai",
    title: "Purger",
    category: "Desktop / AI Audio",
    description:
      "Offline desktop app that removes noise from audio with on-device AI. Drop in a file, hear it clean, export.",
    about:
      "Purger is a standalone desktop app for AI-powered audio noise removal, built for podcasters, musicians, field recorders and video producers. It runs entirely on-device, with no cloud uploads and no subscription: the user drags in a noisy audio or video file, the DeepFilterNet model (running locally through ONNX Runtime) cleans it, they compare before and after, then export. It supports single files and whole-folder batch processing, with saved presets. Built with Electron, React and Vite for Windows, macOS and Linux.",
    tech: ["Electron", "React", "ONNX Runtime", "Tailwind"],
    orientation: "landscape",
    images: [
      "/projects/purger1.jpg",
      "/projects/purger2.jpg",
      "/projects/purger3.jpg",
    ],
  },
  {
    slug: "cybernovr",
    group: "websites",
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
    slug: "royal-fits",
    group: "ecommerce",
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
    group: "websites",
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
    group: "education",
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

export function getProjectsByGroup(id: ProjectGroupId): Project[] {
  return projects.filter((p) => p.group === id);
}

// All projects in section order, so Prev/Next on a project page walks through related work.
export const orderedProjects: Project[] = projectGroups.flatMap((g) =>
  getProjectsByGroup(g.id)
);

export function isComingSoon(project: Project): boolean {
  return project.status === "coming-soon";
}

export function getAdjacentProjects(slug: string): {
  prev: Project | null;
  next: Project | null;
} {
  // Unreleased projects have no page, so Prev/Next skips them.
  const list = orderedProjects.filter((p) => !isComingSoon(p));
  const index = list.findIndex((p) => p.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? list[index - 1] : list[list.length - 1],
    next: index < list.length - 1 ? list[index + 1] : list[0],
  };
}
