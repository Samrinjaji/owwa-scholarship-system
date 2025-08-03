/*document.addEventListener("DOMContentLoaded", () => {
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









 /*
 document.addEventListener("DOMContentLoaded", () => {
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

  // ✅ Handle regular nav links (excluding dropdown)
  navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();

    // Remove all active states
    removeAllActive();

    // Activate clicked link
    link.classList.add('active');

    // Close Scholars dropdown if open
    dropdownMenu?.classList.remove('show');

    // ✅ Load the corresponding section
    const file = link.dataset.file;
    const title = link.dataset.title;
    const icon = link.dataset.icon;
    if (file && title && icon) {
      loadSection(file, title, icon);
    }
  });
});

  // ✅ Handle Scholars dropdown toggle
if (dropdownToggle && dropdownMenu && chevronIcon) {
  dropdownToggle.addEventListener('click', e => {
    e.preventDefault();

    // Toggle dropdown state
    dropdownMenu.classList.toggle('show');

    // Set only dropdown active
    removeAllActive();
    dropdownToggle.classList.add('active');

    // ✅ Load scholars.html when main Scholars is clicked
    loadSection('scholars.html', 'Scholars', 'users');
  });
}


 // ✅ Handle submenu clicks (EDSP, ODSP, ELAP)
submenuLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();

    // Remove active from all submenu items
    submenuLinks.forEach(sublink => sublink.classList.remove('active'));

    // Activate clicked submenu item
    link.classList.add('active');

    // Keep dropdown toggle active
    dropdownToggle.classList.add('active');

    // Keep dropdown open
    dropdownMenu.classList.add('show');

    // ✅ Load scholars.html with selected program in query
    const file = link.dataset.file;
    const program = link.dataset.program;
    if (file && program) {
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

      // ✅ If filtering scholars by program
      if (fileOnly === 'scholars.html' && selectedProgram) {
        filterScholarsByProgram(selectedProgram);

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

  // ✅ Update the label from "All" to the program
  const label = document.getElementById('program-label');
  if (label) {
    label.textContent = program;
  }
}


function setActiveSection(title, iconName) {
  const sectionTitle = document.getElementById('sectionTitleText');
  const sectionIcon = document.getElementById('sectionIcon');

  if (sectionTitle) sectionTitle.textContent = title;

  if (sectionIcon) {
    sectionIcon.setAttribute('data-lucide', iconName);
    lucide.createIcons(); // re-render the updated icon
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
  
        // Activate Scholars dropdown
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

  function updateDashboardCards() {
  const scholars = document.querySelectorAll('#scholar-table-body tr');
  
  let total = 0, edsp = 0, odsp = 0, elap = 0;

  scholars.forEach(row => {
    const program = row.getAttribute('data-program');
    total++;
    if (program === 'EDSP') edsp++;
    else if (program === 'ODSP') odsp++;
    else if (program === 'ELAP') elap++;
  });

  document.getElementById('total-scholars-count').textContent = total;
  document.getElementById('edsp-count').textContent = edsp;
  document.getElementById('odsp-count').textContent = odsp;
  document.getElementById('elap-count').textContent = elap;
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
      layout: {
      },
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

// Gender chart
// Sample gender data (replace later with dynamic ones)
const programGenderData = {
  EDSP: { male: 30, female: 20 },
  ODSP: { male: 15, female: 15 },
  ELAP: { male: 8, female: 12 }
};

// Chart instance
let genderChart;

function updateGenderChart() {
  const selectedProgram = document.getElementById('programSelect').value;

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
      padding: {
        top: 0,
        bottom: 0,
      },
    },
    plugins: {
      title: {
        display: true,
        text: selectedProgram === 'ALL'
          ? 'Gender Breakdown (All Programs)'
          : `Gender Breakdown (${selectedProgram})`,
        font: {
          size: 12,
          weight: 'bold'
        },
        position: 'bottom',
        padding: {
          top: 4
        }
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
          font: {
            size: 12
          }
        }
      }
    }
  };

  // Destroy old chart if exists
  if (genderChart) genderChart.destroy();

  // Create new pie chart
  const genderCtx = document.getElementById('pieChart').getContext('2d');
  genderChart = new Chart(genderCtx, {
    type: 'doughnut', // or 'doughnut'
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
 /*
 document.addEventListener("DOMContentLoaded", () => {
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

  // ✅ Handle regular nav links (excluding dropdown)
  navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();

    // Remove all active states
    removeAllActive();

    // Activate clicked link
    link.classList.add('active');

    // Close Scholars dropdown if open
    dropdownMenu?.classList.remove('show');

    // ✅ Load the corresponding section
    const file = link.dataset.file;
    const title = link.dataset.title;
    const icon = link.dataset.icon;
    if (file && title && icon) {
      loadSection(file, title, icon);
    }
  });
});

  // ✅ Handle Scholars dropdown toggle
if (dropdownToggle && dropdownMenu && chevronIcon) {
  dropdownToggle.addEventListener('click', e => {
    e.preventDefault();

    // Toggle dropdown state
    dropdownMenu.classList.toggle('show');

    // Set only dropdown active
    removeAllActive();
    dropdownToggle.classList.add('active');

    // ✅ Load scholars.html when main Scholars is clicked
    loadSection('scholars.html', 'Scholars', 'users');
  });
}


  // ✅ Handle submenu clicks (EDSP, ODSP, ELAP)
submenuLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();

    // Remove active from all submenu items
    submenuLinks.forEach(sublink => sublink.classList.remove('active'));

    // Activate clicked submenu item
    link.classList.add('active');

    // Keep dropdown toggle active
    dropdownToggle.classList.add('active');

    // Keep dropdown open
    dropdownMenu.classList.add('show');

    // ✅ Load submenu section, but keep topbar as "Scholars"
    const file = link.dataset.file;
    if (file) {
      loadSection(file, 'Scholars', 'users'); // always show "Scholars" in top bar
    }
  });
});


  function removeAllActive() {
    navLinks.forEach(link => link.classList.remove('active'));
    dropdownToggle?.classList.remove('active');
    submenuLinks.forEach(link => link.classList.remove('active'));
  }
}

function loadSection(sectionFile, title, iconName, program = null) {
  fetch(`/frontend/sections/${sectionFile}`)
    .then(res => res.text())
    .then(html => {
      document.getElementById('main-content').innerHTML = html;
      setActiveSection(title, iconName);
      bindProfileDropdown(); // rebind after DOM swap

      if (sectionFile === 'dashboard.html') {
        // Simulated dashboard data
        dashboardStats.totalScholars = 126;
        dashboardStats.totalFund = 530000;
        dashboardStats.totalGraduates = 38;
        recentScholars.length = 0;

        bindDashboardCardClicks();
        createBarChart();
        updateDashboardCards();
        updateGenderChart();
        updateRecentScholars();
      }

      if (sectionFile === 'scholars.html') {
        bindScholarsCheckboxLogic(); // rebind checkbox logic
        paginateScholars();

        // ✅ Apply filtering if a specific program is passed
        if (program) {
          const interval = setInterval(() => {
            const rows = document.querySelectorAll("#scholarsTable tbody tr");
            if (rows.length > 0) {
              filterByProgram(program);
              clearInterval(interval);
            }
          }, 100);
        }
      }
    })
    .catch(err => console.error(`Error loading ${sectionFile}:`, err));
}

function filterByProgram(program) {
  const rows = document.querySelectorAll("#scholarsTable tbody tr");
  rows.forEach(row => {
    const rowProgram = row.getAttribute("data-program");
    row.style.display = (rowProgram === program) ? "" : "none";
  });

  // Update topbar title
  setActiveSection(program, "users");

  // Update "Showing X of Y" if present
  const visibleCount = [...rows].filter(row => row.style.display !== "none").length;
  const showingText = document.getElementById("showingCount");
  if (showingText) {
    showingText.textContent = `Showing: ${visibleCount} of ${rows.length}`;
  }
}


function setActiveSection(title, iconName) {
  const sectionTitle = document.getElementById('sectionTitleText');
  const sectionIcon = document.getElementById('sectionIcon');

  if (sectionTitle) sectionTitle.textContent = title;

  if (sectionIcon) {
    sectionIcon.setAttribute('data-lucide', iconName);
    lucide.createIcons(); // re-render the updated icon
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
  
        // Activate Scholars dropdown
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

  // ✅ Add the update logic right here:
const dashboardStats = {
  totalScholars: 0,
  totalFund: 0,
  totalGraduates: 0
};

function updateDashboardCards() {
  const scholarElem = document.getElementById("total-scholars-count");
  if (scholarElem) scholarElem.textContent = dashboardStats.totalScholars || "0";

  const fundElem = document.getElementById("total-fund-count");
  if (fundElem) {
    fundElem.textContent = dashboardStats.totalFund > 0
      ? `₱${dashboardStats.totalFund.toLocaleString()}`
      : "₱0";
  }

  const graduatesElem = document.getElementById("total-graduates-count");
  if (graduatesElem) graduatesElem.textContent = dashboardStats.totalGraduates || "0";
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
      layout: {
      },
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

// Gender chart
// Sample gender data (replace later with dynamic ones)
const programGenderData = {
  EDSP: { male: 30, female: 20 },
  ODSP: { male: 15, female: 15 },
  ELAP: { male: 8, female: 12 }
};

// Chart instance
let genderChart;

function updateGenderChart() {
  const selectedProgram = document.getElementById('programSelect').value;

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
      padding: {
        top: 0,
        bottom: 0,
      },
    },
    plugins: {
      title: {
        display: true,
        text: selectedProgram === 'ALL'
          ? 'Gender Breakdown (All Programs)'
          : `Gender Breakdown (${selectedProgram})`,
        font: {
          size: 12,
          weight: 'bold'
        },
        position: 'bottom',
        padding: {
          top: 4
        }
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
          font: {
            size: 12
          }
        }
      }
    }
  };

  // Destroy old chart if exists
  if (genderChart) genderChart.destroy();

  // Create new pie chart
  const genderCtx = document.getElementById('pieChart').getContext('2d');
  genderChart = new Chart(genderCtx, {
    type: 'doughnut', // or 'doughnut'
    data,
    options
  });
}

const recentScholars = [
   { name: "Juan Dela Cruz", program: "EDSP", date: "July 19, 2025" },
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


function bindScholarsCheckboxLogic() {
  const selectAll = document.getElementById("select-all-scholars");

  if (!selectAll) return;

  selectAll.addEventListener("change", () => {
    const visibleCheckboxes = document.querySelectorAll("tbody tr:not([style*='display: none']) .row-checkbox");
    visibleCheckboxes.forEach(cb => cb.checked = selectAll.checked);

    handleBulkActionBarVisibility()
  });

  document.querySelectorAll(".row-checkbox").forEach(cb => {
    cb.addEventListener("change", () => {
      const visibleCheckboxes = [...document.querySelectorAll("tbody tr:not([style*='display: none']) .row-checkbox")];
      const allChecked = visibleCheckboxes.length > 0 && visibleCheckboxes.every(cb => cb.checked);
      selectAll.checked = allChecked;

      handleBulkActionBarVisibility();
    });
  });

  
}


let currentPage = 1;
const rowsPerPage = 10;

function paginateScholars() {
  const tableBody = document.getElementById("scholar-table-body");
  const rows = Array.from(tableBody.querySelectorAll("tr"));
  const totalRows = rows.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  currentPage = Math.max(1, Math.min(currentPage, totalPages));

  rows.forEach((row, index) => {
    row.style.display = (index >= (currentPage - 1) * rowsPerPage && index < currentPage * rowsPerPage)
      ? "" : "none";
  });

  const start = (currentPage - 1) * rowsPerPage + 1;
  const end = Math.min(currentPage * rowsPerPage, totalRows);

  // ✅ Your requested format:
  document.getElementById("pagination-showing").textContent = `Showing: ${end - start + 1} of ${totalRows}`;

  // Page info still works
  document.getElementById("page-info").textContent = `${currentPage} / ${totalPages || 1}`;
  document.getElementById("prev-btn").disabled = currentPage === 1;
  document.getElementById("next-btn").disabled = currentPage === totalPages || totalPages === 0;

  const selectAll = document.getElementById("select-all-scholars");
if (selectAll) {
  const visibleCheckboxes = [...document.querySelectorAll("tbody tr:not([style*='display: none']) .row-checkbox")];
  const allChecked = visibleCheckboxes.length > 0 && visibleCheckboxes.every(cb => cb.checked);
  selectAll.checked = allChecked;
}

}


function nextPage() {
  currentPage++;
  paginateScholars();
}

function prevPage() {
  currentPage--;
  paginateScholars();
}

function handleBulkActionBarVisibility() {
  const checkboxes = document.querySelectorAll(".row-checkbox");
  const bulkActionBar = document.getElementById("bulk-action-bar");
  const selectedCountEl = document.getElementById("selected-count");

  const updateVisibility = () => {
    const selectedCheckboxes = [...checkboxes].filter(cb => cb.checked);
    const count = selectedCheckboxes.length;

    if (bulkActionBar) {
      if (count > 0) {
        bulkActionBar.classList.remove("hidden");
        selectedCountEl.textContent = `${count} Item${count > 1 ? "s" : ""}`;
      } else {
        bulkActionBar.classList.add("hidden");
      }
    }
  };

  checkboxes.forEach(cb => {
    cb.addEventListener("change", updateVisibility);
  });

  // Update once on initial bind
  updateVisibility();
}


*/