"use client";

import { useState, useEffect } from "react";
import styles from "./Header.module.css";
import { portfolioData } from "@/data/portfolio";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={`${styles.container} container`}>
        <div className={styles.logo}>
          <a href="#">H<span>U.</span></a>
        </div>
        
        <nav className={`${styles.nav} ${mobileMenuOpen ? styles.navOpen : ""}`}>
          <ul>
            <li><a href="#about" onClick={() => setMobileMenuOpen(false)}>About</a></li>
            <li><a href="#projects" onClick={() => setMobileMenuOpen(false)}>Projects</a></li>
            <li><a href="#skills" onClick={() => setMobileMenuOpen(false)}>Skills</a></li>
            <li><a href="#blog" onClick={() => setMobileMenuOpen(false)}>Blog</a></li>
            <li><a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a></li>
          </ul>
          <a href={portfolioData.contact.resume} className={styles.resumeBtn} download>
            Resume
          </a>
        </nav>

        <button className={styles.hamburger} onClick={toggleMenu} aria-label="Toggle Menu">
          <span className={`${styles.bar} ${mobileMenuOpen ? styles.barOpen1 : ""}`}></span>
          <span className={`${styles.bar} ${mobileMenuOpen ? styles.barOpen2 : ""}`}></span>
          <span className={`${styles.bar} ${mobileMenuOpen ? styles.barOpen3 : ""}`}></span>
        </button>
      </div>
    </header>
  );
}
