/**
 * dashboard.js
 * ------------
 * Powers the Stock Lens dashboard: auth guard, welcome chip, live search
 * suggestions, the company detail modal, the "not found" state, and the
 * PDF report download flow.
 */

document.addEventListener("DOMContentLoaded", () => {
  const session = requireAuth();
  if (!session) return; // requireAuth already redirected

  renderTicker("tickerTape");
  initWelcomeChip(session);
  initSearch();
  initLogout();
});

/* ---------- navbar / welcome chip ---------- */

function initWelcomeChip(session) {
  const nameEl = document.getElementById("welcomeName");
  const avatarEl = document.getElementById("profileAvatar");
  if (nameEl) nameEl.textContent = session.fullName;
  if (avatarEl) avatarEl.textContent = getInitials(session.fullName);
}

function getInitials(fullName) {
  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() || "")
    .join("");
}

function initLogout() {
  const btn = document.getElementById("logoutBtn");
  if (btn) btn.addEventListener("click", logoutUser);
}

/* ---------- search ---------- */

function initSearch() {
  const input = document.getElementById("companySearchInput");
  const suggestBox = document.getElementById("searchSuggestions");
  const loadingEl = document.getElementById("searchLoading");
  if (!input || !suggestBox) return;

  let debounceTimer = null;

  input.addEventListener("input", () => {
    const query = input.value;
    clearTimeout(debounceTimer);

    if (!query.trim()) {
      suggestBox.classList.remove("show");
      loadingEl.classList.remove("show");
      return;
    }

    loadingEl.classList.add("show");
    debounceTimer = setTimeout(() => {
      loadingEl.classList.remove("show");
      renderSuggestions(searchCompanies(query));
    }, 220);
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      runSearch(input.value);
    }
  });

  document.addEventListener("click", (e) => {
    if (!suggestBox.contains(e.target) && e.target !== input) {
      suggestBox.classList.remove("show");
    }
  });

  function renderSuggestions(results) {
    if (!results.length) {
      suggestBox.classList.remove("show");
      return;
    }
    suggestBox.innerHTML = results
      .map(
        (c) => `
        <div class="suggest-item" data-ticker="${c.ticker}">
          <div class="mini-avatar" style="background:${c.logoColor}">${c.logoInitials.slice(0, 2)}</div>
          <div>
            <div class="s-name">${c.name}</div>
            <div class="s-ticker">${c.ticker} · ${c.sector}</div>
          </div>
        </div>`
      )
      .join("");
    suggestBox.classList.add("show");

    suggestBox.querySelectorAll(".suggest-item").forEach((item) => {
      item.addEventListener("click", () => {
        const ticker = item.getAttribute("data-ticker");
        input.value = ticker;
        suggestBox.classList.remove("show");
        runSearch(ticker);
      });
    });
  }
}

function runSearch(query) {
  const suggestBox = document.getElementById("searchSuggestions");
  if (suggestBox) suggestBox.classList.remove("show");

  const company = findCompany(query);
  if (company) {
    openCompanyModal(company);
  } else {
    openNotFoundModal(query);
  }
}

/* ---------- company modal ---------- */

function openCompanyModal(company) {
  document.getElementById("modalAvatar").textContent = company.logoInitials.slice(0, 2);
  document.getElementById("modalAvatar").style.background = company.logoColor;
  document.getElementById("modalCompanyName").textContent = company.name;
  document.getElementById("modalCompanyTicker").textContent = `${company.ticker} · ${company.sector}`;
  renderSnapshotTable(company.snapshot);

  const downloadBtn = document.getElementById("downloadReportBtn");
  const viewBtn = document.getElementById("viewReportBtn");
  downloadBtn.setAttribute("data-pdf", company.pdf);
  downloadBtn.setAttribute("data-name", company.name);
  if (viewBtn) viewBtn.setAttribute("data-pdf", company.pdf);

  document.getElementById("companyFoundBody").classList.remove("d-none");
  document.getElementById("companyNotFoundBody").classList.add("d-none");
  document.getElementById("modalFooterFound").classList.remove("d-none");
  document.getElementById("modalFooterNotFound").classList.add("d-none");

  showModal();
}

function openNotFoundModal(query) {
  document.getElementById("notFoundQuery").textContent = query;
  document.getElementById("companyFoundBody").classList.add("d-none");
  document.getElementById("companyNotFoundBody").classList.remove("d-none");
  document.getElementById("modalFooterFound").classList.add("d-none");
  document.getElementById("modalFooterNotFound").classList.remove("d-none");

  showModal();
}

function showModal() {
  const modalEl = document.getElementById("companyModal");
  const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
  modal.show();
}

function renderSnapshotTable(snapshot = []) {
  const tbody = document.querySelector("#snapshotTable tbody");
  if (!tbody) return;
  tbody.innerHTML = snapshot
    .map(
      (row) => `
        <tr>
          <td>${row.metric}</td>
          <td>${row.value}</td>
          <td>${row.insight}</td>
        </tr>`
    )
    .join("");
}

/* ---------- download ---------- */

document.addEventListener("click", (e) => {
  const downloadBtn = e.target.closest("#downloadReportBtn");
  const viewBtn = e.target.closest("#viewReportBtn");

  if (downloadBtn) {
    const pdfPath = downloadBtn.getAttribute("data-pdf");
    const companyName = downloadBtn.getAttribute("data-name");
    if (!pdfPath) return;

    const link = document.createElement("a");
    link.href = pdfPath;
    link.download = pdfPath.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Downloading research report for ${companyName}…`, "success");
    return;
  }

  if (viewBtn) {
    const pdfPath = viewBtn.getAttribute("data-pdf");
    if (!pdfPath) return;
    window.open(pdfPath, "_blank", "noopener,noreferrer");
    return;
  }
});

document.addEventListener("click", (e) => {
  if (e.target.closest("#searchAgainBtn")) {
    const modalEl = document.getElementById("companyModal");
    bootstrap.Modal.getOrCreateInstance(modalEl).hide();
    const input = document.getElementById("companySearchInput");
    if (input) {
      input.value = "";
      input.focus();
    }
  }
});

/* ---------- toast ---------- */

function showToast(message, type = "success") {
  const toast = document.getElementById("lensToast");
  if (!toast) return;
  const icon = type === "success" ? "bi-check-circle-fill" : "bi-exclamation-circle-fill";
  toast.innerHTML = `<i class="bi ${icon}"></i><span>${message}</span>`;
  toast.className = `lens-toast ${type} show`;
  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(() => toast.classList.remove("show"), 3200);
}
