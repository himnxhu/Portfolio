import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import AIChatbot from "@/components/AIChatbot";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Blog />
      <Contact />
      <AIChatbot />
      
      {/* Simple script for fade-in animations */}
      <script dangerouslySetInnerHTML={{
        __html: `
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                entry.target.classList.add('visible');
              }
            });
          }, { threshold: 0.1 });
          
          document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
        `
      }} />
    </main>
  );
}
