document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons(); // Initialize Lucide icons
  bindProfileDropdown();     // ✅ Initial bind
  bindSidebarNav();          // ✅ Sidebar logic
  bindDashboardCardClicks();
  populateYearSelect();
  createBarChart();
  updateBarChartData();
  updateRecentScholars();
  updateRecentScholars();
  bindScholarSearch();
  bindFilterDropdownToggle();
});

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

// Show all scholars (no filtering)
function showAllScholars() {
  const rows = document.querySelectorAll("#scholar-table-body tr");
  rows.forEach(row => {
    row.style.display = "";
  });
}


// Filter EDSP scholars (EDSP1, EDSP2)
function filterEDSPScholars() {
  const rows = document.querySelectorAll("#scholar-table-body tr");
  rows.forEach(row => {
    const scholarProgram = row.getAttribute("data-subprogram")?.toUpperCase() || row.getAttribute("data-program")?.toUpperCase();

    if (scholarProgram === "EDSP1" || scholarProgram === "EDSP2") {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}


// Filter ODSP scholars (ODSP1, ODSP2)
function filterODSPScholars() {
  const rows = document.querySelectorAll("#scholar-table-body tr");
  rows.forEach(row => {
    const scholarProgram = row.getAttribute("data-subprogram")?.toUpperCase() || row.getAttribute("data-program")?.toUpperCase();

    if (scholarProgram === "ODSP1" || scholarProgram === "ODSP2") {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}

function filterELAPScholars() {
  const rows = document.querySelectorAll("#scholar-table-body tr");
  rows.forEach(row => {
    const scholarProgram = row.getAttribute("data-subprogram")?.toUpperCase() || row.getAttribute("data-program")?.toUpperCase();

    if (["ELEMENTARY", "HIGHSCHOOL", "COLLEGE"].includes(scholarProgram)) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}


// New function to update the label/header in Scholars section dynamically
function updateScholarsLabel(program) {
  const label = document.getElementById("scholarsLabel");
  if (!label) return;

  let text = "All Scholars"; // default

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
      lucide.createIcons(); // re-render icons
    }
  }

  navLinks.forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // Handle active classes
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

      // Show/hide Section Logic
      const sectionId = this.getAttribute("data-section-id");
      if (sectionId) {
        allSections.forEach(sec => sec.classList.add("hidden"));
        const target = document.getElementById(sectionId);
        if (target) target.classList.remove("hidden");
      }

      // Get program attribute (ALL, EDSP, ODSP, ELAP)
      const program = this.getAttribute("data-program");

      // Filter scholars if in scholars-section
      if (sectionId === "scholars-section") {
        if (program === "ALL") {
          showAllScholars();
        } else if (program === "EDSP") {
          filterEDSPScholars();
        } else if (program === "ODSP") {
          filterODSPScholars();
        } else if (program === "ELAP") {
          filterELAPScholars();
        }
        updateScholarsLabel(program); // update label here
      }

      // Update topbar (only if not submenu)
      if (!this.closest(".dropdown-menu")) {
        const title = this.getAttribute("data-title");
        const icon = this.getAttribute("data-icon");
        if (title && icon) {
          updateTopbarTitleAndIcon(title, icon);
          bindProfileDropdown();
        }
      } else {
        // If submenu clicked, keep topbar as "Scholars"
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

      // Show/hide Section from toggle (e.g., Scholars)
      const sectionId = this.getAttribute("data-section-id");
      if (sectionId) {
        allSections.forEach(sec => sec.classList.add("hidden"));
        const target = document.getElementById(sectionId);
        if (target) target.classList.remove("hidden");

        // Show all scholars if Scholars main toggle clicked
        if (sectionId === "scholars-section") {
          showAllScholars();
          updateScholarsLabel("ALL"); // Also update label here on toggle
        }
      }
    });
  });
}

function bindDashboardCardClicks() {
  const scholarsCard = document.getElementById("goToScholars");
  const disbursementCard = document.getElementById("goToDisbursement");
  const graduatesCard = document.getElementById("goToGraduates");  // new
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

function populateYearSelect() {
  const yearSelect = document.getElementById('year');
  if (!yearSelect) return;

  const startYear = 2025;
  const currentYear = new Date().getFullYear();

  let options = `<option value="${startYear}">${startYear}</option>`;

  for (let year = startYear + 1; year <= currentYear; year++) {
    options += `<option value="${year}">${year}</option>`;
  }

  yearSelect.innerHTML = options;
}

let barChartInstance;

const yearlyData = {
  2023: {
    EDSP: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ODSP: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ELAP: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  },
  2024: {
    EDSP: [10, 11, 9, 14, 12, 13, 9, 8, 10, 12, 11, 13],
    ODSP: [6, 7, 8, 9, 7, 6.5, 7, 8, 9, 10, 8, 9],
    ELAP: [4, 5, 3.5, 4.5, 4, 3, 4, 3.5, 4, 3.8, 4.2, 5]
  },
  2025: { // example all zero data for testing No Data
    EDSP: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ODSP: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ELAP: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  }
};

function createBarChart() {
  const ctx = document.getElementById('barChart');
  if (!ctx) return;

  const year = document.getElementById('year')?.value || '2025';
  let data = yearlyData[year];

  if (!data) {
    // fallback zero data to show "No Data"
    data = {
      EDSP: Array(12).fill(0),
      ODSP: Array(12).fill(0),
      ELAP: Array(12).fill(0)
    };
  }

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
          backgroundColor: '#1E3A8A',
          borderRadius: 6
        },
        {
          label: 'ODSP',
          data: data.ODSP,
          backgroundColor: '#DC2626',
          borderRadius: 6
        },
        {
          label: 'ELAP',
          data: data.ELAP,
          backgroundColor: '#0F766E',
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

function updateBarChartData() {
  const year = document.getElementById('year')?.value || '2025';
  if (!barChartInstance) return;

  let data = yearlyData[year];
  if (!data) {
    // fallback zero data to show "No Data"
    data = {
      EDSP: Array(12).fill(0),
      ODSP: Array(12).fill(0),
      ELAP: Array(12).fill(0)
    };
  }

  barChartInstance.data.datasets[0].data = data.EDSP;
  barChartInstance.data.datasets[1].data = data.ODSP;
  barChartInstance.data.datasets[2].data = data.ELAP;
  barChartInstance.update();
}

// Sample data
const programGenderData = {
  EDSP: { male: 1, female: 5 },
  ODSP: { male: 0, female: 0 },
  ELAP: { male: 0, female: 0 }
};

let genderChart;

function updateGenderChart() {
  const selectedProgram = document.getElementById('programSelect')?.value || 'ALL';

  let maleCount = 0;
  let femaleCount = 0;

  if (programGenderData && Object.keys(programGenderData).length > 0) {
    if (selectedProgram === 'ALL') {
      for (const program in programGenderData) {
        maleCount += programGenderData[program]?.male || 0;
        femaleCount += programGenderData[program]?.female || 0;
      }
    } else {
      maleCount = programGenderData[selectedProgram]?.male || 0;
      femaleCount = programGenderData[selectedProgram]?.female || 0;
    }
  }

  const total = maleCount + femaleCount;

  const data = {
    labels: ['Male', 'Female'],
    datasets: [{
      data: [maleCount, femaleCount],
      backgroundColor: ['#1E3A8A', '#DC2626'],
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

  // Fixed plugin to center "No Data" text
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

  const genderCtx = document.getElementById('pieChart').getContext('2d');
  genderChart = new Chart(genderCtx, {
    type: 'doughnut',
    data,
    options,
    plugins: [noDataPlugin]
  });
}

updateGenderChart();

const recentScholars = [
  //{ name: "Juan Dela Cruz", program: "EDSP", date: "July 19, 2025" },
]; // or add sample data to test

// Example with data:
// const recentScholars = [
//   { name: "Juan Dela Cruz", program: "EDSP", date: "July 19, 2025" },
//   { name: "Maria Santos", program: "ODSP", date: "July 18, 2025" },
// ];

function updateRecentScholars() {
  const list = document.getElementById('recent-scholars-list');
  list.innerHTML = ''; // Clear existing content

  if (recentScholars.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'No recent scholars available';
    li.classList.add('no-hover'); //
    li.style.textAlign = 'center';
    li.style.fontStyle = 'italic';
    li.style.color = '#888';
    list.appendChild(li);
    return;
  }

  recentScholars.forEach(scholar => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="scholar-info">
        <strong>${scholar.name}</strong>
        <span>${scholar.program}</span>
      </div>
      <span class="date">${scholar.date}</span>
    `;
    list.appendChild(li);
  });
}

function bindScholarSearch() {
  const searchInput = document.querySelector('.search-bar');
  const scholarTableBody = document.getElementById('scholar-table-body');
  const paginationShowing = document.getElementById('pagination-showing');

  if (!searchInput || !scholarTableBody || !paginationShowing) return;

  searchInput.addEventListener('keyup', () => {
    const searchTerm = searchInput.value.toLowerCase().trim();
    let visibleCount = 0;

    Array.from(scholarTableBody.rows).forEach(row => {
      const nameCell = row.cells[3]; // full name cell (Lastname Firstname Middlename)
      if (!nameCell) return;

      const fullName = nameCell.textContent.trim().toLowerCase();
      const nameParts = fullName.split(/\s+/);

      // Extract parts safely
      const lastName = nameParts[0] || "";
      const firstName = nameParts[1] || "";
      const middleName = nameParts[2] || "";

      let showRow = false;

      if (lastName.includes(searchTerm)) {
        showRow = true;
      } else if (firstName.includes(searchTerm)) {
        showRow = true;
      } else if (middleName.includes(searchTerm)) {
        showRow = true;
      }

      row.style.display = showRow ? "" : "none";

      if (showRow) visibleCount++;
    });

    const totalRows = scholarTableBody.rows.length;
    paginationShowing.textContent = `Showing: ${visibleCount} of ${totalRows}`;
  });
}


function bindFilterDropdownToggle() {
  const filterBtn = document.getElementById('filterBtn');
  const filterDropdown = document.getElementById('filter-dropdown');

  if (!filterBtn || !filterDropdown) return;

  filterBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    filterDropdown.classList.toggle('hidden');
  });

  document.addEventListener('click', () => {
    if (!filterDropdown.classList.contains('hidden')) {
      filterDropdown.classList.add('hidden');
    }
  });

  filterDropdown.addEventListener('click', (e) => {
    e.stopPropagation();
  });
}








/*document.addEventListener("DOMContentLoaded", () => {
  populateYearSelect();
  lucide.createIcons(); // Initialize Lucide icons
  bindProfileDropdown();     // ✅ Initial bind
  bindSidebarNav();          // ✅ Sidebar logic
  bindDashboardCardClicks();
  createBarChart();
  updateBarChartData();
  updateRecentScholars();
  bindScholarSearch(); // <-- add this line
  bindFilterDropdownToggle();
});


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

// Show all scholars (no filtering)
function showAllScholars() {
  const rows = document.querySelectorAll("#scholar-table-body tr");
  rows.forEach(row => {
    row.style.display = "";
  });
}

// Filter EDSP scholars (EDSP1, EDSP2)
function filterEDSPScholars() {
  const rows = document.querySelectorAll("#scholar-table-body tr");
  rows.forEach(row => {
    const programCell = row.querySelector("td[data-program]");
    if (!programCell) return;

    const scholarProgram = programCell.getAttribute("data-program").toUpperCase();

    if (scholarProgram === "EDSP1" || scholarProgram === "EDSP2") {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}

// Filter ODSP scholars (ODSP1, ODSP2)
function filterODSPScholars() {
  const rows = document.querySelectorAll("#scholar-table-body tr");
  rows.forEach(row => {
    const programCell = row.querySelector("td[data-program]");
    if (!programCell) return;

    const scholarProgram = programCell.getAttribute("data-program").toUpperCase();

    if (scholarProgram === "ODSP1" || scholarProgram === "ODSP2") {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}

// Filter ELAP scholars (ELEMENTARY, HIGHSCHOOL, COLLEGE)
function filterELAPScholars() {
  const rows = document.querySelectorAll("#scholar-table-body tr");
  rows.forEach(row => {
    const programCell = row.querySelector("td[data-program]");
    if (!programCell) return;

    const scholarProgram = programCell.getAttribute("data-program").toUpperCase();

    if (["ELEMENTARY", "HIGHSCHOOL", "COLLEGE"].includes(scholarProgram)) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}

// New function to update the label/header in Scholars section dynamically
function updateScholarsLabel(program) {
  const label = document.getElementById("scholarsLabel");
  if (!label) return;

  let text = "All Scholars"; // default

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
      lucide.createIcons(); // re-render icons
    }
  }

  navLinks.forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // Handle active classes
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

      // Show/hide Section Logic
      const sectionId = this.getAttribute("data-section-id");
      if (sectionId) {
        allSections.forEach(sec => sec.classList.add("hidden"));
        const target = document.getElementById(sectionId);
        if (target) target.classList.remove("hidden");
      }

      // Get program attribute (ALL, EDSP, ODSP, ELAP)
      const program = this.getAttribute("data-program");

      // Filter scholars if in scholars-section
      if (sectionId === "scholars-section") {
        if (program === "ALL") {
          showAllScholars();
        } else if (program === "EDSP") {
          filterEDSPScholars();
        } else if (program === "ODSP") {
          filterODSPScholars();
        } else if (program === "ELAP") {
          filterELAPScholars();
        }
        updateScholarsLabel(program); // update label here
      }

      // Update topbar (only if not submenu)
      if (!this.closest(".dropdown-menu")) {
        const title = this.getAttribute("data-title");
        const icon = this.getAttribute("data-icon");
        if (title && icon) {
          updateTopbarTitleAndIcon(title, icon);
          bindProfileDropdown();
        }
      } else {
        // If submenu clicked, keep topbar as "Scholars"
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

      // Show/hide Section from toggle (e.g., Scholars)
      const sectionId = this.getAttribute("data-section-id");
      if (sectionId) {
        allSections.forEach(sec => sec.classList.add("hidden"));
        const target = document.getElementById(sectionId);
        if (target) target.classList.remove("hidden");

        // Show all scholars if Scholars main toggle clicked
        if (sectionId === "scholars-section") {
          showAllScholars();
          updateScholarsLabel("ALL"); // Also update label here on toggle
        }
      }
    });
  });
}

function bindDashboardCardClicks() {
  const scholarsCard = document.getElementById("goToScholars");
  const disbursementCard = document.getElementById("goToDisbursement");
  const graduatesCard = document.getElementById("goToGraduates");  // new
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

function populateYearSelect() {
  const yearSelect = document.getElementById('year');
  if (!yearSelect) return;

  const startYear = 2025;
  const currentYear = new Date().getFullYear();

  let options = `<option value="${startYear}">${startYear}</option>`;

  for (let year = startYear + 1; year <= currentYear; year++) {
    options += `<option value="${year}">${year}</option>`;
  }

  yearSelect.innerHTML = options;
}

let barChartInstance;

const yearlyData = {
  2023: {
    EDSP: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ODSP: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ELAP: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  },
  2024: {
    EDSP: [10, 11, 9, 14, 12, 13, 9, 8, 10, 12, 11, 13],
    ODSP: [6, 7, 8, 9, 7, 6.5, 7, 8, 9, 10, 8, 9],
    ELAP: [4, 5, 3.5, 4.5, 4, 3, 4, 3.5, 4, 3.8, 4.2, 5]
  },
  2025: { // example all zero data for testing No Data
    EDSP: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ODSP: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ELAP: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  }
};

function createBarChart() {
  const ctx = document.getElementById('barChart');
  if (!ctx) return;

  const year = document.getElementById('year')?.value || '2025';
  let data = yearlyData[year];

  if (!data) {
    // fallback zero data to show "No Data"
    data = {
      EDSP: Array(12).fill(0),
      ODSP: Array(12).fill(0),
      ELAP: Array(12).fill(0)
    };
  }

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
          backgroundColor: '#1E3A8A',
          borderRadius: 6
        },
        {
          label: 'ODSP',
          data: data.ODSP,
          backgroundColor: '#DC2626',
          borderRadius: 6
        },
        {
          label: 'ELAP',
          data: data.ELAP,
          backgroundColor: '#0F766E',
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

function updateBarChartData() {
  const year = document.getElementById('year')?.value || '2025';
  if (!barChartInstance) return;

  let data = yearlyData[year];
  if (!data) {
    // fallback zero data to show "No Data"
    data = {
      EDSP: Array(12).fill(0),
      ODSP: Array(12).fill(0),
      ELAP: Array(12).fill(0)
    };
  }

  barChartInstance.data.datasets[0].data = data.EDSP;
  barChartInstance.data.datasets[1].data = data.ODSP;
  barChartInstance.data.datasets[2].data = data.ELAP;
  barChartInstance.update();
}

// Sample data
const programGenderData = {
  EDSP: { male: 1, female: 5 },
  ODSP: { male: 0, female: 0 },
  ELAP: { male: 0, female: 0 }
};

let genderChart;

function updateGenderChart() {
  const selectedProgram = document.getElementById('programSelect')?.value || 'ALL';

  let maleCount = 0;
  let femaleCount = 0;

  if (programGenderData && Object.keys(programGenderData).length > 0) {
    if (selectedProgram === 'ALL') {
      for (const program in programGenderData) {
        maleCount += programGenderData[program]?.male || 0;
        femaleCount += programGenderData[program]?.female || 0;
      }
    } else {
      maleCount = programGenderData[selectedProgram]?.male || 0;
      femaleCount = programGenderData[selectedProgram]?.female || 0;
    }
  }

  const total = maleCount + femaleCount;

  const data = {
    labels: ['Male', 'Female'],
    datasets: [{
      data: [maleCount, femaleCount],
      backgroundColor: ['#1E3A8A', '#DC2626'],
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

  // Fixed plugin to center "No Data" text
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

  const genderCtx = document.getElementById('pieChart').getContext('2d');
  genderChart = new Chart(genderCtx, {
    type: 'doughnut',
    data,
    options,
    plugins: [noDataPlugin]
  });
}

updateGenderChart();


const recentScholars = [
  //{ name: "Juan Dela Cruz", program: "EDSP", date: "July 19, 2025" },
]; // or add sample data to test

// Example with data:
// const recentScholars = [
//   { name: "Juan Dela Cruz", program: "EDSP", date: "July 19, 2025" },
//   { name: "Maria Santos", program: "ODSP", date: "July 18, 2025" },
// ];

function updateRecentScholars() {
  const list = document.getElementById('recent-scholars-list');
  list.innerHTML = ''; // Clear existing content

  if (recentScholars.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'No recent scholars available';
    li.classList.add('no-hover'); //
    li.style.textAlign = 'center';
    li.style.fontStyle = 'italic';
    li.style.color = '#888';
    list.appendChild(li);
    return;
  }

  recentScholars.forEach(scholar => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="scholar-info">
        <strong>${scholar.name}</strong>
        <span>${scholar.program}</span>
      </div>
      <span class="date">${scholar.date}</span>
    `;
    list.appendChild(li);
  });
}

function bindScholarSearch() {
  const searchInput = document.querySelector('.search-bar');
  const scholarTableBody = document.getElementById('scholar-table-body');
  const paginationShowing = document.getElementById('pagination-showing');

  if (!searchInput || !scholarTableBody || !paginationShowing) return;

  searchInput.addEventListener('keyup', () => {
    const searchTerm = searchInput.value.toLowerCase().trim();
    let visibleCount = 0;

    Array.from(scholarTableBody.rows).forEach(row => {
      const nameCell = row.cells[3]; // full name cell (Lastname Firstname Middlename)
      if (!nameCell) return;

      const fullName = nameCell.textContent.trim().toLowerCase();
      const nameParts = fullName.split(/\s+/);

      // Extract parts safely
      const lastName = nameParts[0] || "";
      const firstName = nameParts[1] || "";
      const middleName = nameParts[2] || "";

      let showRow = false;

      if (lastName.includes(searchTerm)) {
        showRow = true;
      } else if (firstName.includes(searchTerm)) {
        showRow = true;
      } else if (middleName.includes(searchTerm)) {
        showRow = true;
      }

      row.style.display = showRow ? "" : "none";

      if (showRow) visibleCount++;
    });

    const totalRows = scholarTableBody.rows.length;
    paginationShowing.textContent = `Showing: ${visibleCount} of ${totalRows}`;
  });
}


function bindFilterDropdownToggle() {
  const filterBtn = document.getElementById('filterBtn');
  const filterDropdown = document.getElementById('filter-dropdown');

  if (!filterBtn || !filterDropdown) return;

  filterBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    filterDropdown.classList.toggle('hidden');
  });

  document.addEventListener('click', () => {
    if (!filterDropdown.classList.contains('hidden')) {
      filterDropdown.classList.add('hidden');
    }
  });

  filterDropdown.addEventListener('click', (e) => {
    e.stopPropagation();
  });
}




/*
document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons(); // Initialize Lucide icons
  bindProfileDropdown();     // ✅ Initial bind
  bindSidebarNav();          // ✅ Sidebar logic
  bindDashboardCards(); // ✅ Bind dashboard cards
  createBarChart(); // ✅ Create bar chart
  updateGenderChart(); //
  updateRecentScholars(); // ✅ Update recent scholars
});

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
      lucide.createIcons(); // re-render icons
    }
  }

  navLinks.forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // 🔁 Handle active classes
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

      // 🔁 Show/Hide Section Logic
      const sectionId = this.getAttribute("data-section-id");
      if (sectionId) {
        allSections.forEach(sec => sec.classList.add("hidden"));
        const target = document.getElementById(sectionId);
        if (target) target.classList.remove("hidden");
      }

      // 🔁 Update topbar (only if not submenu)
      if (!this.closest(".dropdown-menu")) {
        const title = this.getAttribute("data-title");
        const icon = this.getAttribute("data-icon");
        if (title && icon) {
          updateTopbarTitleAndIcon(title, icon);
          bindProfileDropdown();
        }
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

      // 🔁 Show/Hide Section from toggle (e.g., Scholars)
      const sectionId = this.getAttribute("data-section-id");
      if (sectionId) {
        allSections.forEach(sec => sec.classList.add("hidden"));
        const target = document.getElementById(sectionId);
        if (target) target.classList.remove("hidden");
      }
    });
  });
}

function bindDashboardCards() {
  const allSections = document.querySelectorAll(".page-section");
  const cards = [
    {
      id: "goToScholars",
      section: "scholars-section",
      title: "Scholars",
      icon: "users",
      sidebarTitle: "Scholars",
      isDropdown: true // 📌 mark this as dropdown
    },
    {
      id: "goToDisbursement",
      section: "disbursement-section",
      title: "Disbursement",
      icon: "wallet",
      sidebarTitle: "Disbursement"
    },
    {
      id: "goToGraduates",
      section: "graduates-section",
      title: "Graduates",
      icon: "graduation-cap",
      sidebarTitle: "Graduates"
    }
  ];

  cards.forEach(card => {
    const el = document.getElementById(card.id);
    if (!el) return;

    el.addEventListener("click", () => {
      // Hide all sections
      allSections.forEach(sec => sec.classList.add("hidden"));

      // Show selected section
      const target = document.getElementById(card.section);
      if (target) target.classList.remove("hidden");

      // Update topbar icon & title
      const iconElement = document.getElementById("sectionIcon");
      const titleElement = document.getElementById("sectionTitleText");
      if (iconElement && titleElement) {
        iconElement.setAttribute("data-lucide", card.icon);
        titleElement.textContent = card.title;
        lucide.createIcons(); // Re-render Lucide icon
      }

      // Reset all sidebar links
      document.querySelectorAll(".nav-link, .dropdown-toggle").forEach(link => link.classList.remove("active"));
      document.querySelectorAll(".dropdown-menu").forEach(menu => menu.classList.remove("show"));
      document.querySelectorAll(".chevron-icon").forEach(chev => chev.classList.remove("rotate"));

      // Activate the correct sidebar item
      const sidebarLink = document.querySelector(`[data-title="${card.sidebarTitle}"]`);
      if (sidebarLink) {
        sidebarLink.classList.add("active");

        // 👇 If it's a dropdown (like Scholars), open the submenu
       if (card.isDropdown) {
        const dropdown = sidebarLink.closest('.dropdown');
        const toggle = dropdown.querySelector('.dropdown-toggle');
        if (dropdown) dropdown.classList.add('open');
        if (toggle) toggle.classList.add('active');
      }
      }

      // Re-bind profile dropdown if needed
      bindProfileDropdown();
    });
  });
}

let barChartInstance;
const yearlyData = {
  2023: {
    EDSP: [10, 11, 9, 14, 12, 13, 9, 8, 10, 12, 11, 13],
    ODSP: [6, 7, 8, 9, 7, 6.5, 7, 8, 9, 10, 8, 9],
    ELAP: [4, 5, 3.5, 4.5, 4, 3, 4, 3.5, 4, 3.8, 4.2, 5]
  },
  2024: {
    EDSP: [12, 15, 10, 18, 14, 17, 10, 11, 12, 13, 14, 15],
    ODSP: [8, 7, 9, 11, 9.5, 10, 11, 8, 9, 10, 12, 13],
    ELAP: [5, 6, 4.5, 7, 7.5, 6.8, 5, 4, 6, 5, 7, 8]
  }
};

function createBarChart() {
  const ctx = document.getElementById('barChart');
  if (!ctx) return;

  const year = document.getElementById('year')?.value || '2025';
  const data = yearlyData[year];

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
          backgroundColor: '#1E3A8A',
          borderRadius: 6
        },
        {
          label: 'ODSP',
          data: data.ODSP,
          backgroundColor: '#DC2626',
          borderRadius: 6
        },
        {
          label: 'ELAP',
          data: data.ELAP,
          backgroundColor: '#0F766E',
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
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
      interaction: {
        mode: 'index',
        intersect: false
      },
      scales: {
        y: {
          display: true,
          grid: {
            display: true,
            color: '#e0e0e0'
          },
          ticks: {
            display: false
          }
        }
      }
    }
  });
}

function updateBarChartData() {
  const year = document.getElementById('year')?.value || '2025';
  if (!barChartInstance || !yearlyData[year]) return;

  const data = yearlyData[year];
  barChartInstance.data.datasets[0].data = data.EDSP;
  barChartInstance.data.datasets[1].data = data.ODSP;
  barChartInstance.data.datasets[2].data = data.ELAP;
  barChartInstance.update();
}

// Sample data
const programGenderData = {
  EDSP: { male: 1, female: 5 },
  ODSP: { male: 0, female: 0 },
  ELAP: { male: 0, female: 0 }
};

let genderChart;

function updateGenderChart() {
  const selectedProgram = document.getElementById('programSelect')?.value || 'ALL';

  let maleCount = 0;
  let femaleCount = 0;

  if (programGenderData && Object.keys(programGenderData).length > 0) {
    if (selectedProgram === 'ALL') {
      for (const program in programGenderData) {
        maleCount += programGenderData[program]?.male || 0;
        femaleCount += programGenderData[program]?.female || 0;
      }
    } else {
      maleCount = programGenderData[selectedProgram]?.male || 0;
      femaleCount = programGenderData[selectedProgram]?.female || 0;
    }
  }

  const total = maleCount + femaleCount;

  const data = {
    labels: ['Male', 'Female'],
    datasets: [{
      data: [maleCount, femaleCount],
      backgroundColor: ['#1E3A8A', '#DC2626'],
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

  // Fixed plugin to center "No Data" text
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

  const genderCtx = document.getElementById('pieChart').getContext('2d');
  genderChart = new Chart(genderCtx, {
    type: 'doughnut',
    data,
    options,
    plugins: [noDataPlugin]
  });
}

updateGenderChart();


const recentScholars = [
  //{ name: "Juan Dela Cruz", program: "EDSP", date: "July 19, 2025" },
]; // or add sample data to test

// Example with data:
// const recentScholars = [
//   { name: "Juan Dela Cruz", program: "EDSP", date: "July 19, 2025" },
//   { name: "Maria Santos", program: "ODSP", date: "July 18, 2025" },
// ];

function updateRecentScholars() {
  const list = document.getElementById('recent-scholars-list');
  list.innerHTML = ''; // Clear existing content

  if (recentScholars.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'No recent scholars available';
    li.classList.add('no-hover'); //
    li.style.textAlign = 'center';
    li.style.fontStyle = 'italic';
    li.style.color = '#888';
    list.appendChild(li);
    return;
  }

  recentScholars.forEach(scholar => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="scholar-info">
        <strong>${scholar.name}</strong>
        <span>${scholar.program}</span>
      </div>
      <span class="date">${scholar.date}</span>
    `;
    list.appendChild(li);
  });
}

function initScholarsFilter() {
    const tableBody = document.getElementById("scholar-table-body");
    const scholarRows = tableBody ? tableBody.querySelectorAll("tr") : [];

    const scholarLinks = document.querySelectorAll('.nav-link[data-program]');

    if (!tableBody || scholarRows.length === 0 || scholarLinks.length === 0) {
        console.warn("Scholars filter: No table or rows found.");
        return;
    }

    scholarLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const program = this.getAttribute("data-program");

            scholarRows.forEach(row => {
                const programCell = row.cells[5];
                if (!programCell) return;

                if (program === "All" || programCell.textContent.trim() === program) {
                    row.style.display = "";
                } else {
                    row.style.display = "none";
                }
            });
        });
    });
}

document.addEventListener("click", function (e) {
    const link = e.target.closest(".nav-link");
    if (!link) return;

    const program = link.dataset.program || "ALL";
    const file = link.dataset.file;

    if (file === "scholars.html") {
        // Load the HTML
        fetch(file)
            .then(res => res.text())
            .then(html => {
                document.querySelector("#main-content").innerHTML = html;

                // After content loads, apply filter
                applyScholarFilter(program);
            });
    }
});

function applyScholarFilter(program) {
    const table = document.querySelector("#scholars-table");
    if (!table) return;

    const rows = table.querySelectorAll("tbody tr");

    rows.forEach(row => {
        const programCell = row.querySelector("td:nth-child(2)"); // adjust index to your "Program" column
        if (!programCell) return;

        const programText = programCell.textContent.trim().toUpperCase();

        if (program === "ALL") {
            row.style.display = "";
        } else if (program === "EDSP" && (programText === "EDSP1" || programText === "EDSP2")) {
            row.style.display = "";
        } else if (program === "ODSP" && (programText === "ODSP1" || programText === "ODSP2")) {
            row.style.display = "";
        } else if (program === "ELAP" && ["ELEMENTARY", "HIGHSCHOOL", "COLLEGE"].includes(programText)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}












/*

document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons(); // Initialize Lucide icons
  bindProfileDropdown();
  bindSidebarNav();

  // Load default view (Dashboard)
  loadSection('dashboard.html', 'Dashboard', 'layout-grid');
});


function bindSidebarNav() {
  const navLinks = document.querySelectorAll('.nav-link, .dropdown-toggle');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      // Remove 'active' class from all links
      navLinks.forEach(l => l.classList.remove('active'));

      // Add 'active' class to clicked link
      link.classList.add('active');

      // Load the section
      const file = link.getAttribute('data-file');
      const title = link.getAttribute('data-title');
      const icon = link.getAttribute('data-icon');

      if (file && title && icon) {
        loadSection(file, title, icon);
      }
    });
  });
}

function loadSection(sectionFile, title, iconName) {
  fetch(`/frontend/sections/${sectionFile}`)
    .then(res => res.text())
    .then(html => {
      document.getElementById('main-content').innerHTML = html;
      setActiveSection(title, iconName);
      bindProfileDropdown();
      

      // ✅ Add this to bind dashboard cards only when dashboard is loaded
      if (sectionFile === 'dashboard.html') {
        bindDashboardCardClicks();
        createBarChart(); // ✅ call this after content is inserted
        updateGenderChart(); // ✅ call this after content is inserted
        updateRecentScholars(); // ✅ call this after content is inserted
      }

      // 👇 Add this for scholars section
      if (sectionFile === 'scholars.html') {
        bindScholarSearch();
        bindProgramFilterButton();
        bindAddScholarLogic();
      }
    })
    .catch(err => {
      console.error(`Failed to load ${sectionFile}:`, err);
    });
}

function setActiveSection(title, iconName) {
  const sectionTitle = document.getElementById('sectionTitleText');
  const sectionIcon = document.getElementById('sectionIcon');

  if (sectionTitle) sectionTitle.textContent = title;

  if (sectionIcon) {
    sectionIcon.setAttribute('data-lucide', iconName);
    lucide.createIcons();
  }
}

function bindDashboardCardClicks() {
  const scholarsCard = document.getElementById('goToScholars');
  const disbursementCard = document.getElementById('goToDisbursement');
  const graduatesCard = document.getElementById('goToGraduates');

  const clearSidebarActive = () => {
    document.querySelectorAll('.nav-link, .dropdown-toggle').forEach(link => link.classList.remove('active'));
    document.querySelectorAll('.dropdown-menu').forEach(menu => menu.classList.remove('show'));
    const chevron = document.querySelector('.chevron-icon');
    if (chevron) chevron.classList.remove('rotate');
  };

  if (scholarsCard) {
    scholarsCard.addEventListener('click', () => {
      loadSection('scholars.html', 'Scholars', 'users');
      clearSidebarActive();
      const scholarsToggle = document.querySelector('.dropdown-toggle');
      const dropdownMenu = document.querySelector('.dropdown-menu');
      const chevronIcon = document.querySelector('.chevron-icon');
      if (scholarsToggle) scholarsToggle.classList.add('active');
      if (dropdownMenu) dropdownMenu.classList.add('show');
      if (chevronIcon) chevronIcon.classList.add('rotate');
    });
  }

  if (disbursementCard) {
    disbursementCard.addEventListener('click', () => {
      loadSection('disbursement.html', 'Disbursement', 'wallet');
      clearSidebarActive();
      const disbursementLink = document.querySelector('.nav-link[data-title="Disbursement"]');
      if (disbursementLink) disbursementLink.classList.add('active');
    });
  }

  if (graduatesCard) {
    graduatesCard.addEventListener('click', () => {
      loadSection('graduates.html', 'Graduates', 'graduation-cap');
      clearSidebarActive();
      const graduatesLink = document.querySelector('.nav-link[data-title="Graduates"]');
      if (graduatesLink) graduatesLink.classList.add('active');
    });
  }
}

let barChartInstance;
const yearlyData = {
  2023: {
    EDSP: [10, 11, 9, 14, 12, 13, 9, 8, 10, 12, 11, 13],
    ODSP: [6, 7, 8, 9, 7, 6.5, 7, 8, 9, 10, 8, 9],
    ELAP: [4, 5, 3.5, 4.5, 4, 3, 4, 3.5, 4, 3.8, 4.2, 5]
  },
  2024: {
    EDSP: [12, 15, 10, 18, 14, 17, 10, 11, 12, 13, 14, 15],
    ODSP: [8, 7, 9, 11, 9.5, 10, 11, 8, 9, 10, 12, 13],
    ELAP: [5, 6, 4.5, 7, 7.5, 6.8, 5, 4, 6, 5, 7, 8]
  }
};

function createBarChart() {
  const ctx = document.getElementById('barChart');
  if (!ctx) return;

  const year = document.getElementById('year')?.value || '2025';
  const data = yearlyData[year];

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
          backgroundColor: '#1E3A8A',
          borderRadius: 6
        },
        {
          label: 'ODSP',
          data: data.ODSP,
          backgroundColor: '#DC2626',
          borderRadius: 6
        },
        {
          label: 'ELAP',
          data: data.ELAP,
          backgroundColor: '#0F766E',
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
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
      interaction: {
        mode: 'index',
        intersect: false
      },
      scales: {
        y: {
          display: true,
          grid: {
            display: true,
            color: '#e0e0e0'
          },
          ticks: {
            display: false
          }
        }
      }
    }
  });
}

function updateBarChartData() {
  const year = document.getElementById('year')?.value || '2025';
  if (!barChartInstance || !yearlyData[year]) return;

  const data = yearlyData[year];
  barChartInstance.data.datasets[0].data = data.EDSP;
  barChartInstance.data.datasets[1].data = data.ODSP;
  barChartInstance.data.datasets[2].data = data.ELAP;
  barChartInstance.update();
}

const programGenderData = {
  EDSP: { male: 30, female: 20 },
  ODSP: { male: 15, female: 15 },
  ELAP: { male: 8, female: 12 }
};

let genderChart;

function updateGenderChart() {
  const selectedProgram = document.getElementById('programSelect')?.value || 'ALL';

  let maleCount = 0;
  let femaleCount = 0;

  if (selectedProgram === 'ALL') {
    for (const program in programGenderData) {
      maleCount += programGenderData[program].male;
      femaleCount += programGenderData[program].female;
    }
  } else {
    maleCount = programGenderData[selectedProgram].male;
    femaleCount = programGenderData[selectedProgram].female;
  }

  const total = maleCount + femaleCount;

  const data = {
    labels: ['Male', 'Female'],
    datasets: [{
      data: [maleCount, femaleCount],
      backgroundColor: ['#1E3A8A', '#DC2626'],
      borderWidth: 1
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { top: 0, bottom: 0 }
    },
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

  if (genderChart) genderChart.destroy();

  const genderCtx = document.getElementById('pieChart').getContext('2d');
  genderChart = new Chart(genderCtx, {
    type: 'doughnut',
    data,
    options
  });
}

const recentScholars = [
  //{ name: "Juan Dela Cruz", program: "EDSP", date: "July 19, 2025" },
]; // or add sample data to test

// Example with data:
// const recentScholars = [
//   { name: "Juan Dela Cruz", program: "EDSP", date: "July 19, 2025" },
//   { name: "Maria Santos", program: "ODSP", date: "July 18, 2025" },
// ];

function updateRecentScholars() {
  const list = document.getElementById('recent-scholars-list');
  list.innerHTML = ''; // Clear existing content

  if (recentScholars.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'No recent scholars available';
    li.classList.add('no-hover'); //
    li.style.textAlign = 'center';
    li.style.fontStyle = 'italic';
    li.style.color = '#888';
    list.appendChild(li);
    return;
  }

  recentScholars.forEach(scholar => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="scholar-info">
        <strong>${scholar.name}</strong>
        <span>${scholar.program}</span>
      </div>
      <span class="date">${scholar.date}</span>
    `;
    list.appendChild(li);
  });
}

// scholars js 

function bindScholarSearch() {
  const searchInput = document.querySelector('.search-bar');
  const tableBody = document.getElementById('scholar-table-body');

  if (!searchInput || !tableBody) return;

  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const rows = tableBody.querySelectorAll('tr');

    rows.forEach(row => {
      const nameCell = row.children[3]; // 4th column = "Name of Scholar"
      if (!nameCell) return;

      const fullName = nameCell.textContent.trim();
      const lastName = fullName.split(' ')[0]?.toLowerCase(); // Get first word as last name

      row.style.display = lastName && lastName.includes(searchTerm) ? '' : 'none';
    });

    updateScholarPagination(); // Optional: adjust pagination stats
  });
}

function bindProgramFilterButton() {
  const filterBtn = document.querySelector('.filter-btn');
  const panel = document.getElementById('program-filter-panel');
  const programSelect = document.getElementById('program-select');
  const subprogramSelect = document.getElementById('subprogram-select');
  const applyBtn = document.getElementById('apply-program-filter');

  if (!filterBtn || !panel || !programSelect || !subprogramSelect || !applyBtn) return;

  const subprogramOptions = {
    EDSP: ['EDSP1', 'EDSP2'],
    ODSP: ['ODSP1', 'ODSP2'],
    ELAP: ['ELEMENTARY', 'HIGHSCHOOL', 'COLLEGE']
  };

  let shouldIgnoreNextClick = false;

  // Toggle the panel when filter button is clicked
  filterBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    panel.classList.toggle('hidden');
  });

  // Update subprogram options based on selected program
  programSelect.addEventListener('change', () => {
    const selected = programSelect.value;
    subprogramSelect.innerHTML = '';

    if (selected === 'All') {
      subprogramSelect.disabled = true;
      subprogramSelect.innerHTML = `<option value="All">All</option>`;
    } else {
      subprogramSelect.disabled = false;
      subprogramOptions[selected].forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        subprogramSelect.appendChild(opt);
      });
    }
  });

  // Apply filter and close panel
  applyBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // prevent bubbling to document
    const selectedProgram = programSelect.value;
    const selectedSub = subprogramSelect.value;

    filterScholarTable(selectedProgram, selectedSub);

    panel.classList.add('hidden');
    shouldIgnoreNextClick = true;
  });

  // Hide panel if clicking outside
  document.addEventListener('click', (e) => {
    if (shouldIgnoreNextClick) {
      shouldIgnoreNextClick = false;
      return;
    }

    const isClickInsidePanel = panel.contains(e.target);
    const isClickOnFilterBtn = filterBtn.contains(e.target);

    if (!isClickInsidePanel && !isClickOnFilterBtn) {
      panel.classList.add('hidden');
    }
  });
}


function filterScholarTable(program, subprogram) {
  const rows = document.querySelectorAll('#scholar-table-body tr');

  rows.forEach(row => {
    const prog = row.getAttribute('data-program')?.toUpperCase();
    const sub = row.getAttribute('data-subprogram')?.toUpperCase();

    const matchesProgram = (program === 'All' || prog === program);
    const matchesSub = (subprogram === 'All' || sub === subprogram.toUpperCase());

    row.style.display = matchesProgram && matchesSub ? '' : 'none';
  });

  updateScholarPagination(); // optional
}

function bindAddScholarLogic() {
  const addBtn = document.querySelector('.add-btn');
  const panel = document.getElementById('add-scholar-panel');
  const form = document.getElementById('add-scholar-form');
  const cancelBtn = document.getElementById('cancel-add');
  const tableBody = document.getElementById('scholar-table-body');

  if (!addBtn || !panel || !form || !cancelBtn || !tableBody) return;

  // Show form
  addBtn.addEventListener('click', () => {
    panel.classList.remove('hidden');
  });

  // Cancel
  cancelBtn.addEventListener('click', () => {
    panel.classList.add('hidden');
    form.reset();
  });

  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('scholar-name').value;
    const batch = document.getElementById('scholar-batch').value;
    const program = document.getElementById('scholar-program').value;

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td><input type="checkbox" class="row-checkbox"/></td>
      <td>NEW</td>
      <td>${batch}</td>
      <td>${name}</td>
      <td>—</td>
      <td>${program}</td>
      <td>—</td>
      <td>—</td>
      <td>—</td>
      <td><span class="status ongoing">Ongoing</span></td>
      <td><span class="bank">—</span></td>
      <td class="action-wrapper"><button class="action-menu-btn"><i data-lucide="more-vertical"></i></button></td>
    `;
    tableBody.appendChild(newRow);

    form.reset();
    panel.classList.add('hidden');

    lucide.createIcons(); // refresh icons
  });
}




/*
document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons(); // Initialize Lucide icons
  bindProfileDropdown();     // ✅ Initial bind
  bindSidebarNav();          // ✅ Sidebar logic
  loadSection('dashboard.html', 'Dashboard', 'layout-grid'); // default view
  bindDashboardCardClicks(); // ✅ Bind dashboard cards

  // Optional: Fill the year dropdown dynamically
  const yearSelect = document.getElementById('year');
  const currentYear = new Date().getFullYear();
  if (yearSelect) {
    for (let y = 2023; y <= currentYear; y++) {
      const opt = document.createElement('option');
      opt.value = y;
      opt.textContent = y;
      if (y == currentYear) opt.selected = true;
      yearSelect.appendChild(opt);
    }

    yearSelect.addEventListener('change', updateBarChartData);
  }
});

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

function bindSidebarNav() {
  const navLinks = document.querySelectorAll('.nav-link:not(.dropdown-toggle)');
  const dropdownToggle = document.querySelector('.dropdown-toggle');
  const dropdownMenu = document.querySelector('.dropdown-menu');
  const chevronIcon = document.querySelector('.chevron-icon');
  const submenuLinks = dropdownMenu?.querySelectorAll('a') || [];

  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      removeAllActive();
      link.classList.add('active');
      dropdownMenu?.classList.remove('show');

      const file = link.dataset.file;
      const title = link.dataset.title;
      const icon = link.dataset.icon;
      if (file && title && icon) {
        loadSection(file, title, icon);
      }
    });
  });

  if (dropdownToggle && dropdownMenu && chevronIcon) {
    dropdownToggle.addEventListener('click', e => {
      e.preventDefault();
      dropdownMenu.classList.toggle('show');
      removeAllActive();
      dropdownToggle.classList.add('active');
      loadSection('scholars.html', 'Scholars', 'users');
    });
  }

  submenuLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      submenuLinks.forEach(sublink => sublink.classList.remove('active'));
      link.classList.add('active');
      dropdownToggle.classList.add('active');
      dropdownMenu.classList.add('show');

      const file = link.dataset.file;
const program = link.dataset.program; // add this
if (file) {
  loadSection(`${file}?program=${program}`, 'Scholars', 'users');
}

    });
  });

  function removeAllActive() {
    navLinks.forEach(link => link.classList.remove('active'));
    dropdownToggle?.classList.remove('active');
    submenuLinks.forEach(link => link.classList.remove('active'));
  }
}

function loadSection(sectionFile, title, iconName) {
  const [fileOnly, query] = sectionFile.split('?');
  const params = new URLSearchParams(query);
  const selectedProgram = params.get('program');

  fetch(`/frontend/sections/${fileOnly}`)
    .then(res => res.text())
    .then(html => {
      document.getElementById('main-content').innerHTML = html;
      setActiveSection(title, iconName);
      bindProfileDropdown();

      if (fileOnly === 'dashboard.html') {
        bindDashboardCardClicks();
        createBarChart();
        updateGenderChart();
        updateRecentScholars();
      }

      // ✅ After loading scholars.html, apply program filter
      if (fileOnly === 'scholars.html') {
  if (selectedProgram) {
    filterScholarsByProgram(selectedProgram);
  } else {
    currentPage = 1;
    paginateScholars();
  }
  bindScholarsCheckboxLogic(); // only once here
  bindActionDropdowns(); // bind action dropdowns
  bindScholarSearch(); // bind search functionality
}


    })
    .catch(err => console.error(`Error loading ${sectionFile}:`, err));
}

function filterScholarsByProgram(program) {
  const rows = document.querySelectorAll('tbody tr');
  rows.forEach(row => {
    const rowProgram = row.getAttribute('data-program');
    row.style.display = rowProgram === program ? '' : 'none';
  });

  const label = document.getElementById('program-label');
  if (label) {
    label.textContent = program;
  }

  // ✅ Reset to page 1 and paginate
  currentPage = 1;
  paginateScholars();
}



function setActiveSection(title, iconName) {
  const sectionTitle = document.getElementById('sectionTitleText');
  const sectionIcon = document.getElementById('sectionIcon');

  if (sectionTitle) sectionTitle.textContent = title;

  if (sectionIcon) {
    sectionIcon.setAttribute('data-lucide', iconName);
    lucide.createIcons();
  }
}

function bindDashboardCardClicks() {
  const scholarsCard = document.getElementById('goToScholars');
  const disbursementCard = document.getElementById('goToDisbursement');
  const graduatesCard = document.getElementById('goToGraduates');

  const clearSidebarActive = () => {
    document.querySelectorAll('.nav-link, .dropdown-toggle').forEach(link => link.classList.remove('active'));
    document.querySelectorAll('.dropdown-menu').forEach(menu => menu.classList.remove('show'));
    const chevron = document.querySelector('.chevron-icon');
    if (chevron) chevron.classList.remove('rotate');
  };

  if (scholarsCard) {
    scholarsCard.addEventListener('click', () => {
      loadSection('scholars.html', 'Scholars', 'users');
      clearSidebarActive();
      const scholarsToggle = document.querySelector('.dropdown-toggle');
      const dropdownMenu = document.querySelector('.dropdown-menu');
      const chevronIcon = document.querySelector('.chevron-icon');
      if (scholarsToggle) scholarsToggle.classList.add('active');
      if (dropdownMenu) dropdownMenu.classList.add('show');
      if (chevronIcon) chevronIcon.classList.add('rotate');
    });
  }

  if (disbursementCard) {
    disbursementCard.addEventListener('click', () => {
      loadSection('disbursement.html', 'Disbursement', 'wallet');
      clearSidebarActive();
      const disbursementLink = document.querySelector('.nav-link[data-title="Disbursement"]');
      if (disbursementLink) disbursementLink.classList.add('active');
    });
  }

  if (graduatesCard) {
    graduatesCard.addEventListener('click', () => {
      loadSection('graduates.html', 'Graduates', 'graduation-cap');
      clearSidebarActive();
      const graduatesLink = document.querySelector('.nav-link[data-title="Graduates"]');
      if (graduatesLink) graduatesLink.classList.add('active');
    });
  }
}

let barChartInstance;
const yearlyData = {
  2023: {
    EDSP: [10, 11, 9, 14, 12, 13, 9, 8, 10, 12, 11, 13],
    ODSP: [6, 7, 8, 9, 7, 6.5, 7, 8, 9, 10, 8, 9],
    ELAP: [4, 5, 3.5, 4.5, 4, 3, 4, 3.5, 4, 3.8, 4.2, 5]
  },
  2024: {
    EDSP: [12, 15, 10, 18, 14, 17, 10, 11, 12, 13, 14, 15],
    ODSP: [8, 7, 9, 11, 9.5, 10, 11, 8, 9, 10, 12, 13],
    ELAP: [5, 6, 4.5, 7, 7.5, 6.8, 5, 4, 6, 5, 7, 8]
  }
};

function createBarChart() {
  const ctx = document.getElementById('barChart');
  if (!ctx) return;

  const year = document.getElementById('year')?.value || '2025';
  const data = yearlyData[year];

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
          backgroundColor: '#1E3A8A',
          borderRadius: 6
        },
        {
          label: 'ODSP',
          data: data.ODSP,
          backgroundColor: '#DC2626',
          borderRadius: 6
        },
        {
          label: 'ELAP',
          data: data.ELAP,
          backgroundColor: '#0F766E',
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
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
      interaction: {
        mode: 'index',
        intersect: false
      },
      scales: {
        y: {
          display: true,
          grid: {
            display: true,
            color: '#e0e0e0'
          },
          ticks: {
            display: false
          }
        }
      }
    }
  });
}

function updateBarChartData() {
  const year = document.getElementById('year')?.value || '2025';
  if (!barChartInstance || !yearlyData[year]) return;

  const data = yearlyData[year];
  barChartInstance.data.datasets[0].data = data.EDSP;
  barChartInstance.data.datasets[1].data = data.ODSP;
  barChartInstance.data.datasets[2].data = data.ELAP;
  barChartInstance.update();
}

const programGenderData = {
  EDSP: { male: 30, female: 20 },
  ODSP: { male: 15, female: 15 },
  ELAP: { male: 8, female: 12 }
};

let genderChart;

function updateGenderChart() {
  const selectedProgram = document.getElementById('programSelect')?.value || 'ALL';

  let maleCount = 0;
  let femaleCount = 0;

  if (selectedProgram === 'ALL') {
    for (const program in programGenderData) {
      maleCount += programGenderData[program].male;
      femaleCount += programGenderData[program].female;
    }
  } else {
    maleCount = programGenderData[selectedProgram].male;
    femaleCount = programGenderData[selectedProgram].female;
  }

  const total = maleCount + femaleCount;

  const data = {
    labels: ['Male', 'Female'],
    datasets: [{
      data: [maleCount, femaleCount],
      backgroundColor: ['#1E3A8A', '#DC2626'],
      borderWidth: 1
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { top: 0, bottom: 0 }
    },
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

  if (genderChart) genderChart.destroy();

  const genderCtx = document.getElementById('pieChart').getContext('2d');
  genderChart = new Chart(genderCtx, {
    type: 'doughnut',
    data,
    options
  });
}

const recentScholars = [
  //{ name: "Juan Dela Cruz", program: "EDSP", date: "July 19, 2025" },
]; // or add sample data to test

// Example with data:
// const recentScholars = [
//   { name: "Juan Dela Cruz", program: "EDSP", date: "July 19, 2025" },
//   { name: "Maria Santos", program: "ODSP", date: "July 18, 2025" },
// ];

function updateRecentScholars() {
  const list = document.getElementById('recent-scholars-list');
  list.innerHTML = ''; // Clear existing content

  if (recentScholars.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'No recent scholars available';
    li.classList.add('no-hover'); //
    li.style.textAlign = 'center';
    li.style.fontStyle = 'italic';
    li.style.color = '#888';
    list.appendChild(li);
    return;
  }

  recentScholars.forEach(scholar => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="scholar-info">
        <strong>${scholar.name}</strong>
        <span>${scholar.program}</span>
      </div>
      <span class="date">${scholar.date}</span>
    `;
    list.appendChild(li);
  });
}

let currentPage = 1;
const rowsPerPage = 10;

function paginateScholars() {
  const rows = Array.from(document.querySelectorAll('#scholar-table-body tr'));
  const visibleRows = rows.filter(row => row.style.display !== 'none');

  const totalPages = Math.max(1, Math.ceil(visibleRows.length / rowsPerPage));
  currentPage = Math.min(currentPage, totalPages); // prevent overflow

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;

  visibleRows.forEach((row, index) => {
    row.style.display = index >= start && index < end ? '' : 'none';
  });

  // Update UI
  document.getElementById('page-info').textContent = `${currentPage} / ${totalPages}`;
  document.getElementById('pagination-showing').textContent = `Showing: ${visibleRows.length === 0 ? 0 : Math.min(end, visibleRows.length)} of ${visibleRows.length}`;

  // Toggle buttons
  document.getElementById('prev-btn').disabled = currentPage === 1;
  document.getElementById('next-btn').disabled = currentPage === totalPages;

  bindScholarsCheckboxLogic();
}

function nextPage() {
  currentPage++;
  paginateScholars();
}

function prevPage() {
  currentPage--;
  paginateScholars();
}

function bindScholarsCheckboxLogic() {
  const selectAll = document.getElementById('select-all-scholars');
  const checkboxes = document.querySelectorAll('#scholar-table-body .row-checkbox');
  const bulkBar = document.getElementById('bulk-action-bar');
  const selectedCountEl = document.getElementById('selected-count');

  if (!selectAll || !checkboxes.length || !bulkBar) return;

  // Handle select all
  selectAll.onclick = () => {
    let count = 0;
    checkboxes.forEach(cb => {
      if (cb.closest('tr').style.display !== 'none') {
        cb.checked = selectAll.checked;
        if (cb.checked) count++;
      }
    });
    updateBulkBar(count);
  };

  // Handle individual checkbox click
  checkboxes.forEach(cb => {
    cb.onclick = () => {
      const visibleCheckboxes = Array.from(checkboxes).filter(cb => cb.closest('tr').style.display !== 'none');
      const selected = visibleCheckboxes.filter(cb => cb.checked).length;
      selectAll.checked = visibleCheckboxes.length > 0 && selected === visibleCheckboxes.length;
      updateBulkBar(selected);
    };
  });

  function updateBulkBar(count) {
    if (count > 0) {
      bulkBar.classList.remove('hidden');
    } else {
      bulkBar.classList.add('hidden');
    }
    selectedCountEl.textContent = `${count} Item${count !== 1 ? 's' : ''}`;
  }
}

function bindActionDropdowns() {
  const buttons = document.querySelectorAll(".action-menu-btn");

  buttons.forEach(btn => {
    // Clean up any previously bound handler
    if (btn._dropdownHandler) {
      btn.removeEventListener("click", btn._dropdownHandler);
    }

    const handler = (e) => {
      e.stopPropagation();

      const dropdown = document.getElementById("scholar-action-dropdown");

      // Toggle dropdown
      const isOpen = btn.dataset.dropdownOpen === "true";
      document.querySelectorAll(".action-menu-btn").forEach(b => b.dataset.dropdownOpen = "false");
      dropdown.classList.add("hidden");

      if (isOpen) return;

      // Position dropdown below the button
      const rect = btn.getBoundingClientRect();
      dropdown.style.position = "fixed";
      dropdown.style.top = `${rect.bottom + 4}px`;
      dropdown.style.left = `${rect.left - 110}px`; // Adjust if needed
      dropdown.style.zIndex = "1000";
      dropdown.classList.remove("hidden");

      btn.dataset.dropdownOpen = "true";
    };

    btn._dropdownHandler = handler;
    btn.addEventListener("click", handler);
  });

  // GLOBAL CLICK HANDLER (Only once, and doesn't remove itself)
  if (!window._scholarDropdownGlobalClickBound) {
    document.addEventListener("click", (e) => {
      const isScholarDropdown = e.target.closest("#scholar-action-dropdown");
      const isActionBtn = e.target.closest(".action-menu-btn");

      if (!isScholarDropdown && !isActionBtn) {
        document.getElementById("scholar-action-dropdown")?.classList.add("hidden");
        document.querySelectorAll(".action-menu-btn").forEach(b => b.dataset.dropdownOpen = "false");
      }
    });
    window._scholarDropdownGlobalClickBound = true; // Avoid rebinding multiple times
  }
}

function bindScholarSearch() {
  const searchInput = document.querySelector("#searchBar input");
  const scholarRows = document.querySelectorAll("#scholar-table-body tr");

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();

    scholarRows.forEach(row => {
      const nameCell = row.children[3];
      const fullName = nameCell.textContent.trim().toLowerCase();

      const lastName = fullName.split(" ")[0]; // First word = Last name

      const matches = lastName.startsWith(query);

      row.style.display = matches ? "" : "none";
    });

    updateScholarShowingCount();
  });
}

function updateScholarShowingCount() {
  const tableBody = document.getElementById("scholar-table-body");
  const allRows = Array.from(tableBody.querySelectorAll("tr"));
  const visibleRows = allRows.filter(row => row.style.display !== "none");

  const showingText = `Showing: ${visibleRows.length} of ${allRows.length}`;
  document.getElementById("pagination-showing").textContent = showingText;
}


*/

