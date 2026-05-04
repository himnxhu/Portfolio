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
      title: "AI Resume Analyzer",
      description: "An AI-powered screening system that evaluates candidate-job compatibility.",
      problem: "Traditional ATS systems often miss semantic context in resumes.",
      tech: ["Python", "NLP", "Streamlit", "FAISS", "Sentence Transformers"],
      outcome: "Implemented semantic similarity search to generate accurate job match scores.",
      learning: "Semantic search with FAISS is significantly more effective than keyword matching for resume parsing.",
      links: {
        demo: "https://example.com",
        github: "https://github.com",
      },
    },
    {
      title: "PDF Question Answering System",
      description: "A document query system utilizing RAG (Retrieval-Augmented Generation).",
      problem: "Extracting specific insights from long PDF documents is time-consuming.",
      tech: ["Gemini API", "LangChain", "FAISS", "Streamlit"],
      outcome: "Enabled natural language queries for instant document information retrieval.",
      learning: "Vector database optimization is the bottleneck for RAG system performance.",
      links: {
        demo: "https://example.com",
        github: "https://github.com",
      },
    },
    {
      title: "Healthcare Data Visualization",
      description: "A comprehensive analysis of hospital performance and patient satisfaction.",
      problem: "Hospital management lacked visibility into operational efficiency trends.",
      tech: ["Pandas", "Power BI", "Python", "Seaborn"],
      outcome: "Identified key service quality metrics that supported hospital management improvements.",
      learning: "Data cleaning accounts for 80% of the work in delivering meaningful visualizations.",
      links: {
        demo: "https://example.com",
        github: "https://github.com",
      },
    },
  ],
  skills: [
    { category: "Programming", items: ["Python", "SQL", "Java"] },
    { category: "AI & ML", items: ["Gemini API", "Agentic Workflows", "LangChain", "Ollama", "FAISS"] },
    { category: "Data Analysis", items: ["Pandas", "NumPy", "EDA", "Power BI", "Tableau"] },
    { category: "Tools & DB", items: ["Git", "Postman", "VS Code", "MongoDB", "SQL"] },
  ],
  contact: {
    email: "upadhyayhimanshu842@gmail.com",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    resume: "/resume.pdf",
    phone: "+91-6397551518",
  },
};

export const blogPosts = [
  {
    id: 1,
    title: "Understanding Agentic Workflows",
    excerpt: "Why the future of AI isn't just LLMs, but autonomous agents that can use tools.",
    date: "May 20, 2026",
    readTime: "5 min read",
    likes: 42,
    category: "AI",
  },
  {
    id: 2,
    title: "SQL vs NoSQL for Data Analysts",
    excerpt: "Choosing the right database architecture for your analysis pipeline.",
    date: "May 15, 2026",
    readTime: "3 min read",
    likes: 28,
    category: "Data",
  },
];
