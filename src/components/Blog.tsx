import { blogPosts } from "@/data/portfolio";
import styles from "./Blog.module.css";

export default function Blog() {
  return (
    <section id="blog" className={styles.blog}>
      <div className="container">
        <h2 className="fade-in">Recent Insights</h2>
        <div className={styles.feed}>
          {blogPosts.map((post) => (
            <article key={post.id} className={styles.post}>
              <div className={styles.header}>
                <div className={styles.avatar}>H</div>
                <div className={styles.meta}>
                  <span className={styles.author}>Himanshu Upadhyay</span>
                  <span className={styles.date}>{post.date} • {post.readTime}</span>
                </div>
                <span className={styles.category}>{post.category}</span>
              </div>
              
              <div className={styles.content}>
                <h3 className={styles.title}>{post.title}</h3>
                <p className={styles.excerpt}>{post.excerpt}</p>
              </div>
              
              <div className={styles.footer}>
                <div className={styles.engagement}>
                  <span className={styles.stat}>❤️ {post.likes}</span>
                  <span className={styles.stat}>💬 Comment</span>
                  <span className={styles.stat}>↗️ Share</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
