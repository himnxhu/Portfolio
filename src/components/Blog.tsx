"use client";

import { useState, useEffect } from "react";
import { blogPosts as staticPosts } from "@/data/portfolio";
import styles from "./Blog.module.css";

export default function Blog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [expandedPosts, setExpandedPosts] = useState<number[]>([]);
  const [likes, setLikes] = useState<Record<number, number>>({});
  const [showComments, setShowComments] = useState<Record<number, boolean>>({});
  const [comments, setComments] = useState<Record<number, string[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        const dbPosts = await response.json();
        
        if (response.ok && Array.isArray(dbPosts) && dbPosts.length > 0) {
          setPosts(dbPosts);
        } else {
          setPosts(staticPosts);
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        setPosts(staticPosts);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    // Sync likes when posts change
    const initialLikes = posts.reduce((acc, post) => ({ ...acc, [post.id]: post.likes || 0 }), {});
    setLikes(initialLikes);
  }, [posts]);

  const toggleExpand = (id: number) => {
    setExpandedPosts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleLike = (id: number) => {
    setLikes((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const toggleComments = (id: number) => {
    setShowComments((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleShare = async (post: any) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const addComment = (id: number, comment: string) => {
    if (!comment.trim()) return;
    setComments((prev) => ({
      ...prev,
      [id]: [...(prev[id] || []), comment],
    }));
  };

  return (
    <section id="blog" className={styles.blog}>
      <div className="container">
        <h2 className="fade-in">Blog</h2>
        
        {isLoading ? (
          <div className={styles.loading}>Loading technical insights...</div>
        ) : (
          <div className={styles.feed}>
            {posts.map((post) => {
              const isExpanded = expandedPosts.includes(post.id);
              return (
                <article key={post.id} className={styles.post}>
                  <div className={styles.header}>
                    <div className={styles.avatar}>H</div>
                    <div className={styles.meta}>
                      <span className={styles.author}>Himanshu Upadhyay</span>
                      <span className={styles.date}>{post.date} • {post.read_time || post.readTime}</span>
                    </div>
                    <span className={styles.category}>{post.category}</span>
                  </div>
                  
                  <div className={styles.content}>
                    <h3 className={styles.title} onClick={() => toggleExpand(post.id)} style={{ cursor: 'pointer' }}>
                      {post.title}
                    </h3>
                    <p className={styles.excerpt}>
                      {isExpanded ? post.content : post.excerpt}
                    </p>
                    <button 
                      className={styles.readMore} 
                      onClick={() => toggleExpand(post.id)}
                    >
                      {isExpanded ? "Show Less" : "Read More"}
                    </button>
                  </div>
                  
                  <div className={styles.footer}>
                    <div className={styles.engagement}>
                      <span className={styles.stat} onClick={() => handleLike(post.id)}>
                        ❤️ {likes[post.id] || 0}
                      </span>
                      <span className={styles.stat} onClick={() => toggleComments(post.id)}>
                        💬 Comment
                      </span>
                      <span className={styles.stat} onClick={() => handleShare(post)}>
                        ↗️ Share
                      </span>
                    </div>

                    {showComments[post.id] && (
                      <div className={styles.commentSection}>
                        <div className={styles.commentList}>
                          {(comments[post.id] || []).map((c, i) => (
                            <div key={i} className={styles.comment}>{c}</div>
                          ))}
                        </div>
                        <form 
                          className={styles.commentForm}
                          onSubmit={(e) => {
                            e.preventDefault();
                            const input = e.currentTarget.elements.namedItem("comment") as HTMLInputElement;
                            addComment(post.id, input.value);
                            input.value = "";
                          }}
                        >
                          <input name="comment" placeholder="Add a comment..." className={styles.commentInput} />
                          <button type="submit" className={styles.commentSubmit}>Post</button>
                        </form>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
