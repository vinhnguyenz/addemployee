const KEY = "fit-people-v1";
const PAGE_SIZE = 6;
const COLORS = ["#1f4a3a", "#c45c26", "#3d5a80", "#7a4e2d", "#2f6f4e", "#8a3d4a"];

const seed = [
  { id: "1", number: "2401240109", name: "Nguyen Van Vinh", email: "2401240109@ms.hanu.edu.vn", phone: "0849009629", dob: "2006-01-14", gender: "Male", dept: "Software Engineering", title: "HR Admin", address: "Nam Dinh", note: "Account owner" },
  { id: "2", number: "2401240100", name: "Do Quang Duy", email: "2401240100@ms.hanu.edu.vn", phone: "0912345678", dob: "2006-09-19", gender: "Male", dept: "Data & AI", title: "Data Engineer", address: "Quang Ninh", note: "" },
  { id: "3", number: "2401240101", name: "Nguyen Phi Huan", email: "2401240101@ms.hanu.edu.vn", phone: "0923456789", dob: "2006-03-12", gender: "Male", dept: "Cybersecurity", title: "Security Analyst", address: "Ha Noi", note: "" },
  { id: "4", number: "2301230100", name: "Tran Minh Chien", email: "2301230100@ms.hanu.edu.vn", phone: "08123456789", dob: "2005-11-02", gender: "Male", dept: "Software Engineering", title: "Frontend Dev", address: "Ca Mau", note: "" },
  { id: "5", number: "2301230101", name: "Pham Thi Dung", email: "2301230101@ms.hanu.edu.vn", phone: "0934567890", dob: "2005-07-21", gender: "Female", dept: "Human Resources", title: "People Partner", address: "Thanh Hoa", note: "" },
  { id: "6", number: "2201220100", name: "Hoang Van Em", email: "2201220100@ms.hanu.edu.vn", phone: "0945678901", dob: "2004-01-30", gender: "Female", dept: "Academic Affairs", title: "Coordinator", address: "Ha Tinh", note: "" },
  { id: "8", number: "2101210100", name: "Vo Van Van", email: "2101210100@ms.hanu.edu.vn", phone: "0756789012", dob: "2003-12-15", gender: "Female", dept: "Cybersecurity", title: "SOC Analyst", address: "TP HCM", note: "" }
];

const state = { page: 1, pendingDelete: null, editingId: null };

