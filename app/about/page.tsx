import type { Metadata } from "next";
import AboutPage from "@/components/about/AboutPage";

export const metadata: Metadata = {
  title: "About · Isaac Osamor",
  description:
    "From civil engineering to software engineering: the story of Isaac Osamor (Cyberzik), a software engineer, pianist and art lover building web, mobile and blockchain products for clients around the world.",
};

export default function Page() {
  return <AboutPage />;
}
