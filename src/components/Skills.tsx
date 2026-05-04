import { portfolioData } from "@/data/portfolio";
import styles from "./Skills.module.css";

export default function Skills() {
  return (
    <section id="skills" className={styles.skills}>
      <div className="container">
        <h2 className="fade-in">Skills</h2>
        <div className={styles.grid}>
          {portfolioData.skills.map((skillGroup, index) => (
            <div key={index} className={styles.group}>
              <h3 className={styles.category}>{skillGroup.category}</h3>
              <ul className={styles.list}>
                {skillGroup.items.map((skill) => (
                  <li key={skill} className={styles.item}>{skill}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
