"use client";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Projects from "../components/Projects";
import Stack from "../components/Stack";
import Footer from "../components/Footer";
import PixelSnow from "../components/PixelSnow";
import Contact from "../components/Contact";
import SmoothScroll from "../components/SmoothScroll";

export default function Home() {
  return (
    <SmoothScroll>
      <div className="fixed inset-0 -z-10 bg-black">
        <PixelSnow
          color="white"
          flakeSize={0.01}
          minFlakeSize={1.25}
          pixelResolution={1000}
          speed={1.25}
          density={0.3}
          direction={125}
          brightness={1}
          depthFade={8}
          farPlane={20}
          gamma={0.4545}
          variant="square"
        />
      </div>

      {/* Foreground. Keep this wrapper free of overflow/transform/filter: the projects
          pathway uses position: sticky, which any of those would break. */}
      <div className="relative z-10 min-h-screen">
        <Navbar />
        <Hero />
        <Projects />
        <Stack />
        <Contact />
        <Footer />
      </div>
    </SmoothScroll>
  );
}
