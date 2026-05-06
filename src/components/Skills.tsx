import { portfolioData } from "@/data/portfolio";
import styles from "./Skills.module.css";

export default function Skills() {
  return (
    <section id="skills" className={styles.skills}>
      <div className="container">
        <h2 className="fade-in">Technical Expertise</h2>
        <div className={`${styles.grid} fade-in`}>
          {portfolioData.skills.map((skillGroup, index) => (
            <div key={index} className={styles.categoryBlock}>
              <h3 className={styles.category}>{skillGroup.category}</h3>
              <ul className={styles.list}>
                {skillGroup.items.map((item, i) => (
                  <li key={i} className={styles.item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