function load() {
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    localStorage.setItem(KEY, JSON.stringify(seed));
    return seed.map((x) => ({ ...x }));
  }
  try { return JSON.parse(raw); } catch { return seed.map((x) => ({ ...x })); }
}
function save(list) { localStorage.setItem(KEY, JSON.stringify(list)); }
function initials(name) {
  return name.split(" ").filter(Boolean).slice(-2).map((w) => w[0]).join("").toUpperCase();
}
function colorOf(id) {
  let n = 0;
  for (const ch of String(id)) n += ch.charCodeAt(0);
  return COLORS[n % COLORS.length];
}
function fmtDate(iso) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[Number(m) - 1]} ${Number(d)}, ${y}`;
}
function genderLabel(g) {
  return { Male: "Male", Female: "Female", Other: "Other" }[g] || g;
}

function filtered() {
  const q = document.getElementById("q").value.trim().toLowerCase();
  const g = document.getElementById("filter-gender").value;
  const d = document.getElementById("filter-dept").value;
  return load().filter((e) => {
    const hay = `${e.number} ${e.name} ${e.email} ${e.dept}`.toLowerCase();
    return (!q || hay.includes(q)) && (!g || e.gender === g) && (!d || e.dept === d);
  });
}

function overlayOf(name) {
  if (name === "form") return document.getElementById("overlay-form");
  if (name === "stats") return document.getElementById("overlay-stats");
  if (name === "del") return document.getElementById("overlay");
  return null;
}

function openModal(name) {
  const el = overlayOf(name);
  if (!el) return;
  el.hidden = false;
  document.body.classList.add("modal-open");
  if (name === "stats") {
    renderStats();
    setNav("stats");
  }
  if (name === "form") setNav("add");
}

function closeModal(name) {
  const el = overlayOf(name);
  if (el) el.hidden = true;
  const anyOpen = ["overlay-form", "overlay-stats", "overlay"].some(
    (id) => !document.getElementById(id).hidden
  );
  if (!anyOpen) document.body.classList.remove("modal-open");
  if (name === "form" || name === "stats") setNav("list");
}

function closeAllModals() {
  ["form", "stats", "del"].forEach(closeModal);
}

function setNav(name) {
  document.querySelectorAll(".nav a").forEach((a) => {
    a.classList.toggle("is-active", a.dataset.nav === name);
  });
}

function show(name) {
  closeAllModals();
  document.querySelectorAll(".view").forEach((v) => v.classList.remove("is-on"));
  if (name === "form") {
    document.getElementById("view-list").classList.add("is-on");
    openForm(null);
    return;
  }
  if (name === "stats") {
    document.getElementById("view-list").classList.add("is-on");
    openModal("stats");
    return;
  }
  document.getElementById(`view-${name}`).classList.add("is-on");
  setNav(name === "profile" ? "list" : name);
  if (name === "list") renderList();
}

function renderKpis(targetId, list) {
  const male = list.filter((e) => e.gender === "Male").length;
  const female = list.filter((e) => e.gender === "Female").length;
  const depts = new Set(list.map((e) => e.dept)).size;
  document.getElementById(targetId).innerHTML = `
    <div class="kpi"><span>Total profiles</span><b>${list.length}</b></div>
    <div class="kpi"><span>Male</span><b>${male}</b></div>
    <div class="kpi"><span>Female</span><b>${female}</b></div>
    <div class="kpi"><span>Departments</span><b>${depts}</b></div>`;
}

function renderList() {
  const all = load();
  renderKpis("kpis", all);
  const deptSel = document.getElementById("filter-dept");
  const current = deptSel.value;
  const depts = [...new Set(all.map((e) => e.dept))].sort();
  deptSel.innerHTML = `<option value="">All departments</option>` + depts.map((d) => `<option>${d}</option>`).join("");
  deptSel.value = current;

  const rows = filtered();
  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  if (state.page > pages) state.page = pages;
  const slice = rows.slice((state.page - 1) * PAGE_SIZE, state.page * PAGE_SIZE);

  document.getElementById("rows").innerHTML = slice.map((e) => `
    <tr>
      <td data-label="Employee">
        <div class="person">
          <div class="dot" style="background:${colorOf(e.id)}">${initials(e.name)}</div>
          <div>${e.name}<small>${e.email}</small></div>
        </div>
      </td>
      <td data-label="Staff ID">${e.number}</td>
      <td data-label="Department"><span class="chip">${e.dept}</span></td>
      <td data-label="Date of birth">${fmtDate(e.dob)}</td>
      <td data-label="Gender">${genderLabel(e.gender)}</td>
      <td data-label="">
        <div class="acts">
          <button class="btn tiny" data-act="view" data-id="${e.id}">View</button>
          <button class="btn tiny" data-act="edit" data-id="${e.id}">Edit</button>
          <button class="btn tiny" data-act="del" data-id="${e.id}">Delete</button>
        </div>
      </td>
    </tr>`).join("");

  document.getElementById("empty").hidden = rows.length > 0;
  const pager = document.getElementById("pager");
  pager.innerHTML = "";
  for (let i = 1; i <= pages; i++) {
    const b = document.createElement("button");
    b.textContent = i;
    b.className = i === state.page ? "is-on" : "";
    b.onclick = () => { state.page = i; renderList(); };
    pager.appendChild(b);
  }
}

function openForm(emp) {
  state.editingId = emp ? emp.id : null;
  document.getElementById("form-eyebrow").textContent = emp ? "Update" : "Onboarding";
  document.getElementById("form-title").textContent = emp ? "Edit profile" : "Add a new employee";
  document.getElementById("form-submit").textContent = emp ? "Update" : "Save profile";
  document.getElementById("form-err").hidden = true;
  const map = {
    "f-id": emp?.id || "",
    "f-number": emp?.number || "",
    "f-name": emp?.name || "",
    "f-email": emp?.email || "",
    "f-phone": emp?.phone || "",
    "f-dob": emp?.dob || "",
    "f-gender": emp?.gender || "",
    "f-dept": emp?.dept || "",
    "f-title": emp?.title || "",
    "f-address": emp?.address || "",
    "f-note": emp?.note || ""
  };
  Object.entries(map).forEach(([id, val]) => { document.getElementById(id).value = val; });
  openModal("form");
}

function renderProfile(id) {
  const emp = load().find((e) => e.id === id);
  if (!emp) { show("list"); return; }
  closeAllModals();
  document.getElementById("profile-box").innerHTML = `
    <div class="profile">
      <aside class="side-card">
        <div class="big-av" style="background:${colorOf(emp.id)}">${initials(emp.name)}</div>
        <h2 style="margin:0 0 4px">${emp.name}</h2>
        <p style="margin:0;color:var(--muted)">${emp.title}</p>
        <p class="chip" style="margin-top:10px">${emp.dept}</p>
        <div class="profile-acts">
          <button class="btn tiny" data-act="edit" data-id="${emp.id}">Edit profile</button>
          <button class="btn tiny" data-act="del" data-id="${emp.id}">Delete</button>
        </div>
      </aside>
      <div class="main-card">
        <p class="eyebrow">Employee profile</p>
        <h1 style="font-size:28px">Profile details</h1>
        <div class="meta">
          <div><small>Staff ID</small><b>${emp.number}</b></div>
          <div><small>Gender</small><b>${genderLabel(emp.gender)}</b></div>
          <div><small>Date of birth</small><b>${fmtDate(emp.dob)}</b></div>
          <div><small>Email</small><b>${emp.email}</b></div>
          <div><small>Phone</small><b>${emp.phone || "—"}</b></div>
          <div><small>Address</small><b>${emp.address || "—"}</b></div>
        </div>
        <p style="margin:18px 0 6px;color:var(--muted)">Internal notes</p>
        <p style="margin:0">${emp.note || "No notes yet."}</p>
      </div>
    </div>`;
  document.querySelectorAll(".view").forEach((v) => v.classList.remove("is-on"));
  document.getElementById("view-profile").classList.add("is-on");
  setNav("list");
}

function renderStats() {
  const list = load();
  renderKpis("stats-kpis", list);
  const counts = {};
  list.forEach((e) => { counts[e.dept] = (counts[e.dept] || 0) + 1; });
  const max = Math.max(1, ...Object.values(counts));
  document.getElementById("dept-list").innerHTML = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([dept, n]) => `
      <div class="dept-row">
        <div><b>${dept}</b><div style="color:var(--muted);font-size:13px">${n} ${n === 1 ? "person" : "people"}</div></div>
        <div class="bar"><i style="width:${Math.round((n / max) * 100)}%"></i></div>
      </div>`).join("");
}

function askDelete(id) {
  const emp = load().find((e) => e.id === id);
  if (!emp) return;
  state.pendingDelete = id;
  document.getElementById("del-text").textContent = `Delete ${emp.name} (${emp.number})? This cannot be undone.`;
  openModal("del");
}

document.getElementById("del-cancel").onclick = () => {
  state.pendingDelete = null;
  closeModal("del");
};
document.getElementById("del-ok").onclick = () => {
  if (!state.pendingDelete) return;
  save(load().filter((e) => e.id !== state.pendingDelete));
  state.pendingDelete = null;
  closeModal("del");
  show("list");
};

document.getElementById("emp-form").onsubmit = (ev) => {
  ev.preventDefault();
  const list = load();
  const rec = {
    id: document.getElementById("f-id").value || String(Date.now()),
    number: document.getElementById("f-number").value.trim(),
    name: document.getElementById("f-name").value.trim(),
    email: document.getElementById("f-email").value.trim(),
    phone: document.getElementById("f-phone").value.trim(),
    dob: document.getElementById("f-dob").value,
    gender: document.getElementById("f-gender").value,
    dept: document.getElementById("f-dept").value,
    title: document.getElementById("f-title").value.trim(),
    address: document.getElementById("f-address").value.trim(),
    note: document.getElementById("f-note").value.trim()
  };
  const err = document.getElementById("form-err");
  if (!rec.number || !rec.name || !rec.email || !rec.dob || !rec.gender || !rec.dept || !rec.title) {
    err.textContent = "Please fill in all required fields.";
    err.hidden = false;
    return;
  }
  if (list.some((e) => e.number === rec.number && e.id !== rec.id)) {
    err.textContent = "That staff ID already exists.";
    err.hidden = false;
    return;
  }
  const idx = list.findIndex((e) => e.id === rec.id);
  if (idx >= 0) list[idx] = rec; else list.unshift(rec);
  save(list);
  closeModal("form");
  renderProfile(rec.id);
};

document.getElementById("btn-goto-add").onclick = () => openForm(null);
document.getElementById("q").oninput = () => { state.page = 1; renderList(); };
document.getElementById("filter-gender").onchange = () => { state.page = 1; renderList(); };
document.getElementById("filter-dept").onchange = () => { state.page = 1; renderList(); };

document.body.addEventListener("click", (e) => {
  const closer = e.target.closest("[data-close]");
  if (closer) {
    closeModal(closer.dataset.close);
    return;
  }

  if (e.target.classList.contains("overlay") && !e.target.hidden) {
    if (e.target.id === "overlay-form") closeModal("form");
    if (e.target.id === "overlay-stats") closeModal("stats");
    if (e.target.id === "overlay") {
      state.pendingDelete = null;
      closeModal("del");
    }
    return;
  }

  const nav = e.target.closest("[data-nav]");
  if (nav) {
    e.preventDefault();
    if (nav.dataset.nav === "add") openForm(null);
    else show(nav.dataset.nav);
    return;
  }
  const btn = e.target.closest("[data-act]");
  if (!btn) return;
  const emp = load().find((x) => x.id === btn.dataset.id);
  if (btn.dataset.act === "view") renderProfile(btn.dataset.id);
  if (btn.dataset.act === "edit" && emp) openForm(emp);
  if (btn.dataset.act === "del") askDelete(btn.dataset.id);
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (!document.getElementById("overlay").hidden) {
    state.pendingDelete = null;
    closeModal("del");
    return;
  }
  if (!document.getElementById("overlay-form").hidden) closeModal("form");
  if (!document.getElementById("overlay-stats").hidden) closeModal("stats");
});

renderList();
