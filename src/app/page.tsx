import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import AIChatbot from "@/components/AIChatbot";
import ScrollObserver from "@/components/ScrollObserver";

export default function Home() {
  return (
    <main>
      <ScrollObserver />
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Blog />
      <Contact />
      <AIChatbot />
    </main>
  );
}
