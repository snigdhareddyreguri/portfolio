# Snigdha Reddy Reguri: Portfolio + AI Chatbot

A personal portfolio site with a built-in chatbot that answers questions about me
(projects, skills, education, achievements, coding profiles, resume, contact).

Plain HTML, CSS and JavaScript. No build step, no API keys, no backend.

## Run it

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

Run the chatbot tests (Node 16+):

```bash
node test/chatbot.test.js
```

## How it works

```
js/data.js      single source of truth for everything about me
js/chatbot.js   chatbot engine (no DOM code, so it is testable in Node)
js/main.js      renders the page sections from data.js and runs the chat UI
resume.html     resume generated from data.js, printable to PDF
test/           chatbot tests
tools/          script that builds the resume PDF from data.js
```

**Why one data file?** The website sections, the resume page and the chatbot all
read `js/data.js`, so they can never disagree with each other. Update it once.

**Chatbot design.** It is a retrieval chatbot grounded only in `data.js`:

1. Small talk (hello / thanks).
2. If a specific project is named, return that project's details.
3. If a technology is named (`python`, `react`, `ocr`...), say whether it is a skill and which projects use it.
4. Otherwise score each intent (projects, skills, education, resume...) by keyword hits and answer with the best match.
5. If nothing matches, say so and suggest questions it can answer.

It never invents facts, and visitor text is never inserted as HTML, so there is no injection risk.
Trade-off: it understands the topics above, not free-form conversation. That keeps it fast, free,
private and predictable. A natural next step is to send the same `data.js` as context to an LLM API
(through a small server, so the key stays secret) and keep this engine as the offline fallback.

## Before you submit (fill these in)

- `js/data.js` -> `links`: GitHub, LinkedIn, LeetCode/Codeforces/CodeChef/HackerRank, email, phone
- `js/data.js` -> each project's `repo` link
- Resume PDF: `assets/Snigdha_Reddy_Reguri_Resume.pdf` is generated from `data.js`.
  After editing `data.js`, regenerate it with `pip install reportlab && python tools/make_resume_pdf.py`
- Optional: `age` in `data.js` (left empty = the chatbot says it isn't listed)
- Check the project summaries match what you built, and edit `interests` to your liking

## Deploy (optional)

GitHub Pages: push the repo, then Settings -> Pages -> deploy from the `main` branch root.
