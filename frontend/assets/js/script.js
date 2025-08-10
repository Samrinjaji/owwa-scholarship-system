let barChartInstance;
let genderChart;

const allScholars = [
  {
    id: 1,
    batch: 2023,
    name: "Juan Dela Cruz",
    address: "Zamboanga City",
    program: "EDSP1",
    birthDate: "April 15, 2001",
    contact: "00000000000",
    sex: "Male",
    status: "Done",
    bankDetails: "LNB - 123456789",
    recentDate: "2025-08-07"
  },
  {
    id: 2,
    batch: 2023,
    name: "Jaji Samrin S",
    address: "Zamboanga City",
    program: "EDSP1",
    birthDate: "April 15, 2001",
    contact: "00000000000",
    sex: "Male",
    status: "Done",
    bankDetails: "LNB - 123456789",
    recentDate: "2025-08-05"
  },
  {
    id: 3,
    batch: 2023,
    name: "Lorenzo Elizabeth",
    address: "Zamboanga City",
    program: "ODSP1",
    birthDate: "April 15, 2001",
    contact: "00000000000",
    sex: "Female",
    status: "Done",
    bankDetails: "LNB - 123456789",
    recentDate: "2025-08-05"
  },
  {
    id: 4,
    batch: 2025,
    name: "Pedro Jenrick",
    address: "Zamboanga City",
    program: "ELAP ELEMENTARY",
    birthDate: "April 15, 2001",
    contact: "00000000000",
    sex: "Male",
    status: "Done",
    bankDetails: "LNB - 123456789",
    recentDate: "2025-08-05"
  },
  {
    id: 5,
    batch: 2025,
    name: "Pedro Jenrick",
    address: "Zamboanga City",
    program: "ELAP COLLEGE",
    birthDate: "April 15, 2001",
    contact: "00000000000",
    sex: "Male",
    status: "Done",
    bankDetails: "LNB - 123456789",
    recentDate: "2025-08-05"
  }
];


const COLORS = {
  EDSP: '#1E3A8A',
  ODSP: '#DC2626',
  ELAP: '#0F766E',
  MALE: '#1E3A8A',
  FEMALE: '#DC2626'
};

const yearlyData = {
  2023: {
    EDSP: Array(12).fill(0),
    ODSP: Array(12).fill(0),
    ELAP: Array(12).fill(0)
  },
  2024: {
    EDSP: Array(12).fill(0),
    ODSP: Array(12).fill(0),
    ELAP: Array(12).fill(0)
  },
  2025: {
    EDSP: [10, 11, 9, 14, 12, 13, 9, 8, 10, 12, 11, 13],
    ODSP: [6, 7, 8, 9, 7, 6.5, 7, 8, 9, 10, 8, 9],
    ELAP: [4, 5, 3.5, 4.5, 4, 3, 4, 3.5, 4, 3.8, 4.2, 5]
  }
};

/* Sample gender data
const programGenderData = {
  EDSP: { male: 0, female: 0 },
  ODSP: { male: 0, female: 0 },
  ELAP: { male: 0, female: 0 }
};
*/

// Recent scholars data (empty or add sample entries for testing)
const recentScholars = [
  // Example entries:
  // { name: "Juan Dela Cruz", program: "EDSP", date: "July 19, 2025" },
  // { name: "Maria Santos", program: "ODSP", date: "July 18, 2025" },
];


function createOrUpdateBarChart(year = '2025') {
  const ctx = document.getElementById('barChart');
  if (!ctx) return;

  const data = yearlyData[year] || {
    EDSP: Array(12).fill(0),
    ODSP: Array(12).fill(0),
    ELAP: Array(12).fill(0)
  };

  const noDataPluginForBar = {
    id: 'noDataBar',
    afterDraw(chart) {
      const { ctx, chartArea: { left, top, width, height } } = chart;
      const allData = chart.data.datasets.flatMap(ds => ds.data);
      const allZero = allData.every(value => value === 0 || value === null || value === undefined);

      if (allZero) {
        ctx.save();
        ctx.font = 'bold 16px sans-serif';
        ctx.fillStyle = '#999';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('No Data', left + width / 2, top + height / 2);
        ctx.restore();
      }
    }
  };

  if (barChartInstance) {
    barChartInstance.data.datasets[0].data = data.EDSP;
    barChartInstance.data.datasets[1].data = data.ODSP;
    barChartInstance.data.datasets[2].data = data.ELAP;
    barChartInstance.update();
    return;
  }

  barChartInstance = new Chart(ctx.getContext('2d'), {
    type: 'bar',
    data: {
      labels: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ],
      datasets: [
        {
          label: 'EDSP',
          data: data.EDSP,
          backgroundColor: COLORS.EDSP,
          borderRadius: 6
        },
        {
          label: 'ODSP',
          data: data.ODSP,
          backgroundColor: COLORS.ODSP,
          borderRadius: 6
        },
        {
          label: 'ELAP',
          data: data.ELAP,
          backgroundColor: COLORS.ELAP,
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            title: (tooltipItems) => `Month: ${tooltipItems[0].label}`,
            label: (tooltipItem) => {
              const amount = tooltipItem.raw.toLocaleString('en-PH', {
                style: 'currency',
                currency: 'PHP'
              });
              return `${tooltipItem.dataset.label}: ${amount}`;
            }
          }
        }
      },
      interaction: { mode: 'index', intersect: false },
      scales: {
        y: {
          display: true,
          grid: { display: true, color: '#e0e0e0' },
          ticks: { display: false }
        }
      }
    },
    plugins: [noDataPluginForBar]
  });
}

