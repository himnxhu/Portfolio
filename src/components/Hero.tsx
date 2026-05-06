import { portfolioData } from "@/data/portfolio";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.glow}></div>
      <div className="container">
        <div className="fade-in visible">
          <div className={styles.badge}>
            <span className={styles.pulse}></span>
            {portfolioData.availability}
          </div>
          <h1 className={styles.title}>{portfolioData.name}</h1>
          <p className={styles.role}>{portfolioData.role}</p>
          <p className={styles.pitch}>{portfolioData.pitch}</p>
          <div className={styles.cta}>
            <a href="#contact" className={styles.buttonPrimary}>Let&apos;s talk</a>
            <a href="#projects" className={styles.buttonSecondary}>View Projects</a>
          </div>
        </div>
      </div>
    </section>
  );
}
