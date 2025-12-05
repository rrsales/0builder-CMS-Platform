// Left Panel Toggle
function toggleLeftPanel() {
  const sidebar = document.getElementById("leftSidebar");
  const main = document.getElementById("main");
  sidebar.classList.toggle("open");
  main.classList.toggle("has-left-open");
}

// Close on outside click
document.addEventListener("click", (e) => {
  const sidebar = document.getElementById("leftSidebar");
  const handle = document.getElementById("leftPanelHandle");
  if (sidebar.classList.contains("open") && !sidebar.contains(e.target) && !handle.contains(e.target)) {
    toggleLeftPanel();
  }
});

// Sidebar Section Toggle (accordion)
function toggleSidebarSection(which) {
  const body = document.getElementById(which + "Section");
  const chevron = document.getElementById(which + "Chevron");
  if (!body) return;

  const wasClosed = body.classList.contains("closed");

  // Close all sections
  document.querySelectorAll(".sidebar-section-body").forEach(el => el.classList.add("closed"));
  document.querySelectorAll(".sidebar-chevron").forEach(el => el.classList.remove("rotated"));

  // Open this one if it was closed
  if (wasClosed) {
    body.classList.remove("closed");
    if (chevron) chevron.classList.add("rotated");
  }
}

// Open specific section
function openSidebarSection(which) {
  toggleSidebarSection(which);
  if (document.getElementById(which + "Section").classList.contains("closed")) {
    toggleSidebarSection(which);
  }
}
