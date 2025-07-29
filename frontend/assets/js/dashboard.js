 document.addEventListener("DOMContentLoaded", () => {
    bindProfileDropdown();     // ✅ Initial bind
    bindSidebarNav();          // ✅ Sidebar logic
    loadSection('dashboard.html', 'Dashboard', 'layout-grid'); // default view
    bindDashboardCardClicks(); // ✅ Bind dashboard cards
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

function loadSection(sectionFile, title, iconName) {
  fetch(`/frontend/sections/${sectionFile}`)
    .then(res => res.text())
    .then(html => {
      document.getElementById('main-content').innerHTML = html;
      setActiveSection(title, iconName);
      bindProfileDropdown();             // rebind after DOM swap
      // ✅ Re-bind dashboard cards if loading dashboard
      if (sectionFile === 'dashboard.html') {
        bindDashboardCardClicks();
      }
    })
    .catch(err => console.error(`Error loading ${sectionFile}:`, err));
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









 
 /*

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

      // Close dropdown if open
      dropdownMenu?.classList.remove('show');
      chevronIcon?.classList.remove('rotate');
    });
  });

  // ✅ Handle Scholars dropdown toggle
  if (dropdownToggle && dropdownMenu && chevronIcon) {
    dropdownToggle.addEventListener('click', e => {
  e.preventDefault();

  // Toggle dropdown state
  dropdownMenu.classList.toggle('show');
  chevronIcon.classList.toggle('rotate');

  // Set only dropdown active
  removeAllActive();
  dropdownToggle.classList.add('active');

  // ✅ Load scholars section (EDSP by default, or general scholars)
  const file = dropdownToggle.dataset.file;
  if (file) {
    loadSection(file, 'Scholars', 'users');
  }
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

      // Optional: Keep dropdown open
      dropdownMenu.classList.add('show');
      chevronIcon.classList.add('rotate');

      // Optional: load content
      // loadSection(link.dataset.file);
    });
  });

  function removeAllActive() {
    navLinks.forEach(link => link.classList.remove('active'));
    dropdownToggle?.classList.remove('active');
    submenuLinks.forEach(link => link.classList.remove('active'));
  }
}

function loadSection(sectionFile, title, iconName) {
    fetch(`/frontend/sections/${sectionFile}`)
      .then(res => res.text())
      .then(html => {
        document.getElementById('main-content').innerHTML = html;
        setActiveSection(title, iconName);
        bindProfileDropdown();
        if (sectionFile === 'dashboard.html') {
          // ✅ Rebind click when dashboard loads
        }
      })
      .catch(err => console.error(`Failed to load ${sectionFile}:`, err));
  }

  
 /*

  

 



  

/*
f document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();
    bindProfileDropdown();     // ✅ Initial bind
    bindSidebarNav();          // ✅ Sidebar logic
    loadSection('dashboard.html', 'Dashboard', 'layout-grid');
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

      // Close dropdown if open
      dropdownMenu?.classList.remove('show');
      chevronIcon?.classList.remove('rotate');
    });
  });

  // ✅ Handle Scholars dropdown toggle
  if (dropdownToggle && dropdownMenu && chevronIcon) {
    dropdownToggle.addEventListener('click', e => {
      e.preventDefault();

      // Toggle dropdown state
      dropdownMenu.classList.toggle('show');
      chevronIcon.classList.toggle('rotate');

      // Set only dropdown active
      removeAllActive();
      dropdownToggle.classList.add('active');
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

      // Optional: Keep dropdown open
      dropdownMenu.classList.add('show');
      chevronIcon.classList.add('rotate');

      // Optional: load content
      // loadSection(link.dataset.file);
    });
  });

  function removeAllActive() {
    navLinks.forEach(link => link.classList.remove('active'));
    dropdownToggle?.classList.remove('active');
    submenuLinks.forEach(link => link.classList.remove('active'));
  }
}

  function setActiveSection(label, iconName) {
    document.getElementById('searchBar').style.display = label === "Dashboard" ? "flex" : "none";
    const titleBar = document.getElementById('sectionTitleBar');
    titleBar.style.display = label === "Dashboard" ? "none" : "flex";
    document.getElementById('sectionTitleText').textContent = label;
    document.getElementById('sectionIcon').setAttribute('data-lucide', iconName);
  
    lucide.createIcons(); // Re-render icons
  }
  
  function loadSection(sectionFile, title, iconName) {
    fetch(`/frontend/sections/${sectionFile}`)
      .then(res => res.text())
      .then(html => {
        document.getElementById('main-content').innerHTML = html;
        setActiveSection(title, iconName);
        bindProfileDropdown();
        if (sectionFile === 'dashboard.html') {
          bindDashboardCardClicks(); // ✅ Rebind click when dashboard loads
        }
      })
      .catch(err => console.error(`Failed to load ${sectionFile}:`, err));
  }
  
  // Navigation click logic
  document.querySelectorAll('.nav-link, .dropdown-toggle').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
  
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      this.classList.add('active');
  
      const parent = this.closest('.dropdown');
      if (parent) {
        parent.classList.toggle('open');
        const chevron = parent.querySelector('.chevron-icon');
        if (chevron) chevron.classList.toggle('rotate');
      } else {
        document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open'));
        document.querySelectorAll('.chevron-icon').forEach(i => i.classList.remove('rotate'));
      }
  
      const file = this.dataset.file;
      const title = this.dataset.title;
      const icon = this.dataset.icon;
  
      if (file) {
        loadSection(file, title, icon);
      }
    });
  });

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
  
  document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();
    bindProfileDropdown();     // ✅ Initial bind
    bindSidebarNav();          // ✅ Sidebar logic
    loadSection('dashboard.html', 'Dashboard', 'layout-grid');
    bindDashboardCardClicks();

    
  });
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
  document.addEventListener("DOMContentLoaded", function () {
	// Profile dropdown
	bindProfileDropdown();

	// Scholars dropdown logic
	const scholarToggle = document.querySelector(".dropdown-toggle");
	const scholarDropdown = document.querySelector(".dropdown");
	const scholarMenu = document.querySelector(".dropdown-menu");
	const chevronIcon = scholarToggle.querySelector(".chevron-icon");

	scholarToggle.addEventListener("click", function (event) {
		event.preventDefault();

		// Close other dropdowns
		document.querySelectorAll(".dropdown").forEach(drop => {
			if (drop !== scholarDropdown) {
				drop.classList.remove("open");
				const menu = drop.querySelector(".dropdown-menu");
				const icon = drop.querySelector(".chevron-icon");
				if (menu) menu.classList.remove("show");
				if (icon) icon.classList.remove("rotate");
			}
		});

		// Toggle this dropdown
		scholarDropdown.classList.toggle("open");
		scholarMenu.classList.toggle("show");
		chevronIcon.classList.toggle("rotate");

		// Mark active
		document.querySelectorAll(".nav-link, .dropdown-toggle").forEach(link => {
			link.classList.remove("active");
		});
		scholarToggle.classList.add("active");

		// Hide dashboard section
		document.getElementById("dashboard-section").classList.add("hidden");

		// Load Scholars Section
		fetch("./sections/scholars.html")
			.then(response => {
				if (!response.ok) throw new Error("Failed to load scholars section.");
				return response.text();
			})
			.then(html => {
				const mainContent = document.getElementById("main-content");
				mainContent.innerHTML = html;

				// Update top bar title
				document.getElementById("searchBar").style.display = "none";
				document.getElementById("sectionTitleBar").style.display = "flex";
				document.getElementById("sectionIcon").setAttribute("data-lucide", "users");
				document.getElementById("sectionTitleText").textContent = "Scholars";

				lucide.createIcons(); // Refresh icons
			})
			.catch(error => {
				console.error("Error loading scholars section:", error);
			});
	});
});

  
/*
// Handle scholars dropdown logic
function bindScholarsDropdown() {
	const scholarToggle = document.querySelector(".dropdown-toggle");
	const scholarDropdown = document.querySelector(".dropdown");
	const scholarMenu = document.querySelector(".dropdown-menu");

	if (!scholarToggle || !scholarDropdown || !scholarMenu) return;

	// Replace toggle to remove previous listener
	const newToggle = scholarToggle.cloneNode(true);
	scholarToggle.parentNode.replaceChild(newToggle, scholarToggle);

	// Get chevron from the new toggle
	const chevronIcon = newToggle.querySelector(".chevron-icon");

	newToggle.addEventListener("click", function (event) {
		event.preventDefault();

		const isOpen = scholarMenu.classList.contains("show");

		// Close all dropdowns
		document.querySelectorAll(".dropdown-menu").forEach(menu => {
			menu.classList.remove("show");
		});
		document.querySelectorAll(".chevron-icon").forEach(icon => {
			icon.classList.remove("rotate");
		});

		// Toggle this one
		if (!isOpen) {
			scholarMenu.classList.add("show");
			chevronIcon?.classList.add("rotate");
		}

		// Set active state
		document.querySelectorAll(".nav-link, .dropdown-toggle").forEach(link => {
			link.classList.remove("active");
		});
		newToggle.classList.add("active");

		// Load section if needed
		if (!document.getElementById("scholars-section")) {
			document.getElementById("dashboard-section")?.classList.add("hidden");

			fetch("./sections/scholars.html")
				.then(response => response.text())
				.then(html => {
					document.getElementById("main-content").innerHTML = html;

					// Top bar setup
					document.getElementById("searchBar").style.display = "none";
					document.getElementById("sectionTitleBar").style.display = "flex";
					document.getElementById("sectionIcon").setAttribute("data-lucide", "users");
					document.getElementById("sectionTitleText").textContent = "Scholars";

					lucide.createIcons();
					bindProfileDropdown();
				})
				.catch(console.error);
		}
	});
}
function bindDashboardClick() {
	const dashboardLink = document.getElementById("dashboardLink");

	if (!dashboardLink) return;

	dashboardLink.addEventListener("click", function (event) {
		event.preventDefault();

		// Remove all 'active' states from links
		document.querySelectorAll(".nav-link, .dropdown-toggle").forEach(link => {
			link.classList.remove("active");
		});
		dashboardLink.classList.add("active");

		// Hide dropdown menus and rotate icons
		document.querySelectorAll(".dropdown-menu").forEach(menu => menu.classList.remove("show"));
		document.querySelectorAll(".chevron-icon").forEach(icon => icon.classList.remove("rotate"));

		// Show Dashboard section
		document.getElementById("dashboard-section")?.classList.remove("hidden");

		// Clear dynamic content from scholars or other views
		const mainContent = document.getElementById("main-content");
		if (mainContent) {
			mainContent.innerHTML = "";
		}

		// Reset the top bar to default Dashboard view
		document.getElementById("searchBar").style.display = "block";
		document.getElementById("sectionTitleBar").style.display = "none";
	});
}



// Init on DOM load
document.addEventListener("DOMContentLoaded", function () {
	bindProfileDropdown();
	bindScholarsDropdown();
}); 
*/