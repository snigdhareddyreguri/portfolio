// Run with: node test/chatbot.test.js
const Bot = require("../js/chatbot.js");
const strip = (h) => h.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const cases = [
  ["What projects has Snigdha worked on?", "Compliance System"],
  ["What technologies does she know?", "Languages"],
  ["What are her coding profiles?", "GitHub"],
  ["Show me her resume", "resume page"],
  ["hi", "assistant for"],
  ["Does she know Python?", "Python"],
  ["Does she know java", "Java"],
  ["Tell me about the student skill exchange", "MERN"],
  ["what projects use streamlit", "Sovereign"],
  ["Did she win anything?", "Techtriads"],
  ["Which certificates does she have?", "IBM SkillsBuild"],
  ["what is her cgpa", "9.83"],
  ["how can I contact her", "snigdhareddy.reguri@gmail.com"],
  ["her leetcode and codechef", "CodeChef"],
  ["tell me about the hackathon", "SIH26117"],
  ["which clubs is she in", "Turing Hut"],
  ["tell me about snigdha", "Second-year"],
  ["give me github links", "GitHub"],
  ["github links of her projects", "aren't public yet"],
  ["what is her age", "isn't listed"],
  ["how old is she", "isn't listed"],
  ["does she know agentic ai", "Workbench"],
  ["where does she live", "Hyderabad"],
  ["asdfgh qwerty", "couldn't match"],
  ["<img src=x onerror=alert(1)>", "couldn't match"]
];

let fail = 0;
for (const [q, expect] of cases) {
  const out = strip(Bot.reply(q).html);
  const ok = out.includes(expect);
  if (!ok) fail++;
  console.log((ok ? "PASS" : "FAIL") + "  " + q + (ok ? "" : "\n      got: " + out.slice(0, 160)));
}
console.log(fail ? `\n${fail} failed` : "\nAll passed");
process.exit(fail ? 1 : 0);
