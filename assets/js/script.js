lucide.createIcons();
/*
function bindProfileDropdown() {
  const dropdownToggle = document.getElementById('dropdownToggle');
  const profileDropdown = document.getElementById('profileDropdown');

  if (!dropdownToggle || !profileDropdown) return;

  // Clean up existing click handlers if any
  dropdownToggle.onclick = null;
  profileDropdown.onclick = null;

  dropdownToggle.addEventListener('click', function (e) {
    e.stopPropagation();
    const isVisible = profileDropdown.style.display === 'block';
    profileDropdown.style.display = isVisible ? 'none' : 'block';
  });

  // Prevent dropdown from closing when clicked inside
  profileDropdown.addEventListener('click', function (e) {
    e.stopPropagation();
  });

  // Close dropdown on outside click
  document.addEventListener('click', function handler() {
    profileDropdown.style.display = 'none';
  }, { once: true });
}

document.addEventListener('DOMContentLoaded', function () {
  bindProfileDropdown();
  updateGenderChart();
});

// nav interaction
function showSection(sectionId, el) {

  // Always hide profile dropdown when switching sections
if (profileDropdown) profileDropdown.style.display = 'none';

  // Remove all active states
  document.querySelectorAll('.nav-link, .dropdown-toggle, .dropdown-menu a').forEach(link => {
      link.classList.remove('active');
  });

  document.querySelectorAll('.dropdown').forEach(d => {
      d.classList.remove('open');
      d.querySelector('.dropdown-menu')?.classList.remove('show');
      d.querySelector('.chevron-icon')?.classList.remove('rotate');
      d.querySelector('.dropdown-toggle')?.classList.remove('active');
  });

  // Show the selected section only
  document.querySelectorAll('.page-section').forEach(section => {
      section.classList.add('hidden');
  });
  document.getElementById(sectionId)?.classList.remove('hidden');

  // Handle active state
  if (el) {
      el.classList.add('active');

      const dropdown = el.closest('.dropdown');
      if (dropdown) {
          dropdown.classList.add('open');
          dropdown.querySelector('.dropdown-toggle')?.classList.add('active');
          dropdown.querySelector('.dropdown-menu')?.classList.add('show');
          dropdown.querySelector('.chevron-icon')?.classList.add('rotate');
      }
  }

  // 💡 Handle topbar switch (search vs section title)
  const searchBar = document.getElementById("searchBar");
  const sectionTitleBar = document.getElementById("sectionTitleBar");
  const sectionTitleText = document.getElementById("sectionTitleText");
  const sectionIcon = document.getElementById("sectionIcon");

  if (sectionId === "dashboard-section") {
    searchBar.style.display = "flex";
    sectionTitleBar.style.display = "none";
} else {
    searchBar.style.display = "none";
    sectionTitleBar.style.display = "flex";

    // Only update topbar for main sections (not sub-sections like EDSP, ODSP, ELAP)
    let iconName = null;
    let label = null;

    switch (sectionId) {
        case "scholars-section":
            iconName = "users";
            label = "Scholars";
            break;
        case "disbursement-section":
            iconName = "wallet";
            label = "Disbursement";
            break;
        case "graduates-section":
            iconName = "graduation-cap";
            label = "Graduates";
            break;
        case "settings-section":
            iconName = "settings";
            label = "Settings";
            break;
    }

    // Only update if matched
    if (iconName && label) {
        sectionIcon.setAttribute("data-lucide", iconName);
        sectionTitleText.textContent = label;
        lucide.createIcons(); // re-render icon
        bindProfileDropdown();

    }
}


}

// nav interaction
function handleScholarsClick(e, el) {
  e.preventDefault();
  
  const dropdown = el.closest('.dropdown');
  const dropdownMenu = dropdown.querySelector('.dropdown-menu');
  const chevron = el.querySelector('.chevron-icon');
  const isOpen = dropdown.classList.contains('open');

  // Close all dropdowns and reset everything
  document.querySelectorAll('.dropdown').forEach(d => {
    d.classList.remove('open');
    d.querySelector('.dropdown-menu')?.classList.remove('show');
    d.querySelector('.chevron-icon')?.classList.remove('rotate');
    d.querySelector('.dropdown-toggle')?.classList.remove('active');
  });

  // Toggle behavior: If it was NOT open, open it
  if (!isOpen) {
    // Show section
    showSection('scholars-section', el);

    // Open dropdown
    dropdown.classList.add('open');
    dropdownMenu?.classList.add('show');
    chevron?.classList.add('rotate');
    el.classList.add('active');
  } else {
    // It was open: close it but stay on scholars section
    dropdown.classList.remove('open');
    dropdownMenu?.classList.remove('show');
    chevron?.classList.remove('rotate');
    el.classList.add('active'); // keep it active (optional)
  }
}

function navigateToScholarsFromCard() {
  const scholarsNavLink = document.querySelector('.dropdown .dropdown-toggle .toggle-left');

  if (scholarsNavLink) {
      // Simulate a click on the "Scholars" nav link to ensure dropdown works
      showSection('scholars-section', scholarsNavLink);

      // Add open class to dropdown parent
      const dropdown = scholarsNavLink.closest('.dropdown');
      if (dropdown) {
          dropdown.classList.add('open');
          dropdown.querySelector('.dropdown-toggle')?.classList.add('active');
      }
  }
}

function navigateToDisbursementFromCard() {
  const links = document.querySelectorAll('.nav-link');
  links.forEach(link => {
    if (link.textContent.includes('Disbursement')) {
      showSection('disbursement-section', link);
    }
  });
  }
  
  function navigateToGraduatesFromCard() {
  const links = document.querySelectorAll('.nav-link');
  links.forEach(link => {
    if (link.textContent.includes('Graduates')) {
      showSection('graduates-section', link);
    }
  });
  }

  // barchart area
  const ctx = document.getElementById('barChart').getContext('2d');
  const barChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ],
        datasets: [
            {
                label: 'EDSP',
                data: [12, 15, 10, 18, 14, 17, 10, 11, 12, 13, 14, 15],
                backgroundColor: '#1E3A8A',
                borderRadius: 6
            },
            {
                label: 'ODSP',
                data: [8, 7, 9, 11, 9.5, 10, 11, 8, 9, 10, 12, 13],
                backgroundColor: '#DC2626',
                borderRadius: 6
            },
            {
                label: 'ELAP',
                data: [5, 6, 4.5, 7, 7.5, 6.8, 5, 4, 6, 5, 7, 8],
                backgroundColor: '#0F766E',
                borderRadius: 6
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: {
                bottom: 20
            }
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              callbacks: {
                title: function (tooltipItems) {
                  return `Month: ${tooltipItems[0].label}`;
                },
                label: function (tooltipItem) {
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
            display: true, //  show the y-axis again
            grid: {
                display: true, //  show horizontal lines
                color: '#e0e0e0' // optional: subtle line color
            },
            ticks: {
                display: false // optional: hide the number labels
            }
        }
        
        }
    }
});

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
  },
  2025: {
    EDSP: [14, 13, 12, 15, 16, 17, 18, 17, 16, 15, 14, 13],
    ODSP: [10, 9, 11, 12, 11.5, 10, 10, 9, 10, 11, 12, 13],
    ELAP: [6, 7, 6.5, 8, 7.5, 7, 6, 5.5, 6, 7, 7.5, 8]
  }
};

window.addEventListener('DOMContentLoaded', () => {
  const yearSelect = document.getElementById('year');
  const currentYear = new Date().getFullYear();

  for (let year = 2023; year <= currentYear; year++) {
    const option = document.createElement('option');
    option.value = year;
    option.text = year;
    if (year === currentYear) {
      option.selected = true;
    }
    yearSelect.appendChild(option);
  }

  updateBarChartData(); // load initial data

  yearSelect.addEventListener('change', updateBarChartData); // 👈 move this line here
});


function updateBarChartData() {
  const selectedYear = document.getElementById('year').value;
  const data = yearlyData[selectedYear];

  if (!data) {
    alert(`No data available for ${selectedYear}`);
    return;
  }

  barChart.data.datasets[0].data = data.EDSP;
  barChart.data.datasets[1].data = data.ODSP;
  barChart.data.datasets[2].data = data.ELAP;

  barChart.update();
}

const genderCtx = document.getElementById('pieChart').getContext('2d');

// Replace with your actual scholar data
const programGenderData = {
  EDSP: { male: 30, female: 20 },
  ODSP: { male: 15, female: 15 },
  ELAP: { male: 8, female: 12 }
};

// Initial chart instance (empty)
let genderChart;

// Function to compute and update chart
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
          top: 4,
          bottom: 4 // shrink spacing between chart and title
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
          padding: 6, // reduce vertical spacing between items
          font: {
          size: 12
          }
        }
      }
    }
  };
  

  // If chart exists, destroy it before creating new
  if (genderChart) {
    genderChart.destroy();
  }

  // Create chart
  genderChart = new Chart(genderCtx, {
    type: 'doughnut',
    data: data,
    options: options
  });
}

function toggleDropdown(btn) {
  // Close all other dropdowns
  document.querySelectorAll('.dropdown-menu').forEach(menu => {
    if (menu !== btn.nextElementSibling) {
      menu.classList.add('hidden');
    }
  });

  const dropdown = btn.nextElementSibling;
  dropdown.classList.toggle('hidden');

  // Optional: Close dropdown when clicking outside
  document.addEventListener('click', function handler(e) {
    if (!btn.parentNode.contains(e.target)) {
      dropdown.classList.add('hidden');
      document.removeEventListener('click', handler);
    }
  });
}

const rowsPerPage = 10;
let currentPage = 1;

function paginateTable() {
  const tableBody = document.getElementById("scholar-table-body");
  const rows = tableBody.querySelectorAll("tr");
  const totalRows = rows.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  // Show/hide rows
  rows.forEach((row, index) => {
    if (index >= (currentPage - 1) * rowsPerPage && index < currentPage * rowsPerPage) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });

  // Update display info
  const showingStart = (currentPage - 1) * rowsPerPage + 1;
  const showingEnd = Math.min(currentPage * rowsPerPage, totalRows);

  document.getElementById("pagination-showing").textContent = `Showing: ${showingEnd} of ${totalRows}`;
  document.getElementById("page-info").textContent = `${currentPage} / ${totalPages}`;

  // Disable/enable buttons
  document.getElementById("prev-btn").disabled = currentPage === 1;
  document.getElementById("next-btn").disabled = currentPage === totalPages;
}

function nextPage() {
  const totalRows = document.querySelectorAll("#scholar-table-body tr").length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    paginateTable();
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    paginateTable();
  }
}

// Initialize pagination
window.onload = paginateTable;

// barchart
/* this is when no data display for the year
const yearSelect = document.getElementById('year');
if (yearSelect) {
  for (let year = 2023; year <= currentYear + 1; year++) {
    const option = document.createElement('option');
    option.value = year;
    option.text = year;
    if (year === currentYear) {
      option.selected = true;
    }
    yearSelect.appendChild(option);
  }

  yearSelect.addEventListener('change', updateBarChartData); // Add this line
}
*/
/*




// Initialize chart on page load
updateGenderChart();



/*
const allLinks = document.querySelectorAll('.nav-links a');
const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

allLinks.forEach(link => {
  link.addEventListener('click', function (e) {
    const isDropdown = this.classList.contains('dropdown-toggle');

    // Remove active class from ALL nav links
    allLinks.forEach(l => l.classList.remove('active'));

    // Add active class to the clicked link
    this.classList.add('active');

    // Handle dropdown toggle behavior
    if (isDropdown) {
      e.preventDefault(); // Prevent href jump
      
      const dropdownMenu = this.nextElementSibling;
      const isOpen = dropdownMenu.classList.contains('show');

      // Close all dropdown menus
      document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.classList.remove('show');
      });

      // Remove rotation from all chevrons
      document.querySelectorAll('.chevron-icon').forEach(icon => {
        icon.classList.remove('rotate');
      });

      // If the dropdown was not open, open it and rotate the chevron
      if (!isOpen) {
        dropdownMenu.classList.add('show');
        const chevronIcon = this.querySelector('.chevron-icon');
        if (chevronIcon) chevronIcon.classList.add('rotate');
      }
    } else {
      // If it's a normal link, close any open dropdowns and reset chevrons
      document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.classList.remove('show');
      });
      document.querySelectorAll('.chevron-icon').forEach(icon => {
        icon.classList.remove('rotate');
      });
    }
  });
});

// Make sub-menu links active
document.querySelectorAll('.dropdown-menu a').forEach(subLink => {
  subLink.addEventListener('click', function (e) {
    // Remove active from all links
    allLinks.forEach(link => link.classList.remove('active'));

    // Add active to the clicked sub-menu link
    this.classList.add('active');

    // Keep dropdown open and chevron rotated
    const parentDropdown = this.closest('.dropdown');
    if (parentDropdown) {
      const toggleLink = parentDropdown.querySelector('.dropdown-toggle');
      const chevronIcon = toggleLink.querySelector('.chevron-icon');

      toggleLink.classList.add('active');
      parentDropdown.querySelector('.dropdown-menu').classList.add('show');
      if (chevronIcon) chevronIcon.classList.add('rotate');
    }
  });
});

//  profile dropdown
// Get DOM elements
const dropdownToggle = document.getElementById('dropdownToggle');
const profileDropdown = document.getElementById('profileDropdown');

// Toggle dropdown on arrow click
dropdownToggle.addEventListener('click', function (e) {
  e.stopPropagation(); // Prevent closing immediately
  const isVisible = profileDropdown.style.display === 'block';
  profileDropdown.style.display = isVisible ? 'none' : 'block';
});

// Hide dropdown when clicking outside
document.addEventListener('click', function () {
  profileDropdown.style.display = 'none';
});

// Prevent closing dropdown when clicking inside it
profileDropdown.addEventListener('click', function (e) {
  e.stopPropagation();
});


// barchart

const ctx = document.getElementById('barChart').getContext('2d');

const barChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ],
        datasets: [
            {
                label: 'EDSP',
                data: [12, 15, 10, 18, 14, 17, 10, 11, 12, 13, 14, 15],
                backgroundColor: '#1E3A8A',
                borderRadius: 6
            },
            {
                label: 'ODSP',
                data: [8, 7, 9, 11, 9.5, 10, 11, 8, 9, 10, 12, 13],
                backgroundColor: '#DC2626',
                borderRadius: 6
            },
            {
                label: 'ELAP',
                data: [5, 6, 4.5, 7, 7.5, 6.8, 5, 4, 6, 5, 7, 8],
                backgroundColor: '#0F766E',
                borderRadius: 6
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: {
                bottom: 20
            }
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              callbacks: {
                title: function (tooltipItems) {
                  return `Month: ${tooltipItems[0].label}`;
                },
                label: function (tooltipItem) {
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
            display: true, // 👈 show the y-axis again
            grid: {
                display: true, // 👈 show horizontal lines
                color: '#e0e0e0' // optional: subtle line color
            },
            ticks: {
                display: false // optional: hide the number labels
            }
        }
        
        }
    }
});

// piechart

const genderCtx = document.getElementById('pieChart').getContext('2d');

  // Replace with your real data
  const programGenderData = {
    EDSP: { male: 30, female: 20 },
    ODSP: { male: 15, female: 15 },
    ELAP: { male: 8, female: 12 }
  };

  const programLabels = Object.keys(programGenderData);
  const totalPerProgram = programLabels.map(label => {
    const data = programGenderData[label];
    return data.male + data.female;
  });

  const totalAll = totalPerProgram.reduce((a, b) => a + b, 0);

  const genderChart = new Chart(genderCtx, {
    type: 'doughnut',
    data: {
      labels: programLabels,
      datasets: [{
        label: 'Scholars',
        data: totalPerProgram,
        backgroundColor: ['#1E3A8A', '#DC2626', '#0F766E'],
        borderWidth: 1
        // Removed hoverOffset
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              const program = context.label;
              const data = programGenderData[program];
              const total = data.male + data.female;
              const percentageOfAll = ((total / totalAll) * 100).toFixed(1);

              return [
                `${program}:`,
                `- Male: ${data.male}`,
                `- Female: ${data.female}`,
                `- Total: ${total} scholars (${percentageOfAll}%)`
              ];
            }
          }
        },
        legend: {
          display: false
        }
      }
    }
  });

  */