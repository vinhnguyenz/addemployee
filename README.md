<p align="center">
  <img src="docs/cover.jpg" alt="FIT People — paper desk, staff cards, pine and clay" width="920">
</p>

<h1 align="center">FIT People</h1>
<p align="center">
  <em>Add an employee. Delete an employee. That is the whole brief — then the UI got ideas.</em>
</p>

<p align="center">
  Internal directory for FIT · vibe-coded in the browser · no backend, no excuses
</p>

<p align="center">
  <a href="https://github.com/vinhnguyenz/addemployee"><img src="https://img.shields.io/badge/repo-vinhnguyenz%2Faddemployee-1f4a3a?style=flat-square" alt="repo"></a>
  <img src="https://img.shields.io/badge/stack-HTML%20·%20CSS%20·%20vanilla%20JS-c45c26?style=flat-square" alt="stack">
  <img src="https://img.shields.io/badge/data-localStorage-6b6458?style=flat-square" alt="storage">
  <img src="https://img.shields.io/badge/vibe-coded-e8c36a?style=flat-square" alt="vibe">
</p>

---

A small HR desk for the Faculty of Information Technology.

Search the roster, open a profile, hire someone new, fix a typo, walk them out. Everything lives in **this tab** — `localStorage` key `fit-people-v1`. Refresh and the people are still there. Clear site data and the seed roster walks back in.

> Paper `#f4efe4`, pine `#1f4a3a`, clay `#c45c26`. Fraunces for the name on the door, Source Sans 3 for the forms.

<p align="center">
  <img src="docs/ui.jpg" alt="Directory UI on a laptop" width="920">
</p>

---

## What you can do

- **Directory** — table of people, 6 per page, search + gender + department filters
- **Hire** — modal form: staff ID, name, email, phone, DOB, gender, dept, title, address, notes
- **Edit** — same form, same validation, unique staff ID
- **Profile** — one person, full card, back to the list
- **Delete** — confirm first. “Keep it” or it’s gone
- **Overview** — counts and a tiny department breakdown, computed from whatever is in the browser

Required on save: staff ID, name, email, DOB, gender, department, job title. Duplicate staff IDs get refused.

---

## Seed roster

Ships with a FIT-shaped sample so the table is never empty on first open:

| Name | Department |
|------|------------|
| Nguyen Van Vinh | Software Engineering |
| Do Quang Duy | Data & AI |
| Nguyen Phi Huan | Cybersecurity |
| Tran Minh Chien | Software Engineering |
| Pham Thi Dung | Human Resources |
| Hoang Van Em | Academic Affairs |
| Vo Van Van | Cybersecurity |

---

## Run it

Four files. No install.

```bash
git clone https://github.com/vinhnguyenz/addemployee.git
cd addemployee
python3 -m http.server 4173
```

Then open [http://127.0.0.1:4173](http://127.0.0.1:4173).

Drop the folder on Vercel / Netlify / GitHub Pages the same way — it is static HTML.

---

## Layout

```
addemployee/
├── index.html      # FIT People shell — list, profile, form, dialogs
├── styles.css      # pine topbar, paper stage, clay buttons
├── app.js          # load / save / filter / paginate / validate
├── database.sql    # MySQL sketch of the same record (not wired yet)
├── docs/
│   ├── cover.jpg
│   └── ui.jpg
└── README.md
```

`database.sql` is the schema if this ever grows a real API. Today the source of truth is the browser.

```sql
CREATE TABLE employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  number VARCHAR(20) NOT NULL UNIQUE,
  name   VARCHAR(80) NOT NULL,
  email  VARCHAR(120) NOT NULL,
  ...
);
```

---

## How the data moves

```
open page
   └─ load()  →  localStorage["fit-people-v1"]
                    └─ missing / junk? write seed, use seed

+ New profile / Edit
   └─ openForm() → validate → unshift or replace → save()

Delete
   └─ askDelete() → confirm → filter id out → save()

Search / gender / dept
   └─ filtered() → slice page → paint #rows + KPIs
```

Reset the demo: DevTools → Application → Local Storage → delete `fit-people-v1` → reload.

---

## Stack, said plainly

| Piece | Choice |
|-------|--------|
| Markup | `index.html` |
| Look | `styles.css` — no framework |
| Brain | `app.js` — no React, no Vue |
| Memory | `localStorage` |
| Type | Source Sans 3 + Fraunces |
| Vibe | coded in one sitting, then sanded |

---

## Next, if the vibe continues

- Wire `database.sql` to a tiny API and stop living in the browser
- Export CSV
- Real avatars
- Soft-delete instead of gone-forever

Until then: add someone. Delete someone. Keep the desk tidy.

---

<p align="center">
  <sub>Nguyen Van Vinh · HANU FIT · vibe coded, 2026</sub>
</p>
