import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Expertise } from "@/components/Expertise";
import { Services } from "@/components/Services";
import { Projects } from "@/components/Projects";
import { GitHubSection } from "@/components/GitHub";
import { AIFocus } from "@/components/AIFocus";
import { Journey } from "@/components/Journey";
import { Contact } from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Expertise />
      <Services />
      <Projects />
      <GitHubSection />
      <AIFocus />
      <Journey />
      <Contact />
    </>
  );
}
