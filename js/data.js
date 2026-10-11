/*
 * data.js — the single source of truth for this portfolio.
 * The website sections, the resume page AND the chatbot all read from this file.
 * Edit it once and everything stays in sync.
 *
 * Anything marked TODO is a value I didn't have. Fill it in; empty strings are
 * handled gracefully (links are hidden, the chatbot says "not added yet").
 */
const PROFILE = {
  name: "Snigdha Reddy Reguri",
  first: "Snigdha",
  headline: "Building agentic AI tools and full-stack apps",
  location: "Hyderabad, India",
  age: "", // TODO: optional, e.g. "19 years old". Leave empty to keep it private; the chatbot will say it isn't listed.

  summary:
    "Second-year B.Tech CSE (AI & ML) student at VNRVJIET. I build with local LLMs and agent workflows, " +
    "and with the MERN stack, and I keep my fundamentals (DSA, OOP, DBMS, OS) sharp for campus placements.",

  about: [
    "I'm a second-year Computer Science (AI & ML) student at VNR Vignana Jyothi Institute of Engineering and Technology in Hyderabad, " +
      "with a current CGPA of 9.83.",
    "My project work sits in two areas: agentic AI (local models served through Ollama, wired into Streamlit apps) and full-stack " +
      "web development with MongoDB, Express, React and Node. I like working on the logic that makes a system decide and act, " +
      "and I've built the AI agent logic for one project and the backend for another.",
    "Outside class I compete in coding contests and hackathons, and I'm active in my college's tech communities."
  ],

  // Edit these freely — they are a summary of the focus areas visible in the projects.
  interests: [
    "Agentic AI and local LLMs",
    "Full-stack web development (MERN)",
    "Data structures and competitive problem solving"
  ],

  education: [
    {
      school: "VNR Vignana Jyothi Institute of Engineering and Technology (VNRVJIET)",
      degree: "B.Tech, Computer Science and Engineering (AI & ML)",
      period: "Expected 2029",
      detail: "Current CGPA 9.83. Coursework: Data Structures and Algorithms, Object-Oriented Programming, DBMS, Operating Systems."
    },
    {
      school: "Narayana Junior College",
      degree: "Class XII (Intermediate)",
      period: "",
      detail: "988 / 1000 (9.88 CGPA)."
    }
  ],

  skills: [
    { group: "Languages", items: ["C", "C++", "Java", "JavaScript", "Python"] },
    { group: "Web (MERN)", items: ["MongoDB", "Express", "React.js", "Node.js"] },
    { group: "Databases", items: ["MongoDB", "Oracle SQL", "MySQL"] },
    { group: "AI and data", items: ["NumPy", "Pandas", "Ollama", "LLaMA 3.2", "Qwen", "Tesseract OCR"] },
    { group: "Frameworks and tools", items: ["Spring Boot", "Streamlit"] },
    { group: "CS fundamentals", items: ["Data Structures and Algorithms", "OOP", "DBMS", "Operating Systems"] }
  ],

  projects: [
    {
      id: "workbench",
      name: "Sovereign Agentic AI Workbench",
      keywords: ["sovereign", "workbench", "agentic", "agent"],
      summary:
        "An agentic AI workbench that runs local language models (LLaMA 3.2 and Qwen through Ollama) behind a Streamlit interface, " +
        "so the models run on your own machine.",
      stack: ["Streamlit", "Ollama", "LLaMA 3.2", "Qwen"],
      team: "Team of 6",
      role: "Built the AI agent logic.",
      note: "Built for the Smart India Hackathon 2026 internal round (problem statement SIH26117).",
      repo: "" // TODO: GitHub link
    },
    {
      id: "compliance",
      name: "Compliance System for Packaged Commodities",
      keywords: ["compliance", "commodit", "packaged", "packaging", "package"],
      summary:
        "A system that checks packaged commodities for compliance, using Tesseract OCR to read details from packaging. " +
        "Spring Boot and MySQL on the backend, Streamlit on the front.",
      stack: ["Spring Boot", "MySQL", "Streamlit", "Tesseract OCR"],
      team: "Team of 5",
      role: "Built the backend.",
      note: "",
      repo: "" // TODO: GitHub link
    },
    {
      id: "skillexchange",
      name: "Student Skill Exchange",
      keywords: ["skill exchange", "exchange", "student skill"],
      summary: "A full-stack web app where students exchange skills with each other, built on the MERN stack.",
      stack: ["React.js", "Node.js", "MongoDB"],
      team: "Solo project",
      role: "Designed and built it end to end.",
      note: "",
      repo: "" // TODO: GitHub link
    }
  ],

  leadership: [
    {
      title: "Team lead, Smart India Hackathon 2026 (internal round)",
      when: "Sept 2026",
      detail:
        "Led a team of 6 on problem statement SIH26117 and built the Sovereign Agentic AI Workbench. " +
        "The team did not advance past the internal round."
    }
  ],

  achievements: [
    {
      title: "1st place, Techtriads coding contest",
      when: "2nd semester",
      detail: "College-level contest with coding and logical-reasoning rounds, won with a teammate."
    },
    {
      title: "Participated in a Generative AI hackathon",
      when: "",
      detail: ""
    }
  ],

  certifications: [
    { title: "Generative AI", issuer: "MeitY-NASSCOM FutureSkills Prime" },
    { title: "Generative AI", issuer: "IBM SkillsBuild" }
  ],

  communities: [
    { name: "myRTC", detail: "Women in Tech community" },
    { name: "CSI", detail: "Computer Society of India student chapter" },
    { name: "Turing Hut", detail: "VNRVJIET's programming club" }
  ],

  // TODO: fill these in. Empty strings are hidden on the site.
  links: {
    github: "https://github.com/snigdhareddyreguri",
    linkedin: "https://www.linkedin.com/in/snigdha-reddy-reguri-a40916384/",
    leetcode: "https://leetcode.com/u/snigdha_reddy_reguri/",
    codeforces: "",
    codechef: "https://www.codechef.com/users/snigdha_reguri",
    hackerrank: "",
    email: "snigdhareddy.reguri@gmail.com",
    phone: ""
  },

  // The resume page is generated from this same data; add a PDF too if you like.
  resume: {
    page: "resume.html",
    pdf: "assets/Snigdha_Reddy_Reguri_Resume.pdf" // TODO: drop your PDF here (optional, but recommended)
  },

  /* Words the chatbot recognises as technologies. label must match the strings used in skills/stack above. */
  techAliases: {
    "c": "C", "c++": "C++", "cpp": "C++", "java": "Java", "javascript": "JavaScript", "js": "JavaScript",
    "python": "Python", "py": "Python",
    "mern": "MERN", "mongodb": "MongoDB", "mongo": "MongoDB", "express": "Express",
    "react": "React.js", "react.js": "React.js", "reactjs": "React.js",
    "node": "Node.js", "node.js": "Node.js", "nodejs": "Node.js",
    "sql": "Oracle SQL", "oracle": "Oracle SQL", "oracle sql": "Oracle SQL", "mysql": "MySQL",
    "numpy": "NumPy", "pandas": "Pandas",
    "spring": "Spring Boot", "spring boot": "Spring Boot", "springboot": "Spring Boot",
    "streamlit": "Streamlit", "ollama": "Ollama", "llama": "LLaMA 3.2", "llama 3.2": "LLaMA 3.2", "qwen": "Qwen",
    "ocr": "Tesseract OCR", "tesseract": "Tesseract OCR",
    "dsa": "Data Structures and Algorithms", "data structures": "Data Structures and Algorithms",
    "oop": "OOP", "oops": "OOP", "dbms": "DBMS", "os": "Operating Systems", "operating systems": "Operating Systems"
  }
};

if (typeof module !== "undefined" && module.exports) module.exports = PROFILE;
else window.PROFILE = PROFILE;
