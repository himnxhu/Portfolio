"use client";

import { useState, useEffect } from "react";
import { blogPosts as staticPosts } from "@/data/portfolio";
import styles from "./Blog.module.css";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  read_time?: string;
  readTime?: string;
  likes?: number;
  category: string;
}

interface Comment {
  id: number;
  content: string;
  user_id: string;
  created_at: string;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [expandedPosts, setExpandedPosts] = useState<number[]>([]);
  const [userLikedPosts, setUserLikedPosts] = useState<number[]>([]);
  const [showComments, setShowComments] = useState<Record<number, boolean>>({});
  const [comments, setComments] = useState<Record<number, Comment[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string>("");
  const [editingComment, setEditingComment] = useState<{id: number, content: string} | null>(null);

  useEffect(() => {
    // Initialize User ID and Liked Posts from LocalStorage
    let id = localStorage.getItem("portfolio_user_id");
    if (!id) {
      id = Math.random().toString(36).substring(2, 15);
      localStorage.setItem("portfolio_user_id", id);
    }
    queueMicrotask(() => setUserId(id));

    const liked = JSON.parse(localStorage.getItem("portfolio_liked_posts") || "[]");
    queueMicrotask(() => setUserLikedPosts(liked));

    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        const dbPosts = await response.json();
        if (response.ok && Array.isArray(dbPosts) && dbPosts.length > 0) {
          setPosts(dbPosts);
        } else {
          setPosts(staticPosts);
        }
      } catch {
        setPosts(staticPosts);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const fetchComments = async (postId: number) => {
    try {
      const response = await fetch(`/api/comments?postId=${postId}`);
      const data = await response.json();
      if (response.ok) {
        setComments(prev => ({ ...prev, [postId]: data }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedPosts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleLike = async (postId: number) => {
    const isLiked = userLikedPosts.includes(postId);
    const action = isLiked ? 'unlike' : 'like';

    try {
      const response = await fetch("/api/posts/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, action }),
      });
      const data = await response.json();
      
      if (response.ok) {
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: data.likes } : p));
        const newLiked = isLiked 
          ? userLikedPosts.filter(id => id !== postId)
          : [...userLikedPosts, postId];
        setUserLikedPosts(newLiked);
        localStorage.setItem("portfolio_liked_posts", JSON.stringify(newLiked));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleComments = (id: number) => {
    if (!showComments[id]) fetchComments(id);
    setShowComments((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePostComment = async (postId: number, content: string) => {
    if (!content.trim()) return;
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, content, userId }),
      });
      if (response.ok) fetchComments(postId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComment = async (postId: number, commentId: number) => {
    if (!confirm("Are you sure you want to delete your comment?")) return;
    try {
      const response = await fetch(`/api/comments?id=${commentId}&userId=${userId}`, {
        method: "DELETE",
      });
      if (response.ok) fetchComments(postId);
      else {
        const data = await response.json();
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateComment = async (postId: number) => {
    if (!editingComment || !editingComment.content.trim()) return;
    try {
      const response = await fetch("/api/comments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId: editingComment.id, content: editingComment.content, userId }),
      });
      const data = await response.json();
      if (response.ok) {
        setEditingComment(null);
        fetchComments(postId);
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const canEdit = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diff = (now.getTime() - created.getTime()) / 1000 / 60;
    return diff < 5;
  };

  const handleShare = async (post: BlogPost) => {
    if (navigator.share) {
      try {
        await navigator.share({ title: post.title, text: post.excerpt, url: window.location.href });
      } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied!");
    }
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
              const isLiked = userLikedPosts.includes(post.id);
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
                    <button className={styles.readMore} onClick={() => toggleExpand(post.id)}>
                      {isExpanded ? "Show Less" : "Read More"}
                    </button>
                  </div>
                  
                  <div className={styles.footer}>
                    <div className={styles.engagement}>
                      <span 
                        className={`${styles.stat} ${isLiked ? styles.liked : ""}`} 
                        onClick={() => handleLike(post.id)}
                      >
                        {isLiked ? "❤️" : "🤍"} {post.likes || 0}
                      </span>
                      <span className={styles.stat} onClick={() => toggleComments(post.id)}>
                        💬 Comment {(comments[post.id] || []).length > 0 ? `(${(comments[post.id] || []).length})` : ""}
                      </span>
                      <span className={styles.stat} onClick={() => handleShare(post)}>
                        ↗️ Share
                      </span>
                    </div>

                    {showComments[post.id] && (
                      <div className={styles.commentSection}>
                        <div className={styles.commentList}>
                          {(comments[post.id] || []).map((c) => (
                            <div key={c.id} className={styles.comment}>
                              {editingComment?.id === c.id ? (
                                <div className={styles.editArea}>
                                  <textarea 
                                    value={editingComment.content}
                                    onChange={(e) => setEditingComment({ ...editingComment, content: e.target.value })}
                                    className={styles.commentInput}
                                  />
                                  <div className={styles.editActions}>
                                    <button onClick={() => handleUpdateComment(post.id)} className={styles.commentSubmit}>Save</button>
                                    <button onClick={() => setEditingComment(null)} className={styles.cancelBtn}>Cancel</button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className={styles.commentContent}>{c.content}</div>
                                  {c.user_id === userId && (
                                    <div className={styles.commentActions}>
                                      {canEdit(c.created_at) && (
                                        <button onClick={() => setEditingComment({ id: c.id, content: c.content })} className={styles.actionBtn}>Edit</button>
                                      )}
                                      <button onClick={() => handleDeleteComment(post.id, c.id)} className={styles.actionBtn}>Delete</button>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                        <form 
                          className={styles.commentForm}
                          onSubmit={(e) => {
                            e.preventDefault();
                            const input = e.currentTarget.elements.namedItem("comment") as HTMLInputElement;
                            handlePostComment(post.id, input.value);
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
