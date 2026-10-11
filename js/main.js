/* main.js — renders the page from PROFILE and connects the chat UI to Bot. */
(function () {
  const P = window.PROFILE;
  const $ = (sel) => document.querySelector(sel);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------- sections ---------- */
  $("#about-body").innerHTML =
    P.about.map((t) => `<p>${esc(t)}</p>`).join("") +
    `<h3>Focus areas</h3><ul class="plain">${P.interests.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;

  $("#education-body").innerHTML = P.education
    .map(
      (e) => `<div class="row"><div class="row-head"><h3>${esc(e.degree)}</h3><p class="meta">${esc(e.school)}${
        e.period ? ", " + esc(e.period) : ""
      }</p></div><p>${esc(e.detail)}</p></div>`
    )
    .join("");

  $("#skills-body").innerHTML = P.skills
    .map((g) => `<div class="skill-group"><h3>${esc(g.group)}</h3><p>${g.items.map((i) => `<span class="chip">${esc(i)}</span>`).join("")}</p></div>`)
    .join("");

  $("#projects-body").innerHTML = P.projects
    .map(
      (p) => `<article class="row project">
        <div class="row-head">
          <h3>${esc(p.name)}</h3>
          <p class="meta">${esc(p.team)}</p>
          ${p.repo ? `<p><a href="${esc(p.repo)}" target="_blank" rel="noopener">Source code</a></p>` : ""}
        </div>
        <div>
          <p>${esc(p.summary)}</p>
          <p><b>My part:</b> ${esc(p.role)}</p>
          ${p.note ? `<p class="meta">${esc(p.note)}</p>` : ""}
          <p>${p.stack.map((s) => `<span class="chip">${esc(s)}</span>`).join("")}</p>
        </div>
      </article>`
    )
    .join("");

  const timeline = (items) =>
    items
      .map(
        (x) => `<div class="row"><div class="row-head"><h3>${esc(x.title)}</h3>${x.when ? `<p class="meta">${esc(x.when)}</p>` : ""}</div>${
          x.detail ? `<p>${esc(x.detail)}</p>` : "<p></p>"
        }</div>`
      )
      .join("");

  $("#experience-body").innerHTML =
    timeline(P.leadership) +
    `<div class="row"><div class="row-head"><h3>Communities</h3></div><p>${P.communities
      .map((c) => `<span class="chip" title="${esc(c.detail)}">${esc(c.name)}</span>`)
      .join("")}</p></div>`;

  $("#achievements-body").innerHTML =
    timeline(P.achievements) +
    `<div class="row"><div class="row-head"><h3>Certifications</h3></div><div>${P.certifications
      .map((c) => `<p><b>${esc(c.title)}</b>, ${esc(c.issuer)}</p>`)
      .join("")}</div></div>`;

  const L = P.links;
  const linkRows = [
    ["GitHub", L.github], ["LinkedIn", L.linkedin], ["LeetCode", L.leetcode],
    ["Codeforces", L.codeforces], ["CodeChef", L.codechef], ["HackerRank", L.hackerrank]
  ].filter(([, u]) => u);
  $("#profiles-body").innerHTML = linkRows.length
    ? `<p>${linkRows.map(([n, u]) => `<a class="btn" href="${esc(u)}" target="_blank" rel="noopener">${n}</a>`).join(" ")}</p>`
    : `<p class="meta">Profile links are added in <code>js/data.js</code>.</p>`;

  const contact = [];
  if (L.email) contact.push(`<a href="mailto:${esc(L.email)}">${esc(L.email)}</a>`);
  if (L.phone) contact.push(esc(L.phone));
  contact.push(esc(P.location));
  $("#contact-body").innerHTML = `<p>${contact.join("<br>")}</p>`;

  if (L.github) {
    $("#hero-links").insertAdjacentHTML("beforeend", `<a class="btn" href="${esc(L.github)}" target="_blank" rel="noopener">GitHub</a>`);
  }
  $("#year").textContent = new Date().getFullYear();

  /* ---------- chat ---------- */
  const log = $("#chat-log");
  const chipsBox = $("#chat-chips");
  const form = $("#chat-form");
  const input = $("#chat-input");

  function addMsg(who, html) {
    const el = document.createElement("div");
    el.className = "msg " + who;
    if (who === "user") el.textContent = html; // visitor text is never parsed as HTML
    else el.innerHTML = html;
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    return el;
  }

  function setChips(list) {
    chipsBox.innerHTML = "";
    list.forEach((text) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "suggest";
      b.textContent = text;
      b.addEventListener("click", () => ask(text));
      chipsBox.appendChild(b);
    });
  }

  function ask(text) {
    text = text.trim();
    if (!text) return;
    addMsg("user", text);
    const typing = addMsg("bot typing", "<span></span><span></span><span></span>");
    const out = window.Bot.reply(text);
    setTimeout(() => {
      typing.remove();
      addMsg("bot", out.html);
      setChips(out.chips || window.Bot.suggestions);
    }, 350);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    ask(input.value);
    input.value = "";
    input.focus();
  });

  const hello = window.Bot.greeting();
  addMsg("bot", hello.html);
  setChips(hello.chips);
})();
