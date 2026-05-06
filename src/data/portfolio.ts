export const portfolioData = {
  name: "Himanshu Upadhyay",
  role: "Data Analyst & AI Application Developer",
  pitch: "I bridge the gap between data and intelligence using Python, Agentic Workflows, and Advanced Analytics.",
  availability: "Available for full-time from July 2026",
  about: {
    story: "I am a Computer Science student at NIET with a passion for transforming raw data into actionable insights. I specialize in building AI applications that leverage LLMs and vector databases to solve complex document and resume analysis problems.",
    motivation: "My goal is to create tools that make information more accessible and decisions more data-driven.",
  },
  projects: [
    {
      title: "AI Resume Analyzer with Job Matching",
      description: "An AI-powered screening system that evaluates candidate-job compatibility using NLP and semantic search.",
      problem: "Traditional ATS systems often miss semantic context and deep skill relationships in resumes.",
      tech: ["Python", "spaCy", "Sentence Transformers", "FAISS", "Streamlit"],
      outcome: "Implemented semantic similarity search with ATS-style job match scores and personalized recommendations.",
      learning: "Semantic search with FAISS and Sentence Transformers significantly outperforms keyword matching in recruitment contexts.",
      links: {
        demo: "https://resume-analyzer-1-smpu.onrender.com/",
        github: "https://github.com/himnxhu/resume-analyzer",
      },
    },
    {
      title: "AI-Powered PDF Question Answering System",
      description: "A document query system utilizing RAG (Retrieval-Augmented Generation) for instant insights.",
      problem: "Extracting specific insights from long PDF documents is time-consuming and manual.",
      tech: ["Gemini API", "LangChain", "FAISS", "Streamlit", "Python"],
      outcome: "Enabled natural language queries for instant document information retrieval with high precision.",
      learning: "Vector database indexing and prompt engineering are critical for minimizing hallucinations in RAG systems.",
      links: {
        demo: "https://ai-pdf-chatbot-r5r8.onrender.com/",
        github: "https://github.com/himnxhu/AI-Pdf-Chatbot",
      },
    },
    {
      title: "Healthcare Data Visualization",
      description: "A comprehensive analysis of hospital performance and patient satisfaction metrics.",
      problem: "Hospital management lacked visibility into operational efficiency and service quality trends.",
      tech: ["Pandas", "Power BI", "Python", "Matplotlib", "Seaborn"],
      outcome: "Developed dashboards that identified key performance indicators, supporting data-driven hospital management.",
      learning: "Effective data storytelling requires balancing complex analytics with intuitive visual hierarchies.",
      links: {
        demo: "https://github.com/himnxhu/healthcareAnalysis",
        github: "https://github.com/himnxhu/healthcareAnalysis",
      },
    },
    {
      title: "E-commerce Sales Data Analysis",
      description: "Strategic analysis of retail data to identify growth opportunities and behavior patterns.",
      problem: "Unstructured sales data prevented effective marketing spend and inventory allocation.",
      tech: ["Excel (Advanced)", "SQL", "Tableau", "Python", "Seaborn"],
      outcome: "Provided actionable insights on regional demand and high-performing categories to optimize business strategy.",
      learning: "Advanced SQL window functions and Excel pivot analysis are indispensable for deep-dive sales cohort analysis.",
      links: {
        demo: "https://github.com/himnxhu/ecommerce.site.git",
        github: "https://github.com/himnxhu/ecommerce.site.git",
      },
    },
    {
      title: "Team Task Manager",
      description: "A collaborative full-stack platform for real-time project and task management.",
      problem: "Teams needed a secure, scalable way to track progress with role-based permissions.",
      tech: ["Node.js", "Express", "PostgreSQL", "React", "REST API"],
      outcome: "Developed an interactive dashboard with secure RBAC and optimized database queries for team collaboration.",
      learning: "Secure authentication and robust database schema design are the foundation of reliable enterprise-level tools.",
      links: {
        demo: "https://team-task-manager-qodx.onrender.com",
        github: "https://github.com/himnxhu/Portfolio.git",
      },
    },
  ],
  skills: [
    { category: "Programming", items: ["Python", "SQL", "Java"] },
    { category: "AI & ML", items: ["Gemini API", "Agentic Workflows", "LangChain", "Hugging Face", "Ollama", "Vector DBs"] },
    { category: "Data Analysis", items: ["Pandas", "NumPy", "EDA", "Power BI", "Tableau", "Excel (Advanced)"] },
    { category: "Tools & DB", items: ["Git", "Postman", "VS Code", "SQL", "MongoDB", "PostgreSQL"] },
  ],
  contact: {
    email: "upadhyayhimanshu842@gmail.com",
    linkedin: "https://www.linkedin.com/in/himanshu-upadhyay-190170205/",
    github: "https://github.com/himnxhu",
    resume: "/resume.pdf",
    phone: "+91-6397551518",
  },
};

export const blogPosts = [
  {
    id: 1,
    title: "Understanding Agentic Workflows",
    excerpt: "Why the future of AI isn't just LLMs, but autonomous agents that can use tools.",
    content: "Agentic workflows represent a shift from static prompt-response cycles to dynamic, multi-step processes where AI agents use tools and make decisions. This evolution is critical for tasks requiring reasoning, planning, and execution across different platforms. In this post, we explore how frameworks like LangChain and CrewAI are enabling this transition. We'll look at how agents can decompose complex goals, select appropriate tools (like web search or database queries), and handle errors autonomously. The future of productivity lies in these self-correcting, goal-oriented systems that work alongside humans to solve high-level problems.",
    date: "May 20, 2026",
    readTime: "5 min read",
    likes: 42,
    category: "AI",
  },
  {
    id: 2,
    title: "SQL vs NoSQL for Data Analysts",
    excerpt: "Choosing the right database architecture for your analysis pipeline.",
    content: "For data analysts, the choice between SQL and NoSQL often depends on the structure of the data and the scale of the analysis. SQL databases excel in structured environments with complex relationships, while NoSQL offers flexibility for unstructured data. We'll dive into the pros and cons of each in various analytical scenarios. SQL remains the gold standard for financial reporting and structured business intelligence, offering ACID compliance and powerful joining capabilities. However, NoSQL databases like MongoDB or Cassandra are increasingly vital for handling real-time telemetry data, social media feeds, and other high-velocity, polymorphic datasets. Understanding when to trade consistency for availability is a key skill for the modern data professional.",
    date: "May 15, 2026",
    readTime: "3 min read",
    likes: 28,
    category: "Data",
  },
];
