import { portfolioData } from "@/data/portfolio";
import styles from "./About.module.css";

export default function About() {
  return (
    <section id="about" className={styles.about}>
      <div className="container">
        <h2 className="fade-in">About Me</h2>
        <div className={styles.content}>
          <p className={styles.story}>{portfolioData.about.story}</p>
          <p className={styles.motivation}>{portfolioData.about.motivation}</p>
        </div>
      </div>
    </section>
  );
}
