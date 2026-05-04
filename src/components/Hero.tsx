import { portfolioData } from "@/data/portfolio";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className="container">
        <div className={styles.badge}>{portfolioData.availability}</div>
        <h1 className={styles.title}>{portfolioData.name}</h1>
        <p className={styles.role}>{portfolioData.role}</p>
        <p className={styles.pitch}>{portfolioData.pitch}</p>
        <div className={styles.cta}>
          <a href="#contact" className={styles.button}>Let&apos;s talk</a>
        </div>
      </div>
    </section>
  );
}
