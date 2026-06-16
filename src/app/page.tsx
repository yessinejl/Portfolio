import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Timeline from "@/components/sections/Timeline";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";
import SpotlightWrapper from "@/components/layout/SpotlightWrapper";

export default function Home() {
  return (
    <SpotlightWrapper>
      <div className="flex flex-col min-h-screen">
        <Hero />
        <About />
        <Skills />
        <Timeline />
        <Projects />
        <Contact />
      </div>
    </SpotlightWrapper>
  );
}
