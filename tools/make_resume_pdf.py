"""Builds assets/Snigdha_Reddy_Reguri_Resume.pdf from js/data.js.
Usage (from the project root):  pip install reportlab && python tools/make_resume_pdf.py
Re-run it whenever you change js/data.js."""
import json, subprocess, os
from xml.sax.saxutils import escape as e
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable, ListFlowable, ListItem

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = json.loads(subprocess.check_output(["node", "-e", "console.log(JSON.stringify(require('./js/data.js')))"], cwd=root))
L = P["links"]
INK, ACC, MUTED = colors.HexColor("#16203a"), colors.HexColor("#c8265f"), colors.HexColor("#566180")

name = ParagraphStyle("n", fontName="Helvetica-Bold", fontSize=20, leading=24, textColor=INK)
small = ParagraphStyle("s", fontName="Helvetica", fontSize=9, leading=12, textColor=MUTED)
h2 = ParagraphStyle("h", fontName="Helvetica-Bold", fontSize=10.5, leading=13, textColor=ACC, spaceBefore=9, spaceAfter=2)
body = ParagraphStyle("b", fontName="Helvetica", fontSize=9.5, leading=12.5, textColor=INK)
bold = ParagraphStyle("bb", parent=body, fontName="Helvetica-Bold")

def head(t):
    return [Paragraph(e(t), h2), HRFlowable(width="100%", thickness=0.8, color=INK, spaceAfter=3)]
def bullets(items):
    return ListFlowable([ListItem(Paragraph(i, body), leftIndent=10) for i in items], bulletType="bullet", start="•", leftIndent=10, bulletFontSize=8)
def row(title, when):
    return Paragraph(f"<b>{e(title)}</b>" + (f" <font color='#566180'>| {e(when)}</font>" if when else ""), body)

s = [Paragraph(e(P["name"]), name)]
contact = [P["location"], L["email"], L["phone"], L["linkedin"].replace("https://www.", ""), L["github"].replace("https://", "")]
s += [Paragraph(" | ".join(e(c) for c in contact if c), small)]

s += head("Education")
for ed in P["education"]:
    s += [row(ed["school"], ed["period"]), Paragraph(f"{e(ed['degree'])}. {e(ed['detail'])}", body), Spacer(1, 3)]

s += head("Skills")
for g in P["skills"]:
    s.append(Paragraph(f"<b>{e(g['group'])}:</b> {e(', '.join(g['items']))}", body))

s += head("Projects")
for p in P["projects"]:
    s += [row(p["name"], p["team"]), Paragraph(e(p["summary"]), body),
          bullets([e(p["role"]), "Tech: " + e(", ".join(p["stack"]))]), Spacer(1, 4)]

s += head("Leadership")
for l in P["leadership"]:
    s += [row(l["title"], l["when"]), Paragraph(e(l["detail"]), body)]

s += head("Achievements and certifications")
s.append(bullets([e(a["title"] + (". " + a["detail"] if a["detail"] else "")) for a in P["achievements"]] +
                 [e(c["title"] + ", " + c["issuer"]) for c in P["certifications"]]))

s += head("Extra-curricular activities")
s.append(bullets([e(f"Member, {c['name']} ({c['detail']})") for c in P["communities"]]))

out = os.path.join(root, P["resume"]["pdf"])
os.makedirs(os.path.dirname(out), exist_ok=True)
SimpleDocTemplate(out, pagesize=A4, leftMargin=16*mm, rightMargin=16*mm, topMargin=14*mm, bottomMargin=14*mm,
                  title=P["name"] + " - Resume", author=P["name"]).build(s)
print("wrote", out)
