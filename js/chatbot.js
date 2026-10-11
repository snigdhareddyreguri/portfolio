/*
 * chatbot.js — a small retrieval chatbot grounded entirely in js/data.js.
 *
 * How it decides what to say (in order):
 *   1. Small talk (hi / thanks).
 *   2. A specific project is named           -> that project's details.
 *   3. A technology is named (python, react) -> where it is used.
 *   4. Otherwise score every intent by keyword hits and answer with the best one.
 *   5. Nothing matched                       -> say so, and offer things it can answer.
 *
 * It never invents facts: every answer is assembled from PROFILE, and it never
 * echoes visitor input back into the page, so there is nothing to inject.
 * The engine has no DOM code, so it can be tested with `node test/chatbot.test.js`.
 */
(function (root) {
  const P = typeof module !== "undefined" && module.exports ? require("./data.js") : root.PROFILE;

  /* ---------- helpers ---------- */
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const a = (href, label) => `<a href="${esc(href)}" target="_blank" rel="noopener">${esc(label)}</a>`;
  const norm = (s) =>
    " " +
    s
      .toLowerCase()
      .replace(/[^a-z0-9+#.\s]/g, " ")
      .replace(/\.(?=\s|$)/g, "")
      .replace(/\s+/g, " ")
      .trim() +
    " ";
  const hasPhrase = (q, phrase) => q.includes(" " + phrase + " "); // whole word / phrase
  const hasStem = (q, stem) => q.includes(" " + stem); // word starts with stem
  const list = (items) => "<ul>" + items.map((i) => `<li>${i}</li>`).join("") + "</ul>";

  const CHIPS = {
    main: ["What projects has Snigdha built?", "What technologies does she know?", "Show me the resume", "Coding profiles and GitHub", "How can I contact her?"]
  };

  /* ---------- answers ---------- */
  const answers = {
    about() {
      return {
        html: `<p>${esc(P.summary)}</p><p>Based in ${esc(P.location)}.</p>`,
        chips: ["What projects has Snigdha built?", "Education", "Achievements"]
      };
    },

    education() {
      return {
        html: list(
          P.education.map(
            (e) => `<b>${esc(e.degree)}</b>, ${esc(e.school)}${e.period ? " (" + esc(e.period) + ")" : ""}. ${esc(e.detail)}`
          )
        ),
        chips: ["Skills", "Achievements", "Certifications"]
      };
    },

    skills() {
      return {
        html: list(P.skills.map((g) => `<b>${esc(g.group)}:</b> ${g.items.map(esc).join(", ")}`)),
        chips: ["What projects has Snigdha built?", "Show me the resume"]
      };
    },

    projects() {
      return {
        html:
          `<p>Snigdha has ${P.projects.length} projects listed:</p>` +
          list(
            P.projects.map(
              (p) => `<b>${esc(p.name)}</b> (${esc(p.team)}). ${esc(p.role)} Stack: ${p.stack.map(esc).join(", ")}.`
            )
          ),
        chips: P.projects.map((p) => "Tell me about " + p.name)
      };
    },

    project(p) {
      let html = `<p><b>${esc(p.name)}</b> (${esc(p.team)})</p><p>${esc(p.summary)}</p>`;
      html += `<p><b>Snigdha's part:</b> ${esc(p.role)}<br><b>Stack:</b> ${p.stack.map(esc).join(", ")}</p>`;
      if (p.note) html += `<p>${esc(p.note)}</p>`;
      if (p.repo) html += `<p>${a(p.repo, "View the code on GitHub")}</p>`;
      return { html, chips: ["What other projects are there?", "What technologies does she know?"] };
    },

    tech(labels, projectish) {
      const parts = labels.map((label) => {
        const groups = P.skills.filter((g) => g.items.includes(label) || g.group.includes(label)).map((g) => g.group);
        const used = projectsUsing(label);
        let s = `<b>${esc(label)}</b>: `;
        s += groups.length ? `part of Snigdha's toolkit (${groups.map(esc).join(", ")}). ` : "not listed as a skill. ";
        s += used.length
          ? `Used in ${used.map((p) => "<i>" + esc(p.name) + "</i>").join(" and ")}.`
          : projectish
          ? "None of the listed projects use it yet."
          : "It isn't tied to a listed project yet.";
        return s;
      });
      return { html: list(parts), chips: ["What projects has Snigdha built?", "Show me the resume"] };
    },

    experience() {
      const lead = P.leadership.map((l) => `<b>${esc(l.title)}</b> (${esc(l.when)}). ${esc(l.detail)}`);
      const comm = P.communities.map((c) => `${esc(c.name)} (${esc(c.detail)})`);
      return {
        html:
          `<p>No internships are listed yet. Snigdha's experience so far is team projects, hackathons and community work.</p>` +
          list(lead) +
          `<p><b>Communities:</b> ${comm.join(", ")}.</p>`,
        chips: ["What projects has Snigdha built?", "Achievements"]
      };
    },

    achievements() {
      return {
        html:
          list(P.achievements.map((x) => `<b>${esc(x.title)}</b>${x.when ? " (" + esc(x.when) + ")" : ""}${x.detail ? ". " + esc(x.detail) : ""}`)) +
          `<p>Plus ${P.certifications.length} certifications.</p>`,
        chips: ["Certifications", "Experience"]
      };
    },

    certifications() {
      return {
        html: list(P.certifications.map((c) => `<b>${esc(c.title)}</b>, ${esc(c.issuer)}`)),
        chips: ["Achievements", "Skills"]
      };
    },

    community() {
      return {
        html: list(P.communities.map((c) => `<b>${esc(c.name)}</b>: ${esc(c.detail)}`)),
        chips: ["Experience", "Achievements"]
      };
    },

    interests() {
      return { html: `<p>Snigdha's focus areas:</p>` + list(P.interests.map(esc)), chips: ["What projects has Snigdha built?", "Skills"] };
    },

    profiles(q) {
      const L = P.links;
      const aboutProjects = q && /\b(project|projects|repo|repos|repository|repositories|source|code)\b/.test(q);
      const named = [
        ["GitHub", L.github], ["LinkedIn", L.linkedin], ["LeetCode", L.leetcode],
        ["Codeforces", L.codeforces], ["CodeChef", L.codechef], ["HackerRank", L.hackerrank]
      ];
      const have = named.filter(([, url]) => url);
      if (!have.length) {
        return { html: "<p>The GitHub and coding-profile links haven't been added to this portfolio yet.</p>", chips: ["Show me the resume", "Contact"] };
      }
      const note = aboutProjects && P.projects.every((p) => !p.repo)
        ? "<p>The individual project repositories aren't public yet, but here are Snigdha's profiles:</p>"
        : "";
      return { html: note + list(have.map(([n, u]) => a(u, n))), chips: ["What projects has Snigdha built?", "Contact"] };
    },

    age() {
      return {
        html: P.age
          ? `<p>Snigdha is ${esc(P.age)}.</p>`
          : `<p>Age isn't listed on this portfolio. What I can say is that Snigdha is a second-year B.Tech CSE (AI &amp; ML) student, expected to graduate in 2029.</p>`,
        chips: ["Education", "What projects has Snigdha built?"]
      };
    },

    location() {
      return { html: `<p>Snigdha is based in ${esc(P.location)}.</p>`, chips: ["Education", "Contact"] };
    },

    contact() {
      const L = P.links;
      const rows = [];
      if (L.email) rows.push(`Email: ${a("mailto:" + L.email, L.email)}`);
      if (L.phone) rows.push(`Phone: ${esc(L.phone)}`);
      if (L.linkedin) rows.push(`LinkedIn: ${a(L.linkedin, L.linkedin)}`);
      if (L.github) rows.push(`GitHub: ${a(L.github, L.github)}`);
      return {
        html: rows.length ? list(rows) : "<p>Contact details haven't been added to this portfolio yet.</p>",
        chips: ["Show me the resume", "Coding profiles and GitHub"]
      };
    },

    resume() {
      const links = [a(P.resume.page, "Open the resume page (print or save as PDF)")];
      if (P.resume.pdf) links.push(a(P.resume.pdf, "Download the PDF"));
      return { html: `<p>Here is Snigdha's resume:</p>` + list(links), chips: ["Skills", "What projects has Snigdha built?"] };
    },

    hello() {
      return {
        html: `<p>Hi, I'm the assistant for ${esc(P.first)}'s portfolio. I can answer questions about projects, skills, education, achievements, coding profiles and the resume.</p>`,
        chips: CHIPS.main
      };
    },

    thanks() {
      return { html: "<p>Happy to help. Ask me anything else about Snigdha's work.</p>", chips: CHIPS.main };
    },

    fallback() {
      return {
        html: `<p>I only know what's on this portfolio, and I couldn't match that question. Try one of these:</p>`,
        chips: CHIPS.main
      };
    }
  };

  /* ---------- matching ---------- */
  function projectsUsing(label) {
    return P.projects.filter((p) => p.stack.includes(label) || (label === "MERN" && /MERN/.test(p.summary)));
  }

  const INTENTS = [
    { name: "resume", kw: ["resume", "cv", "curriculum vitae"] },
    { name: "projects", kw: ["project", "built", "build", "made", "apps", "app", "portfolio work", "worked on", "created"] },
    { name: "skills", kw: ["skill", "technolog", "tech stack", "stack", "language", "know", "tools", "framework", "proficien", "expert", "good at"] },
    { name: "education", kw: ["educat", "college", "universit", "degree", "cgpa", "gpa", "grade", "marks", "academ", "vnr", "btech", "b.tech", "school", "12th", "intermediate", "study", "studying", "year"] },
    { name: "experience", kw: ["experien", "leader", "lead", "intern", "hackathon", "sih", "smart india", "team", "role", "work"] },
    { name: "achievements", kw: ["achiev", "award", "won", "win", "prize", "rank", "contest", "competition", "techtriads", "accomplish", "first place"] },
    { name: "certifications", kw: ["certif", "course", "ibm", "nasscom", "futureskills", "skillsbuild", "meity"] },
    { name: "profiles", kw: ["coding profile", "profile", "link", "social"], strong: ["github", "leetcode", "codeforces", "codechef", "hackerrank", "linkedin", "repo", "git"] },
    { name: "contact", kw: ["contact", "email", "mail", "phone", "reach", "hire", "hiring", "connect", "number", "call"] },
    { name: "about", kw: ["who", "introduc", "yourself", "summary", "bio", "background"] },
    { name: "interests", kw: ["interest", "passion", "hobb", "focus", "goal", "enjoy"] },
    { name: "community", kw: ["club", "communit", "myrtc", "csi", "turing", "member", "extracurricular", "extra curricular"] }
  ];

  function scoreIntent(q, intent) {
    let s = intent.kw.reduce((n, k) => (hasStem(q, k) ? n + (k.includes(" ") ? 2 : 1) : n), 0);
    // naming a platform ("github", "leetcode") is a much stronger signal than a generic word like "project"
    (intent.strong || []).forEach((k) => { if (hasPhrase(q, k) || hasPhrase(q, k + "s")) s += 3; });
    return s;
  }

  function findTechs(q) {
    const found = new Set();
    const aliases = Object.keys(P.techAliases).sort((x, y) => y.length - x.length);
    let rest = q;
    for (const al of aliases) {
      if (hasPhrase(rest, al)) {
        found.add(P.techAliases[al]);
        rest = rest.split(" " + al + " ").join(" "); // stop "java" matching inside "javascript" etc.
      }
    }
    return [...found];
  }

  function reply(text) {
    const q = norm(text || "");
    const tokens = q.trim().split(" ").filter(Boolean);
    if (!tokens.length) return answers.fallback();

    // 1. small talk
    if (tokens.length <= 4 && ["hi", "hello", "hey", "hii", "yo", "namaste", "hola"].includes(tokens[0])) return answers.hello();
    if (tokens.length <= 5 && /\b(thanks|thank|thx|great|awesome|cool|nice)\b/.test(q)) return answers.thanks();

    // personal facts
    if (/\b(age|how old|birthday|born|dob|date of birth)\b/.test(q)) return answers.age();
    if (/\b(live|lives|living|city|location|based|hometown|stay)\b/.test(q)) return answers.location();

    // 2. a specific project
    const proj = P.projects.find((p) => p.keywords.some((k) => hasStem(q, k)));
    if (proj) return answers.project(proj);

    // 3. a specific technology
    const techs = findTechs(q);
    const projectish = /\b(project|built|build|made|used|use|using|apps?)\b/.test(q);
    const best = INTENTS.map((i) => ({ name: i.name, s: scoreIntent(q, i) })).sort((x, y) => y.s - x.s)[0];
    if (techs.length && !(best.s >= 2 && !projectish && best.name === "resume")) return answers.tech(techs, projectish);

    // 4. best intent
    if (best.s > 0) return answers[best.name](q);

    // 5. a bare "tell me about her/Snigdha" is a general-intro question
    if (/\babout\b/.test(q)) return answers.about();

    // 6. nothing matched
    return answers.fallback();
  }

  const Bot = { reply, greeting: answers.hello, suggestions: CHIPS.main };
  if (typeof module !== "undefined" && module.exports) module.exports = Bot;
  else root.Bot = Bot;
})(typeof window !== "undefined" ? window : globalThis);
