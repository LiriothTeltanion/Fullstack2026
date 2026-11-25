const byId = id => document.getElementById(id);
let companies = [];
let meetings = [];
function message(text, error = false) {
  byId("message").textContent = text;
  byId("message").classList.toggle("error", error);
}
async function api(path, options = {}) {
  const response = await fetch("/api" + path, {
    ...options,
    headers: { "Content-Type": "application/json" },
  });
  if (response.status === 204) return null;
  const result = await response.json();
  if (!response.ok) throw new Error(result.error ?? "The request failed.");
  return result;
}
function showDashboard(signedIn) {
  byId("auth").hidden = signedIn;
  byId("dashboard").hidden = !signedIn;
  byId("logout").hidden = !signedIn;
}
function cell(row, text) {
  const td = document.createElement("td");
  td.textContent = text;
  row.append(td);
  return td;
}
function actionButton(parent, label, run) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.addEventListener("click", () =>
    Promise.resolve()
      .then(run)
      .catch(error => message(error.message, true))
  );
  parent.append(button);
}
function fillForm(form, record) {
  for (const [key, value] of Object.entries(record))
    if (form.elements.namedItem(key)) form.elements.namedItem(key).value = value;
  form.scrollIntoView({ behavior: "auto", block: "start" });
}
function renderCompanies() {
  const body = byId("companies");
  body.replaceChildren();
  const select = byId("meeting-form").elements.namedItem("company_id");
  select.replaceChildren(new Option("Choose a company", ""));
  for (const company of companies) {
    select.append(new Option(company.name, company.id));
    const row = document.createElement("tr");
    cell(row, company.name);
    cell(row, [company.email, company.phone, company.address].filter(Boolean).join(" · "));
    const actions = cell(row, "");
    actions.className = "actions";
    actionButton(actions, "Edit", () => fillForm(byId("company-form"), company));
    actionButton(actions, "Delete", async () => {
      if (!confirm("Delete this company and its associated meetings?")) return;
      await api("/companies/" + company.id + "?confirm=yes", { method: "DELETE" });
      await refresh();
      message("Company deleted.");
    });
    body.append(row);
  }
  if (!companies.length) {
    const row = document.createElement("tr");
    const td = cell(row, "No companies yet. Add your first practice company.");
    td.colSpan = 3;
    body.append(row);
  }
}
function renderMeetings() {
  const body = byId("meeting-rows");
  body.replaceChildren();
  for (const meeting of meetings) {
    const row = document.createElement("tr");
    cell(row, meeting.date);
    cell(row, meeting.company_name + " · " + meeting.location);
    cell(row, meeting.summary);
    const actions = cell(row, "");
    actions.className = "actions";
    actionButton(actions, "Edit", () => fillForm(byId("meeting-form"), meeting));
    actionButton(actions, "Delete", async () => {
      if (!confirm("Delete this meeting?")) return;
      await api("/meetings/" + meeting.id, { method: "DELETE" });
      await refresh();
      message("Meeting deleted.");
    });
    body.append(row);
  }
  if (!meetings.length) {
    const row = document.createElement("tr");
    const td = cell(row, "No meetings recorded yet.");
    td.colSpan = 4;
    body.append(row);
  }
}
async function renderStatistics() {
  const data = await api("/statistics?month=" + encodeURIComponent(byId("month").value));
  byId("month-total").textContent = data.total + " meetings in " + data.month;
  const chart = byId("chart");
  chart.replaceChildren();
  for (const day of data.days) {
    const row = document.createElement("div");
    row.className = "day-bar";
    const label = document.createElement("strong");
    label.textContent = day.date;
    const meter = document.createElement("meter");
    meter.min = 0;
    meter.max = data.total;
    meter.value = day.count;
    meter.setAttribute("aria-label", day.date + ": " + day.count + " meetings");
    const detail = document.createElement("small");
    detail.textContent = day.count + " meetings · " + day.percentage.toFixed(1) + "% of the month";
    row.append(label, meter, detail);
    chart.append(row);
  }
  if (!data.days.length) chart.textContent = "No meetings in this month.";
}
async function refresh() {
  message("Loading your workspace…");
  [companies, meetings] = await Promise.all([api("/companies"), api("/meetings")]);
  renderCompanies();
  renderMeetings();
  await renderStatistics();
  message("");
}
byId("month").value = new Date().toISOString().slice(0, 7);
byId("month").addEventListener("change", () =>
  renderStatistics().catch(error => message(error.message, true))
);
for (const button of document.querySelectorAll("[data-view]")) {
  button.addEventListener("click", () => {
    for (const other of document.querySelectorAll("[data-view]"))
      other.setAttribute("aria-pressed", String(other === button));
    for (const section of document.querySelectorAll(".view"))
      section.hidden = section.id !== button.dataset.view;
  });
}
byId("auth-form").addEventListener("submit", async event => {
  event.preventDefault();
  const button = event.submitter;
  const form = event.currentTarget;
  button.disabled = true;
  try {
    const fields = Object.fromEntries(new FormData(form));
    await api("/auth/" + button.value, { method: "POST", body: JSON.stringify(fields) });
    form.reset();
    showDashboard(true);
    await refresh();
    message("Welcome to your workspace.");
  } catch (error) {
    message(error.message, true);
  } finally {
    button.disabled = false;
  }
});
for (const [id, route] of [
  ["company-form", "/companies"],
  ["meeting-form", "/meetings"],
]) {
  byId(id).addEventListener("submit", async event => {
    event.preventDefault();
    const form = event.currentTarget;
    const button = event.submitter;
    button.disabled = true;
    try {
      const fields = Object.fromEntries(new FormData(form));
      const recordId = fields.id;
      delete fields.id;
      await api(route + (recordId ? "/" + recordId : ""), {
        method: recordId ? "PUT" : "POST",
        body: JSON.stringify(fields),
      });
      form.reset();
      form.elements.namedItem("id").value = "";
      await refresh();
      message("Saved.");
    } catch (error) {
      message(error.message, true);
    } finally {
      button.disabled = false;
    }
  });
  byId(id).addEventListener("reset", () => {
    byId(id).elements.namedItem("id").value = "";
  });
}
byId("logout").addEventListener("click", async () => {
  try {
    await api("/auth/logout", { method: "POST" });
    showDashboard(false);
    message("Signed out.");
  } catch (error) {
    message(error.message, true);
  }
});
api("/auth/me")
  .then(() => {
    showDashboard(true);
    return refresh();
  })
  .catch(() => showDashboard(false));
