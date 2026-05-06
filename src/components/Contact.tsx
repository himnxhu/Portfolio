import { portfolioData } from "@/data/portfolio";
import styles from "./Contact.module.css";

export default function Contact() {
  return (
    <section id="contact" className={styles.contact}>
      <div className="container">
        <h2 className="fade-in">Let&apos;s Connect</h2>
        <div className={`${styles.content} fade-in`}>
          <p className={styles.pitch}>
            I&apos;m always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
          </p>
          
          <div className={styles.links}>
            <div className={styles.emailWrapper}>
              <span className={styles.emailLabel}>Drop a line</span>
              <a href={`mailto:${portfolioData.contact.email}`} className={styles.email}>
                {portfolioData.contact.email}
              </a>
            </div>
            
            <a href={`tel:${portfolioData.contact.phone}`} className={styles.phone}>
              📞 {portfolioData.contact.phone}
            </a>
            
            <div className={styles.social}>
              <a href={portfolioData.contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href={portfolioData.contact.github} target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}