"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./Admin.module.css";

export default function AdminPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [secret, setSecret] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [postExcerpt, setPostExcerpt] = useState("");
  const [postContent, setPostContent] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const password = prompt("Enter Secret Key to Access Admin Panel:");
    const SECRET_KEY = "himanshu@2026";

    if (password === SECRET_KEY) {
      setIsAuthorized(true);
      setSecret(password);
    } else {
      alert("Access Denied: Only accessible by Himanshu");
      router.push("/");
    }
  }, [router]);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishing(true);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title: postTitle, 
          excerpt: postExcerpt, 
          content: postContent,
          secret: secret
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Post published successfully to PostgreSQL!");
        setPostTitle("");
        setPostExcerpt("");
        setPostContent("");
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Publish error:", error);
      alert("Failed to connect to the database API.");
    } finally {
      setIsPublishing(false);
    }
  };

  if (!isAuthorized) return <div className={styles.loading}>Authenticating...</div>;

  return (
    <main className={styles.admin}>
      <div className="container">
        <h1 className={styles.title}>Admin Panel <span>(Himanshu)</span></h1>
        
        <section className={styles.formSection}>
          <h2>Create New Blog Post</h2>
          <form className={styles.form} onSubmit={handlePost}>
            <div className={styles.inputGroup}>
              <label>Post Title</label>
              <input 
                type="text" 
                value={postTitle} 
                onChange={(e) => setPostTitle(e.target.value)}
                placeholder="e.g., The Future of Agentic AI"
                required
                disabled={isPublishing}
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label>Excerpt (Short Description)</label>
              <input 
                type="text" 
                value={postExcerpt} 
                onChange={(e) => setPostExcerpt(e.target.value)}
                placeholder="A brief hook for the readers..."
                required
                disabled={isPublishing}
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label>Full Content</label>
              <textarea 
                value={postContent} 
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="Write your full technical insight here..."
                required
                rows={10}
                disabled={isPublishing}
              />
            </div>
            
            <button type="submit" className={styles.submitBtn} disabled={isPublishing}>
              {isPublishing ? "Publishing..." : "Publish Post"}
            </button>
          </form>
        </section>

        <button className={styles.logoutBtn} onClick={() => router.push("/")} disabled={isPublishing}>
          Back to Website
        </button>
      </div>
    </main>
  );
}