function updateGenderChart() {
  const selectedProgram = document.getElementById('genderProgramSelect')?.value || 'ALL';

  // Filter and count dynamically from allScholars
  let filteredScholars = allScholars;

  if (selectedProgram !== 'ALL') {
    // Filter by program prefix (e.g., "EDSP" matches "EDSP1", "EDSP2")
    filteredScholars = allScholars.filter(scholar =>
      scholar.program.toUpperCase().startsWith(selectedProgram)
    );
  }

  const maleCount = filteredScholars.filter(s => s.sex.toLowerCase() === 'male').length;
  const femaleCount = filteredScholars.filter(s => s.sex.toLowerCase() === 'female').length;

  const total = maleCount + femaleCount;

  const data = {
    labels: ['Male', 'Female'],
    datasets: [{
      data: [maleCount, femaleCount],
      backgroundColor: [COLORS.MALE, COLORS.FEMALE],
      borderWidth: 1
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: { top: 0, bottom: 0 } },
    plugins: {
      title: {
        display: true,
        text: selectedProgram === 'ALL'
          ? 'Gender Breakdown (All Programs)'
          : `Gender Breakdown (${selectedProgram})`,
        font: { size: 12, weight: 'bold' },
        position: 'bottom',
        padding: { top: 4 }
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label;
            const value = context.raw;
            const percent = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} scholars (${percent}%)`;
          }
        }
      },
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 6,
          boxHeight: 6,
          padding: 6,
          font: { size: 12 }
        }
      }
    }
  };

  const noDataPlugin = {
    id: 'noData',
    afterDraw(chart) {
      const { ctx, chartArea: { left, top, width, height } } = chart;
      const values = chart.data.datasets[0].data;
      const allZero = values.every(v => v === 0);

      if (allZero) {
        ctx.save();
        ctx.font = 'bold 14px sans-serif';
        ctx.fillStyle = '#999';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('No Data', left + width / 2, top + height / 2);
        ctx.restore();
      }
    }
  };

  if (genderChart) genderChart.destroy();

  const genderCtx = document.getElementById('pieChart')?.getContext('2d');
  if (!genderCtx) return;

  genderChart = new Chart(genderCtx, {
    type: 'doughnut',
    data,
    options,
    plugins: [noDataPlugin]
  });
}


document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons(); // Initialize Lucide icons
  bindProfileDropdown();
  bindSidebarNav();
  bindDashboardCardClicks();
  populateYearSelect();
  renderScholarsTable();      // Fill the table with dummy data
  updateDashboardCounts();    // Update total scholars count in dashboard
  // Initialize showing/pagination if scholars table is present on initial load
  try { if (typeof currentPage !== 'undefined') currentPage = 1; } catch (_) {}
  if (document.getElementById('scholar-table-body')) {
    if (typeof paginateScholars === 'function') {
      paginateScholars();
    } else {
      const tbody = document.getElementById('scholar-table-body');
      const rows = Array.from(tbody?.querySelectorAll('tr') || []);
      const showingEl = document.getElementById('pagination-showing');
      if (showingEl) showingEl.textContent = `Showing: ${rows.length} of ${rows.length}`;
    }
  }

  // Initialize bar chart with selected year or default
  const yearSelect = document.getElementById('year');
  const initialYear = yearSelect?.value || '2025';
  createOrUpdateBarChart(initialYear);

  if (yearSelect) {
    yearSelect.addEventListener('change', e => {
      createOrUpdateBarChart(e.target.value);
    });
  }

  // Initialize gender chart
  updateGenderChart();

  // Update gender chart when program dropdown changes
  const programSelect = document.getElementById('genderProgramSelect');
  if (programSelect) {
    programSelect.addEventListener('change', updateGenderChart);
  }

  // Initialize recent scholars list
  updateRecentScholars();  // <-- Add this line here
  bindScholarSearch();
  // Scholars filter dropdown (program/category)
  bindFilterDropdownToggle();
  bindExportCsv();

  
});

// -------- Your existing functions below --------

function bindProfileDropdown() {
  const dropdownToggle = document.getElementById("dropdownToggle");
  const profileDropdown = document.getElementById("profileDropdown");

  if (!dropdownToggle || !profileDropdown) return;

  // Remove old event listeners (clone trick)
  const newToggle = dropdownToggle.cloneNode(true);
  dropdownToggle.parentNode.replaceChild(newToggle, dropdownToggle);

  let isOpen = false;

  newToggle.onclick = (e) => {
    e.stopPropagation();
    isOpen = !isOpen;
    profileDropdown.style.display = isOpen ? "block" : "none";
  };

  document.addEventListener("click", () => {
    if (isOpen) {
      profileDropdown.style.display = "none";
      isOpen = false;
    }
  });

  profileDropdown.onclick = (e) => {
    e.stopPropagation();
  };
}

function bindExportCsv() {
  const btn = document.getElementById('exportCsvBtn');
  const tbody = document.getElementById('scholar-table-body');
  if (!btn || !tbody) return;

  btn.addEventListener('click', () => {
    const rows = Array.from(tbody.querySelectorAll('tr'))
      .filter(r => r.style.display !== 'none'); // only currently visible (filtered/searched)

    const header = ['No.', 'Batch', 'Name of Scholar', 'Home Address', 'Program', 'Birth Date', 'Contact', 'Sex', 'Status', 'Bank Details'];

    const data = rows.map(r => ([
      r.cells[1]?.textContent?.trim() || '',
      r.cells[2]?.textContent?.trim() || '',
      r.cells[3]?.textContent?.trim() || '',
      r.cells[4]?.textContent?.trim() || '',
      r.cells[5]?.textContent?.trim() || '',
      r.cells[6]?.textContent?.trim() || '',
      r.cells[7]?.textContent?.trim() || '',
      r.cells[8]?.textContent?.trim() || '',
      r.cells[9]?.textContent?.trim() || '',
      r.cells[10]?.textContent?.trim() || '',
    ]));

    const csv = [header, ...data]
      .map(cols => cols.map(escapeCsv).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'scholars_export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}

function escapeCsv(value) {
  const v = (value || '').replace(/\r?\n/g, ' ');
  if (v.includes(',') || v.includes('"')) {
    return '"' + v.replace(/"/g, '""') + '"';
  }
  return v;
}

function showAllScholars() {
  const rows = document.querySelectorAll("#scholar-table-body tr");
  rows.forEach(row => {
    row.style.display = "";
  });
}

function filterScholarsByPrograms(allowedPrograms) {
  const rows = document.querySelectorAll("#scholar-table-body tr");
  rows.forEach(row => {
    const scholarProgram = (row.getAttribute("data-subprogram") || row.getAttribute("data-program") || "").toUpperCase();
    row.style.display = allowedPrograms.includes(scholarProgram) ? "" : "none";
  });
}

function filterEDSPScholars() {
  filterScholarsByPrograms(["EDSP1", "EDSP2"]);
}

function filterODSPScholars() {
  filterScholarsByPrograms(["ODSP1", "ODSP2"]);
}

function filterELAPScholars() {
  filterScholarsByPrograms(["ELAP ELEMENTARY", "ELAP HIGHSCHOOL", "ELAP COLLEGE"]);
}

function updateScholarsLabel(program) {
  const label = document.getElementById("scholarsLabel");
  if (!label) return;

  let text = "All Scholars";

  if (program === "EDSP") text = "EDSP Scholars";
  else if (program === "ODSP") text = "ODSP Scholars";
  else if (program === "ELAP") text = "ELAP Scholars";
  else if (program === "ALL") text = "All Scholars";

  label.textContent = text;
}

function bindSidebarNav() {
  const navLinks = document.querySelectorAll(".nav-link");
  const dropdownToggles = document.querySelectorAll(".dropdown-toggle");
  const allDropdowns = document.querySelectorAll(".dropdown");
  const allSections = document.querySelectorAll(".page-section");

  function updateTopbarTitleAndIcon(title, iconName) {
    const iconElement = document.getElementById("sectionIcon");
    const titleElement = document.getElementById("sectionTitleText");

    if (iconElement && titleElement) {
      iconElement.setAttribute("data-lucide", iconName);
      titleElement.textContent = title;
      lucide.createIcons();
    }
  }

  navLinks.forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      navLinks.forEach(l => l.classList.remove("active"));
      dropdownToggles.forEach(t => t.classList.remove("active"));
      allDropdowns.forEach(d => d.classList.remove("open"));
      this.classList.add("active");

      const parentDropdown = this.closest(".dropdown");
      if (parentDropdown) {
        parentDropdown.classList.add("open");
        const toggle = parentDropdown.querySelector(".dropdown-toggle");
        if (toggle) toggle.classList.add("active");
      }

      const sectionId = this.getAttribute("data-section-id");
      if (sectionId) {
        allSections.forEach(sec => sec.classList.add("hidden"));
        const target = document.getElementById(sectionId);
        if (target) target.classList.remove("hidden");
      }

      const program = (this.getAttribute("data-program") || "ALL").toUpperCase();

      if (sectionId === "scholars-section") {
        // Update filter dropdown UI to reflect submenu choice
        updateFilterDropdownUI(program);

        // Apply program filter (no specific category)
        if (program === "ALL") {
          showAllScholars();
        } else {
          applyProgramCategoryFilter(program, "");
        }

        // Re-apply search if active
        const searchInput = document.querySelector('.search-bar');
        if (searchInput && searchInput.value.trim() !== '') {
          searchInput.dispatchEvent(new Event('keyup'));
        }

        // Update label and reset pagination
        updateScholarsLabel(program);
        try { if (typeof currentPage !== 'undefined') currentPage = 1; } catch (_) {}
        if (typeof paginateScholars === 'function') {
          paginateScholars();
        }
      }

      if (!this.closest(".dropdown-menu")) {
        const title = this.getAttribute("data-title");
        const icon = this.getAttribute("data-icon");
        if (title && icon) {
          updateTopbarTitleAndIcon(title, icon);
          bindProfileDropdown();
        }
      } else {
        updateTopbarTitleAndIcon("Scholars", "users");
        bindProfileDropdown();
      }
    });
  });

  dropdownToggles.forEach(toggle => {
    toggle.addEventListener("click", function (e) {
      e.preventDefault();

      const parent = this.closest(".dropdown");

      allDropdowns.forEach(d => d.classList.remove("open"));
      dropdownToggles.forEach(t => t.classList.remove("active"));
      navLinks.forEach(l => l.classList.remove("active"));

      parent.classList.add("open");
      this.classList.add("active");

      const title = this.getAttribute("data-title");
      const icon = this.getAttribute("data-icon");
      if (title && icon) {
        updateTopbarTitleAndIcon(title, icon);
        bindProfileDropdown();
      }

      const sectionId = this.getAttribute("data-section-id");
      if (sectionId) {
        allSections.forEach(sec => sec.classList.add("hidden"));
        const target = document.getElementById(sectionId);
        if (target) target.classList.remove("hidden");

        if (sectionId === "scholars-section") {
          showAllScholars();
          updateScholarsLabel("ALL");
          updateFilterDropdownUI('ALL');
          // Initialize pagination/showing when landing on Scholars
          try { if (typeof currentPage !== 'undefined') currentPage = 1; } catch (_) {}
          if (typeof paginateScholars === 'function') {
            paginateScholars();
          } else {
            const tbody = document.getElementById('scholar-table-body');
            const rows = Array.from(tbody?.querySelectorAll('tr') || []);
            const showingEl = document.getElementById('pagination-showing');
            if (showingEl) showingEl.textContent = `Showing: ${rows.length} of ${rows.length}`;
          }
        }
      }
    });
  });
}

function bindDashboardCardClicks() {
  const scholarsCard = document.getElementById("goToScholars");
  const disbursementCard = document.getElementById("goToDisbursement");
  const graduatesCard = document.getElementById("goToGraduates");
  const navLinks = document.querySelectorAll(".nav-link");
  const dropdownToggles = document.querySelectorAll(".dropdown-toggle");
  const allDropdowns = document.querySelectorAll(".dropdown");
  const allSections = document.querySelectorAll(".page-section");

  function updateTopbarTitleAndIcon(title, iconName) {
    const iconElement = document.getElementById("sectionIcon");
    const titleElement = document.getElementById("sectionTitleText");

    if (iconElement && titleElement) {
      iconElement.setAttribute("data-lucide", iconName);
      titleElement.textContent = title;
      lucide.createIcons();
    }
  }

  function showAllScholars() {
    const rows = document.querySelectorAll("#scholar-table-body tr");
    rows.forEach(row => (row.style.display = ""));
  }

  function activateNavLinkAndShowSection(navSelector, sectionId, title, icon, extraAction) {
    navLinks.forEach(l => l.classList.remove("active"));
    dropdownToggles.forEach(t => t.classList.remove("active"));
    allDropdowns.forEach(d => d.classList.remove("open"));

    const navLink = document.querySelector(navSelector);
    if (!navLink) return;

    navLink.classList.add("active");

    const parentDropdown = navLink.closest(".dropdown");
    if (parentDropdown) {
      parentDropdown.classList.add("open");
      const toggle = parentDropdown.querySelector(".dropdown-toggle");
      if (toggle) toggle.classList.add("active");
    }

    allSections.forEach(sec => sec.classList.add("hidden"));
    const targetSection = document.getElementById(sectionId);
    if (targetSection) targetSection.classList.remove("hidden");

    updateTopbarTitleAndIcon(title, icon);

    if (extraAction) extraAction();

    bindProfileDropdown();
  }

  if (scholarsCard) {
    scholarsCard.addEventListener("click", (e) => {
      e.preventDefault();

      activateNavLinkAndShowSection(
        '.nav-link[data-section-id="scholars-section"]',
        "scholars-section",
        "Scholars",
        "users",
        () => {
          showAllScholars();
          const label = document.getElementById("scholarsLabel");
          if (label) label.textContent = "All Scholars";

          const parentDropdown = document.querySelector('.nav-link[data-section-id="scholars-section"]').closest(".dropdown");
          if (parentDropdown) {
            const subNavLinks = parentDropdown.querySelectorAll(".dropdown-menu .nav-link");
            subNavLinks.forEach(link => link.classList.remove("active"));
          }
        }
      );
    });
  }

  if (disbursementCard) {
    disbursementCard.addEventListener("click", (e) => {
      e.preventDefault();

      activateNavLinkAndShowSection(
        '.nav-link[data-section-id="disbursement-section"]',
        "disbursement-section",
        "Disbursement",
        "wallet",
        null
      );
    });
  }

  if (graduatesCard) {
    graduatesCard.addEventListener("click", (e) => {
      e.preventDefault();

      activateNavLinkAndShowSection(
        '.nav-link[data-section-id="graduates-section"]',
        "graduates-section",
        "Graduates",
        "graduation-cap",
        null
      );
    });
  }
}

// Update the Program/Category dropdown UI from submenu actions
function updateFilterDropdownUI(programValue) {
  const programSelect = document.getElementById('filterProgramSelect') || document.getElementById('programSelect');
  const categorySelect = document.getElementById('categorySelect');
  if (!programSelect || !categorySelect) return;

  const program = (programValue || 'ALL').toUpperCase();

  // Set program value if option exists
  const hasOption = Array.from(programSelect.options).some(opt => opt.value.toUpperCase() === program);
  if (hasOption) programSelect.value = program;

  // Build category options based on program
  categorySelect.innerHTML = '';
  if (program === 'ALL' || program === '') {
    categorySelect.disabled = true;
    const opt = document.createElement('option');
    opt.textContent = 'Select program first';
    opt.value = '';
    categorySelect.appendChild(opt);
    return;
  }

  categorySelect.disabled = false;
  let categories = [];
  if (program === 'EDSP') categories = ['EDSP1', 'EDSP2'];
  else if (program === 'ODSP') categories = ['ODSP1', 'ODSP2'];
  else if (program === 'ELAP') categories = ['ELEMENTARY', 'HIGHSCHOOL', 'COLLEGE'];

  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    categorySelect.appendChild(opt);
  });
}

function populateYearSelect() {
  const yearSelect = document.getElementById('year');
  if (!yearSelect) return;

  const startYear = 2025;
  const currentYear = new Date().getFullYear();

  let options = `<option value="${startYear}">${startYear}</option>`;

  for (let year = currentYear; year > startYear; year--) {
    options += `<option value="${year}">${year}</option>`;
  }

  yearSelect.innerHTML = options;
}

function updateRecentScholars() {
  const list = document.getElementById('recent-scholars-list');
  if (!list) return;

  list.innerHTML = ''; // Clear existing content

  // Sort allScholars by recentDate descending (newest first)
  const sortedScholars = allScholars
    .filter(s => s.recentDate) // only those with recentDate
    .sort((a, b) => new Date(b.recentDate) - new Date(a.recentDate));

  // Take top 5 recent scholars (change number if you want)
  const recent = sortedScholars.slice(0, 5);

  if (recent.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'No recent scholars available';
    li.classList.add('no-hover');
    Object.assign(li.style, {
      textAlign: 'center',
      fontStyle: 'italic',
      color: '#888'
    });
    list.appendChild(li);
    return;
  }

  recent.forEach(({ name, program, recentDate }) => {
    const li = document.createElement('li');
    li.classList.add('recent-scholar-item'); // optional for styling

    // Format date nicely, e.g. Aug 7, 2025
    const dateObj = new Date(recentDate);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });

    li.innerHTML = `
      <div class="scholar-info">
        <strong>${name}</strong>
        <span>${program}</span>
      </div>
      <span class="date">${formattedDate}</span>
    `;

    list.appendChild(li);
  });
}


function renderScholarsTable() {
  const tbody = document.getElementById('scholar-table-body');
  if (!tbody) return;

  tbody.innerHTML = ''; // Clear previous rows

  allScholars.forEach((scholar, index) => {
    const tr = document.createElement('tr');
    tr.setAttribute('data-program', scholar.program.toUpperCase());
    tr.setAttribute('data-subprogram', scholar.program.toUpperCase());

    tr.innerHTML = `
      <td><input type="checkbox" class="row-checkbox"/></td>
      <td>${index + 1}</td>
      <td>${scholar.batch}</td>
      <td>${scholar.name}</td>
      <td>${scholar.address}</td>
      <td>${scholar.program}</td>
      <td>${scholar.birthDate}</td>
      <td>${scholar.contact}</td>
      <td>${scholar.sex}</td>
      <td><span class="status done">${scholar.status}</span></td>
      <td><span class="bank">${scholar.bankDetails}</span></td>
      <td class="action-wrapper" style="position: relative;">
        <button class="action-menu-btn">
          <i data-lucide="more-vertical"></i>
        </button>
        <!-- Dropdown menu can be added here if needed -->
      </td>
    `;

    tbody.appendChild(tr);
  });

  // Re-init lucide icons for dynamically added elements
  if (window.lucide) {
    window.lucide.createIcons();
  }
  
  // Bind checkbox functionality
  bindCheckboxLogic();
  
  // Bind contextual action bar functionality
  bindContextualActionBar();
}

function updateDashboardCounts() {
  const totalScholarsCountElem = document.getElementById('total-scholars-count');
  if (!totalScholarsCountElem) return;

  totalScholarsCountElem.textContent = allScholars.length;
}

function computeGenderData(scholars) {
  return scholars.reduce((acc, scholar) => {
    const gender = (scholar.sex || '').toLowerCase();
    if (gender === 'male') acc.male++;
    else if (gender === 'female') acc.female++;
    return acc;
  }, { male: 0, female: 0 });
}

function bindScholarSearch() {
  const searchInput = document.querySelector('.search-bar');
  const scholarTableBody = document.getElementById('scholar-table-body');
  const paginationShowing = document.getElementById('pagination-showing');

  if (!searchInput || !scholarTableBody || !paginationShowing) return;

  searchInput.addEventListener('keyup', () => {
    const searchTerm = searchInput.value.toLowerCase().trim();

    // Read current filter selections (if present)
    const programSelect = document.getElementById('filterProgramSelect') || document.getElementById('programSelect');
    const categorySelect = document.getElementById('categorySelect');
    const selectedProgram = (programSelect?.value || 'ALL').toUpperCase();
    const selectedCategoryRaw = (categorySelect?.value || '').toUpperCase();
    const categoryEnabled = !!categorySelect && !categorySelect.disabled && !!selectedCategoryRaw;

    let visibleCount = 0;

    // Split input into words for Last, First matching
    const terms = searchTerm.split(/\s+/);
    const lastNameTerm = terms[0] || "";
    const firstNameTerm = terms[1] || "";

    Array.from(scholarTableBody.rows).forEach(row => {
      // Base filter (Program + Category)
      const rowProgram = (row.getAttribute('data-program') || '').toUpperCase();
      const rowSub = (row.getAttribute('data-subprogram') || '').toUpperCase();

      const matchesProgram = selectedProgram === 'ALL' || rowProgram.startsWith(selectedProgram);

      let matchesCategory = true;
      if (selectedProgram !== 'ALL' && categoryEnabled) {
        let expectedSub = selectedCategoryRaw;
        if (selectedProgram === 'ELAP' && !selectedCategoryRaw.startsWith('ELAP')) {
          expectedSub = `ELAP ${selectedCategoryRaw}`;
        }
        matchesCategory = rowSub === expectedSub || rowProgram === expectedSub;
      }

      // Search filter (by name)
      let matchesSearch = true;
      if (searchTerm !== "") {
        const nameCell = row.cells[3];
        if (!nameCell) {
          matchesSearch = false;
    } else {
      const fullName = nameCell.textContent.trim().toLowerCase();
      const nameParts = fullName.split(/\s+/);
      const lastName = nameParts[0] || "";
      const firstName = nameParts[1] || "";
          matchesSearch = lastName.startsWith(lastNameTerm) && (firstNameTerm === '' || firstName.startsWith(firstNameTerm));
        }
      }

      const showRow = matchesProgram && matchesCategory && matchesSearch;
      row.style.display = showRow ? '' : 'none';
      if (showRow) visibleCount++;
    });

    const totalRows = scholarTableBody.rows.length;
    paginationShowing.textContent = `Showing: ${visibleCount} of ${totalRows}`;

    // Reset and apply pagination if available
    try { if (typeof currentPage !== 'undefined') currentPage = 1; } catch (_) {}
    if (typeof paginateScholars === 'function') {
      paginateScholars();
    }
    
    // Update checkbox states after filtering
    updateSelectAllState();
  });
}


// Toggle the Scholars filter dropdown panel
function bindFilterDropdownToggle() {
  const filterBtn = document.getElementById('filterBtn') || document.querySelector('.filter-btn');
  const filterDropdown = document.getElementById('filter-dropdown');
  const programSelect = document.getElementById('filterProgramSelect') || document.getElementById('programSelect');
  const categorySelect = document.getElementById('categorySelect');
  const applyBtn = document.getElementById('applyFilterBtn');
  const clearBtn = document.getElementById('clearFilterBtn');

  if (!filterBtn || !filterDropdown) return;

  // Toggle dropdown visibility
  filterBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    filterDropdown.classList.toggle('hidden');
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    const isInside = filterDropdown.contains(e.target) || filterBtn.contains(e.target);
    if (!isInside) filterDropdown.classList.add('hidden');
  });

  // Prevent closing when interacting inside the dropdown
  filterDropdown.addEventListener('click', (e) => e.stopPropagation());

  // Populate Category options based on selected Program
  if (programSelect && categorySelect) {
    const populateCategories = (programValue) => {
      const value = (programValue || '').toUpperCase();
      categorySelect.innerHTML = '';

      if (value === 'ALL' || value === '') {
        categorySelect.disabled = true;
        const opt = document.createElement('option');
        opt.textContent = 'Select program first';
        opt.value = '';
        categorySelect.appendChild(opt);
    return;
  }

      categorySelect.disabled = false;

      let categories = [];
      if (value === 'EDSP') categories = ['ALL', 'EDSP1', 'EDSP2'];
      else if (value === 'ODSP') categories = ['ALL', 'ODSP1', 'ODSP2'];
      else if (value === 'ELAP') categories = ['ALL', 'ELEMENTARY', 'HIGHSCHOOL', 'COLLEGE'];

      categories.forEach((cat) => {
        const opt = document.createElement('option');
        opt.value = cat.toUpperCase();
        opt.textContent = cat === 'ALL' ? 'All' : cat;
        categorySelect.appendChild(opt);
      });

      // Default to All for the chosen program
      categorySelect.value = 'ALL';
    };

    // Initialize once and when Program changes
    populateCategories(programSelect.value);
    programSelect.addEventListener('change', (e) => populateCategories(e.target.value));
  }

  // Apply filter to table rows
  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      const selectedProgram = (programSelect?.value || 'ALL').toUpperCase();
      const selectedCategoryRaw = (categorySelect?.value || 'ALL').toUpperCase();

      applyProgramCategoryFilter(selectedProgram, selectedCategoryRaw);
      // Sync submenu active state and label with selected Program
      updateScholarsSubmenuActive(selectedProgram);
      updateScholarsLabel(selectedProgram);

      // If there is an active search, re-apply it
  const searchInput = document.querySelector('.search-bar');
      if (searchInput && searchInput.value.trim() !== '') {
        searchInput.dispatchEvent(new Event('keyup'));
      }

      // Close dropdown after applying
      filterDropdown.classList.add('hidden');
    });
  }

  // Clear filters: reset selects, show all rows, reset pagination/counter
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      const tbody = document.getElementById('scholar-table-body');
      if (!tbody) return;

      // Reset Program select to All if exists
      if (programSelect) {
        // Prefer explicit "ALL" option where available
        const hasAll = Array.from(programSelect.options).some(o => o.value.toUpperCase() === 'ALL');
        programSelect.value = hasAll ? 'ALL' : (programSelect.options[0]?.value || 'ALL');
      }

      // Reset Category select disabled + placeholder
      if (categorySelect) {
        categorySelect.disabled = true;
        categorySelect.innerHTML = '';
      const opt = document.createElement('option');
        opt.textContent = 'Select program first';
        opt.value = '';
        categorySelect.appendChild(opt);
      }

      // Show all rows
      const rows = Array.from(tbody.querySelectorAll('tr'));
      rows.forEach(r => r.style.display = '');

      // Reset pagination to first page if available
      try { if (typeof currentPage !== 'undefined') currentPage = 1; } catch (_) {}
      if (typeof paginateScholars === 'function') {
    paginateScholars();
      } else {
        const showingEl = document.getElementById('pagination-showing');
        if (showingEl) showingEl.textContent = `Showing: ${rows.length} of ${rows.length}`;
      }

      // Re-apply search if any
      const searchInput = document.querySelector('.search-bar');
      if (searchInput && searchInput.value.trim() !== '') {
        searchInput.dispatchEvent(new Event('keyup'));
      }
      // Sync submenu and label to ALL
      updateScholarsSubmenuActive('ALL');
      updateScholarsLabel('ALL');

      // Keep dropdown open to reflect cleared state or close if preferred
      // filterDropdown.classList.add('hidden');
    });
  }
}

// Helper: Apply Program + Category filter to rows and update counts/pagination
function applyProgramCategoryFilter(selectedProgram, selectedCategoryRaw) {
  const tbody = document.getElementById('scholar-table-body');
  if (!tbody) return;

  const rows = Array.from(tbody.querySelectorAll('tr'));
  const program = (selectedProgram || 'ALL').toUpperCase();
  const categoryRaw = (selectedCategoryRaw || 'ALL').toUpperCase();

  rows.forEach((row) => {
    const rowProgram = (row.getAttribute('data-program') || '').toUpperCase();
    const rowSub = (row.getAttribute('data-subprogram') || '').toUpperCase();

    const matchesProgram = program === 'ALL' || rowProgram.startsWith(program);

  let matchesCategory = true;
  if (program !== 'ALL' && categoryRaw !== 'ALL') {
      let expectedSub = categoryRaw;
      if (program === 'ELAP' && !categoryRaw.startsWith('ELAP')) {
        expectedSub = `ELAP ${categoryRaw}`;
      }
      matchesCategory = rowSub === expectedSub || rowProgram === expectedSub;
    }

    row.style.display = (matchesProgram && matchesCategory) ? '' : 'none';
  });

  // Update showing counter if present
  const showingEl = document.getElementById('pagination-showing');
  if (showingEl) {
    const all = rows.length;
    const visible = rows.filter(r => r.style.display !== 'none').length;
    showingEl.textContent = `Showing: ${visible} of ${all}`;
  }

  // Reset pagination to first page if available
  try { if (typeof currentPage !== 'undefined') currentPage = 1; } catch (_) {}
  if (typeof paginateScholars === 'function') {
    paginateScholars();
  }
  
  // Update checkbox states after filtering
  updateSelectAllState();
}

// Highlight the correct Scholars submenu based on program
function updateScholarsSubmenuActive(programValue) {
  const program = (programValue || 'ALL').toUpperCase();
  const dropdown = document.querySelector('.dropdown');
  const toggle = dropdown?.querySelector('.dropdown-toggle');
  const submenuLinks = dropdown?.querySelectorAll('.dropdown-menu .nav-link') || [];

  // Clear active from all submenu links
  submenuLinks.forEach(link => link.classList.remove('active'));

  if (program !== 'ALL') {
    // Ensure the dropdown is open and toggle active
    if (dropdown) dropdown.classList.add('open');
    if (toggle) toggle.classList.add('active');

    // Activate the matching submenu link
    const match = Array.from(submenuLinks).find(l => (l.getAttribute('data-program') || '').toUpperCase() === program);
    if (match) match.classList.add('active');
  }
}






// Add any other existing helper or binding functions here...

// Add Scholar Modal Functions
function openAddScholarModal() {
  const modal = document.getElementById('addScholarModal2');
  if (modal) {
    modal.classList.remove('hidden');
  }
}

function closeAddScholarModal2() {
  const modal = document.getElementById('addScholarModal2');
  if (modal) {
    modal.classList.add('hidden');
  }
}

// Add click event for Add button to open modal
document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.querySelector('.add-btn');
  const modal = document.getElementById('addScholarModal2');
  
  if (addBtn && modal) {
    addBtn.addEventListener('click', () => {
      openAddScholarModal();
    });
  }
  
  // Close modal when clicking outside
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeAddScholarModal2();
      }
    });
  }
  
  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAddScholarModal2();
    }
  });
  
  // Bind contextual action bar functionality
  bindContextualActionBar();
});

// ========== CHECKBOX FUNCTIONALITY ==========
function bindCheckboxLogic() {
  const selectAllCheckbox = document.getElementById('select-all-scholars');
  const rowCheckboxes = document.querySelectorAll('.row-checkbox');
  
  if (!selectAllCheckbox) return;
  
  // Select all checkbox functionality
  selectAllCheckbox.addEventListener('change', function() {
    const isChecked = this.checked;
    
    // Get only visible checkboxes (not filtered out)
    const visibleCheckboxes = Array.from(rowCheckboxes).filter(checkbox => {
      const row = checkbox.closest('tr');
      return row && row.style.display !== 'none';
    });
    
    // Check/uncheck all visible checkboxes
    visibleCheckboxes.forEach(checkbox => {
      checkbox.checked = isChecked;
    });
    
    updateSelectedCount();
  });
  
  // Individual checkbox functionality
  rowCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      updateSelectAllState();
      updateSelectedCount();
    });
  });
}

function updateSelectAllState() {
  const selectAllCheckbox = document.getElementById('select-all-scholars');
  const visibleCheckboxes = Array.from(document.querySelectorAll('.row-checkbox')).filter(checkbox => {
    const row = checkbox.closest('tr');
    return row && row.style.display !== 'none';
  });
  
  if (visibleCheckboxes.length === 0) {
    selectAllCheckbox.checked = false;
    selectAllCheckbox.indeterminate = false;
    return;
  }
  
  const checkedCount = visibleCheckboxes.filter(checkbox => checkbox.checked).length;
  
  if (checkedCount === 0) {
    selectAllCheckbox.checked = false;
    selectAllCheckbox.indeterminate = false;
  } else if (checkedCount === visibleCheckboxes.length) {
    selectAllCheckbox.checked = true;
    selectAllCheckbox.indeterminate = false;
  } else {
    selectAllCheckbox.checked = false;
    selectAllCheckbox.indeterminate = true;
  }
}

function updateSelectedCount() {
  const checkedCheckboxes = document.querySelectorAll('.row-checkbox:checked');
  const count = checkedCheckboxes.length;
  
  // Update contextual action bar
  const contextualActionBar = document.getElementById('contextual-action-bar');
  const selectedCountText = document.getElementById('selected-count-text');
  const actionBarCheckbox = document.getElementById('action-bar-checkbox');
  
  if (count > 0) {
    // Show the contextual action bar
    if (contextualActionBar) {
      contextualActionBar.classList.remove('hidden');
    }
    
    // Update the count text
    if (selectedCountText) {
      selectedCountText.textContent = `${count} Item${count === 1 ? '' : 's'}`;
    }
    
    // Update action bar checkbox state
    if (actionBarCheckbox) {
      actionBarCheckbox.checked = true;
    }
  } else {
    // Hide the contextual action bar
    if (contextualActionBar) {
      contextualActionBar.classList.add('hidden');
    }
    
    // Update action bar checkbox state
    if (actionBarCheckbox) {
      actionBarCheckbox.checked = false;
    }
  }
  
  console.log(`Selected ${count} scholars`);
}

// Get selected scholar IDs
function getSelectedScholarIds() {
  const checkedCheckboxes = document.querySelectorAll('.row-checkbox:checked');
  const selectedIds = [];
  
  checkedCheckboxes.forEach(checkbox => {
    const row = checkbox.closest('tr');
    if (row) {
      // You can add data-id attribute to rows if needed
      const rowIndex = row.rowIndex - 1; // Adjust for header row
      selectedIds.push(rowIndex);
    }
  });
  
  return selectedIds;
}

// ========== CONTEXTUAL ACTION BAR FUNCTIONALITY ==========
function bindContextualActionBar() {
  const actionBarCheckbox = document.getElementById('action-bar-checkbox');
  const releaseBtn = document.getElementById('release-btn');
  const removeBtn = document.getElementById('remove-btn');
  
  // Action bar checkbox functionality
  if (actionBarCheckbox) {
    actionBarCheckbox.addEventListener('change', function() {
      const isChecked = this.checked;
      const selectAllCheckbox = document.getElementById('select-all-scholars');
      const rowCheckboxes = document.querySelectorAll('.row-checkbox');
      
      if (isChecked) {
        // Select all visible checkboxes
        const visibleCheckboxes = Array.from(rowCheckboxes).filter(checkbox => {
          const row = checkbox.closest('tr');
          return row && row.style.display !== 'none';
        });
        visibleCheckboxes.forEach(checkbox => {
          checkbox.checked = true;
        });
        if (selectAllCheckbox) {
          selectAllCheckbox.checked = true;
          selectAllCheckbox.indeterminate = false;
        }
      } else {
        // Unselect all checkboxes
        rowCheckboxes.forEach(checkbox => {
          checkbox.checked = false;
        });
        if (selectAllCheckbox) {
          selectAllCheckbox.checked = false;
          selectAllCheckbox.indeterminate = false;
        }
      }
      
      updateSelectedCount();
    });
  }
  
  // Graduates button functionality
  if (releaseBtn) {
    releaseBtn.addEventListener('click', function() {
      const selectedIds = getSelectedScholarIds();
      if (selectedIds.length > 0) {
        console.log(`Graduating ${selectedIds.length} scholars:`, selectedIds);
        // Add your graduate logic here
        alert(`Graduate functionality for ${selectedIds.length} selected scholars`);
      } else {
        alert('Please select scholars to graduate');
      }
    });
  }
  
  // Remove button functionality
  if (removeBtn) {
    removeBtn.addEventListener('click', function() {
      const selectedIds = getSelectedScholarIds();
      if (selectedIds.length > 0) {
        const confirmMessage = `Are you sure you want to remove ${selectedIds.length} selected scholar${selectedIds.length === 1 ? '' : 's'}?`;
        if (confirm(confirmMessage)) {
          console.log(`Removing ${selectedIds.length} scholars:`, selectedIds);
          // Add your remove logic here
          alert(`Remove functionality for ${selectedIds.length} selected scholars`);
        }
      } else {
        alert('Please select scholars to remove');
      }
    });
  }
}
