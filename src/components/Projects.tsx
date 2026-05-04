import { portfolioData } from "@/data/portfolio";
import styles from "./Projects.module.css";

export default function Projects() {
  return (
    <section id="projects" className={styles.projects}>
      <div className="container">
        <h2 className="fade-in">Selected Projects</h2>
        <div className={styles.grid}>
          {portfolioData.projects.map((project, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.content}>
                <h3 className={styles.title}>{project.title}</h3>
                <p className={styles.description}>{project.description}</p>
                
                <div className={styles.detail}>
                  <strong>Problem:</strong> {project.problem}
                </div>
                
                <div className={styles.outcome}>
                  <strong>Outcome:</strong> <span className={styles.highlight}>{project.outcome}</span>
                </div>
                
                <div className={styles.learning}>
                  <strong>What I learned:</strong> {project.learning}
                </div>
                
                <div className={styles.tech}>
                  {project.tech.map((t) => (
                    <span key={t} className={styles.tag}>{t}</span>
                  ))}
                </div>
                
                <div className={styles.links}>
                  <a href={project.links.demo} target="_blank" rel="noopener noreferrer" className={styles.link}>Live Demo</a>
                  <a href={project.links.github} target="_blank" rel="noopener noreferrer" className={styles.link}>GitHub</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
