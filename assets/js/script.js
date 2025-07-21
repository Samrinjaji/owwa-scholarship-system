lucide.createIcons();


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

  function showSection(sectionId, el) {
    // Remove active states
    document.querySelectorAll('.nav-link, .dropdown-toggle, .dropdown-menu a').forEach(link => {
        link.classList.remove('active');
    });

    // Remove dropdown open state
    document.querySelectorAll('.dropdown').forEach(d => {
        d.classList.remove('open');
        d.querySelector('.dropdown-menu')?.classList.remove('show'); // ✅ hide dropdown
        d.querySelector('.chevron-icon')?.classList.remove('rotate'); // ✅ reset icon
        d.querySelector('.dropdown-toggle')?.classList.remove('active'); // remove highlight
    });

    // Show the correct section
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(sectionId)?.classList.remove('hidden');

    // Highlight active item
    if (el) {
        el.classList.add('active');

        // If inside dropdown, make parent dropdown active too
        const dropdown = el.closest('.dropdown');
        if (dropdown) {
            dropdown.classList.add('open');
            dropdown.querySelector('.dropdown-toggle')?.classList.add('active');
            dropdown.querySelector('.dropdown-menu')?.classList.add('show');
            dropdown.querySelector('.chevron-icon')?.classList.add('rotate');
        }
    }
}


function handleScholarsClick(e, el) {
  e.preventDefault();

  const dropdown = el.closest('.dropdown');
  const dropdownMenu = dropdown.querySelector('.dropdown-menu');
  const chevron = el.querySelector('.chevron-icon');

  const isOpen = dropdown.classList.contains('open');

  // Close all dropdowns and reset icons
  document.querySelectorAll('.dropdown').forEach(d => {
      d.classList.remove('open');
      d.querySelector('.dropdown-menu')?.classList.remove('show');
      d.querySelector('.chevron-icon')?.classList.remove('rotate');
      d.querySelector('.dropdown-toggle')?.classList.remove('active');
  });

  if (!isOpen) {
      // Show section
      showSection('scholars-section', el);

      // Open dropdown
      dropdown.classList.add('open');
      dropdownMenu?.classList.add('show');
      chevron?.classList.add('rotate');
      el.classList.add('active');
  }
}



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