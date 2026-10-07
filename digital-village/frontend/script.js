/**
 * Digital Village – Our Village, Our Pride 🌾
 * Complete Vanilla JavaScript Application Logic
 */

// Global State
const appState = {
  facilities: [],
  projects: [],
  events: [],
  gallery: [],
  currentGalleryFilter: 'All',
  lightboxIndex: 0,
  activeLightboxList: [],
  news: [],
  inquiries: [],
  countdownInterval: null,
};

// DOM Content Loaded Handler
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbar();
  initReadMore();
  initStatsCounter();
  initScrollTop();
  initContactForm();
  initAdminDashboard();
  initLightboxKeyboard();

  // Load Dynamic Data from REST APIs
  loadFacilities();
  loadProjects();
  loadEvents();
  loadGallery();
  loadNews();
});

/* ==========================================================================
   1. Theme Management (Dark / Light Mode)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('sundarpur_theme') || 'light';

  document.documentElement.setAttribute('data-theme', storedTheme);
  updateThemeIcon(storedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('sundarpur_theme', newTheme);
      updateThemeIcon(newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
    });
  }
}

function updateThemeIcon(theme) {
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (!themeToggleBtn) return;
  themeToggleBtn.innerHTML = theme === 'dark'
    ? '<i class="fa-solid fa-sun"></i>'
    : '<i class="fa-solid fa-moon"></i>';
}

/* ==========================================================================
   2. Navbar, Mobile Drawer & Active Link Highlighting
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky header shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    highlightActiveNavLink();
  });

  // Mobile menu toggle
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isActive = navMenu.classList.toggle('active');
      menuToggle.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    });

    // Close mobile menu on link click
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

function highlightActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPosition = window.scrollY + 120;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      document.querySelectorAll('.nav-link').forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

/* ==========================================================================
   3. Read More History Toggle
   ========================================================================== */
function initReadMore() {
  const readMoreBtn = document.getElementById('read-more-btn');
  const extendedSection = document.getElementById('about-extended');

  if (readMoreBtn && extendedSection) {
    readMoreBtn.addEventListener('click', () => {
      const isExpanded = extendedSection.style.display === 'block';
      if (isExpanded) {
        extendedSection.style.display = 'none';
        readMoreBtn.querySelector('span').textContent = 'Read Full History';
        readMoreBtn.querySelector('i').className = 'fa-solid fa-chevron-down toggle-icon';
        readMoreBtn.setAttribute('aria-expanded', 'false');
      } else {
        extendedSection.style.display = 'block';
        readMoreBtn.querySelector('span').textContent = 'Show Less';
        readMoreBtn.querySelector('i').className = 'fa-solid fa-chevron-up toggle-icon';
        readMoreBtn.setAttribute('aria-expanded', 'true');
      }
    });
  }
}

/* ==========================================================================
   4. Animated Statistics Counters
   ========================================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          statNumbers.forEach((counter) => {
            const target = +counter.getAttribute('data-target');
            const duration = 1800;
            const startTime = performance.now();

            const updateCount = (currentTime) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Ease out quad
              const currentVal = Math.floor(progress * target);
              counter.textContent = currentVal.toLocaleString('en-US');

              if (progress < 1) {
                requestAnimationFrame(updateCount);
              } else {
                counter.textContent = target.toLocaleString('en-US');
              }
            };
            requestAnimationFrame(updateCount);
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  const statsSection = document.getElementById('statistics');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/* ==========================================================================
   5. Dynamic Facilities Loading (Exactly 16 Cards)
   ========================================================================== */
async function loadFacilities() {
  const grid = document.getElementById('facilities-grid');
  if (!grid) return;

  try {
    const res = await fetch('/api/facilities');
    const result = await res.json();

    if (result.success && Array.isArray(result.data)) {
      appState.facilities = result.data;
      renderFacilities(result.data);
      updateAdminFacilitiesList();
    } else {
      throw new Error(result.message || 'Failed to parse facilities');
    }
  } catch (error) {
    console.warn('API fetch warning for facilities:', error.message);
    // Graceful fallback from local store
    if (appState.facilities.length > 0) {
      renderFacilities(appState.facilities);
    } else {
      grid.innerHTML = `
        <div class="loading-state">
          <p><i class="fa-solid fa-circle-exclamation"></i> Unable to load live facilities. Please refresh or check connection.</p>
        </div>
      `;
    }
  }
}

function renderFacilities(facilities) {
  const grid = document.getElementById('facilities-grid');
  if (!grid) return;

  if (facilities.length === 0) {
    grid.innerHTML = '<div class="loading-state"><p>No facilities found.</p></div>';
    return;
  }

  grid.innerHTML = facilities
    .map(
      (item, idx) => `
      <div class="facility-card glass-panel" data-id="${item.id || item._id}">
        <span class="facility-card-num">#${String(item.order || idx + 1).padStart(2, '0')}</span>
        <div class="facility-icon-wrap">
          <i class="${item.icon || 'fa-solid fa-star'}"></i>
        </div>
        <h3 class="facility-title">${escapeHTML(item.title)}</h3>
        <p class="facility-desc">${escapeHTML(item.description)}</p>
        <div class="facility-meta">
          <span><i class="fa-regular fa-clock"></i> ${escapeHTML(item.timings || 'Daily')}</span>
          <span class="facility-status">
            <i class="fa-solid fa-circle-check"></i> ${item.isAvailable !== false ? 'Operational' : 'Maintenance'}
          </span>
        </div>
      </div>
    `
    )
    .join('');
}

/* ==========================================================================
   6. Dynamic Development Projects Loading
   ========================================================================== */
async function loadProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  try {
    const res = await fetch('/api/projects');
    const result = await res.json();

    if (result.success && Array.isArray(result.data)) {
      appState.projects = result.data;
      renderProjects(result.data);
      updateAdminProjectsList();
    }
  } catch (error) {
    console.warn('Projects fetch warning:', error.message);
  }
}

function renderProjects(projects) {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  grid.innerHTML = projects
    .map((proj) => {
      const statusClass =
        proj.status === 'Completed'
          ? 'completed'
          : proj.status === 'In Progress'
          ? 'in-progress'
          : 'planning';

      return `
        <div class="project-card glass-panel" data-id="${proj.id || proj._id}">
          <div class="project-header">
            <div class="project-icon-box">
              <i class="${proj.icon || 'fa-solid fa-list-check'}"></i>
            </div>
            <span class="project-status-badge ${statusClass}">${escapeHTML(proj.status)}</span>
          </div>
          <h3 class="project-title">${escapeHTML(proj.title)}</h3>
          <p class="project-desc">${escapeHTML(proj.description)}</p>
          <div class="project-progress-wrap">
            <div class="progress-info">
              <span>Execution Progress</span>
              <strong>${proj.progress}%</strong>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" style="width: ${proj.progress}%;"></div>
            </div>
          </div>
          <div class="project-meta-row">
            <span><i class="fa-solid fa-coins"></i> Budget: ${escapeHTML(proj.budget || 'N/A')}</span>
            <span><i class="fa-solid fa-calendar"></i> Target: ${escapeHTML(proj.completionDate || '2026')}</span>
          </div>
        </div>
      `;
    })
    .join('');
}

/* ==========================================================================
   7. Dynamic Events Loading with Live Countdown Timers
   ========================================================================== */
async function loadEvents() {
  const grid = document.getElementById('events-grid');
  if (!grid) return;

  try {
    const res = await fetch('/api/events');
    const result = await res.json();

    if (result.success && Array.isArray(result.data)) {
      appState.events = result.data;
      renderEvents(result.data);
      startLiveCountdown();
      updateAdminEventsList();
    }
  } catch (error) {
    console.warn('Events fetch warning:', error.message);
  }
}

function renderEvents(events) {
  const grid = document.getElementById('events-grid');
  if (!grid) return;

  grid.innerHTML = events
    .map((evt, idx) => `
      <div class="event-card glass-panel" data-id="${evt.id || evt._id}">
        <div class="event-header">
          <span class="event-category-tag">${escapeHTML(evt.category || 'Gathering')}</span>
          <span class="event-date-badge"><i class="fa-regular fa-calendar"></i> ${escapeHTML(evt.displayDate || 'Upcoming')}</span>
        </div>
        <h3 class="event-title">${escapeHTML(evt.title)}</h3>
        <div class="event-location">
          <i class="fa-solid fa-location-dot"></i>
          <span>${escapeHTML(evt.location)}</span>
        </div>
        <p class="event-desc">${escapeHTML(evt.description)}</p>
        
        <!-- Live Countdown Component -->
        <div class="countdown-container" data-target-date="${evt.date}">
          <div class="countdown-box">
            <span class="countdown-number cd-days">00</span>
            <span class="countdown-unit">Days</span>
          </div>
          <div class="countdown-box">
            <span class="countdown-number cd-hours">00</span>
            <span class="countdown-unit">Hours</span>
          </div>
          <div class="countdown-box">
            <span class="countdown-number cd-minutes">00</span>
            <span class="countdown-unit">Mins</span>
          </div>
          <div class="countdown-box">
            <span class="countdown-number cd-seconds">00</span>
            <span class="countdown-unit">Secs</span>
          </div>
        </div>
      </div>
    `)
    .join('');
}

function startLiveCountdown() {
  if (appState.countdownInterval) {
    clearInterval(appState.countdownInterval);
  }

  const updateTimers = () => {
    const countdownElements = document.querySelectorAll('.countdown-container[data-target-date]');
    const now = new Date().getTime();

    countdownElements.forEach((container) => {
      const targetStr = container.getAttribute('data-target-date');
      const targetTime = new Date(targetStr).getTime();
      const distance = targetTime - now;

      const daysEl = container.querySelector('.cd-days');
      const hoursEl = container.querySelector('.cd-hours');
      const minutesEl = container.querySelector('.cd-minutes');
      const secondsEl = container.querySelector('.cd-seconds');

      if (distance <= 0) {
        if (daysEl) daysEl.textContent = '00';
        if (hoursEl) hoursEl.textContent = '00';
        if (minutesEl) minutesEl.textContent = '00';
        if (secondsEl) secondsEl.textContent = '00';
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
      }
    });
  };

  updateTimers();
  appState.countdownInterval = setInterval(updateTimers, 1000);
}

/* ==========================================================================
   8. Dynamic 20-Photo Gallery, Category Filtering & Lightbox Modal
   ========================================================================== */
async function loadGallery(category = 'All') {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  try {
    const url = category && category !== 'All' ? `/api/gallery?category=${category}` : '/api/gallery';
    const res = await fetch(url);
    const result = await res.json();

    if (result.success && Array.isArray(result.data)) {
      if (category === 'All') {
        appState.gallery = result.data;
      }
      appState.activeLightboxList = result.data;
      renderGallery(result.data);
      setupGalleryFilterButtons();
      updateAdminGalleryList();
    }
  } catch (error) {
    console.warn('Gallery fetch warning:', error.message);
  }
}

function renderGallery(items) {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  if (items.length === 0) {
    grid.innerHTML = '<div class="loading-state"><p>No photos found in this category.</p></div>';
    return;
  }

  grid.innerHTML = items
    .map(
      (item, idx) => `
      <div class="gallery-item glass-panel" data-index="${idx}" onclick="openLightbox(${idx})">
        <div class="gallery-item-art" style="background: linear-gradient(145deg, ${item.color || '#2d5a27'} 0%, #0d2616 100%);">
          <i class="${item.icon || 'fa-solid fa-image'} gallery-art-icon"></i>
          <div class="gallery-overlay">
            <span class="gallery-cat-badge">${escapeHTML(item.category)}</span>
            <h4 class="gallery-item-title">${escapeHTML(item.title)}</h4>
          </div>
        </div>
      </div>
    `
    )
    .join('');
}

function setupGalleryFilterButtons() {
  const buttons = document.querySelectorAll('.gallery-filters .filter-btn');
  buttons.forEach((btn) => {
    btn.onclick = () => {
      buttons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.getAttribute('data-filter');
      appState.currentGalleryFilter = category;
      loadGallery(category);
    };
  });
}

// Lightbox Open & Navigation
window.openLightbox = function (index) {
  const modal = document.getElementById('lightbox-modal');
  if (!modal || !appState.activeLightboxList[index]) return;

  appState.lightboxIndex = index;
  updateLightboxContent();

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
};

function closeLightbox() {
  const modal = document.getElementById('lightbox-modal');
  if (!modal) return;
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function updateLightboxContent() {
  const item = appState.activeLightboxList[appState.lightboxIndex];
  if (!item) return;

  const mediaEl = document.getElementById('lightbox-media');
  const catEl = document.getElementById('lightbox-category');
  const titleEl = document.getElementById('lightbox-title');
  const captionEl = document.getElementById('lightbox-caption');
  const counterEl = document.getElementById('lightbox-counter');

  if (mediaEl) {
    mediaEl.style.background = `linear-gradient(135deg, ${item.color || '#1e7a46'} 0%, #0c1a11 100%)`;
    mediaEl.innerHTML = `
      <i class="${item.icon || 'fa-solid fa-image'} art-icon"></i>
    `;
  }

  if (catEl) catEl.textContent = item.category;
  if (titleEl) titleEl.textContent = item.title;
  if (captionEl) captionEl.textContent = item.caption || item.title;
  if (counterEl) {
    counterEl.textContent = `Photo ${appState.lightboxIndex + 1} of ${appState.activeLightboxList.length}`;
  }
}

function initLightboxKeyboard() {
  const closeBtn = document.getElementById('lightbox-close');
  const backdrop = document.getElementById('lightbox-backdrop');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  if (closeBtn) closeBtn.onclick = closeLightbox;
  if (backdrop) backdrop.onclick = closeLightbox;

  if (prevBtn) {
    prevBtn.onclick = () => {
      if (appState.activeLightboxList.length === 0) return;
      appState.lightboxIndex = (appState.lightboxIndex - 1 + appState.activeLightboxList.length) % appState.activeLightboxList.length;
      updateLightboxContent();
    };
  }

  if (nextBtn) {
    nextBtn.onclick = () => {
      if (appState.activeLightboxList.length === 0) return;
      appState.lightboxIndex = (appState.lightboxIndex + 1) % appState.activeLightboxList.length;
      updateLightboxContent();
    };
  }

  document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('lightbox-modal');
    if (!modal || !modal.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft' && prevBtn) {
      prevBtn.click();
    } else if (e.key === 'ArrowRight' && nextBtn) {
      nextBtn.click();
    }
  });
}

/* ==========================================================================
   9. News & Announcements Loading
   ========================================================================== */
async function loadNews() {
  const grid = document.getElementById('news-grid');
  if (!grid) return;

  try {
    const res = await fetch('/api/news');
    const result = await res.json();

    if (result.success && Array.isArray(result.data)) {
      appState.news = result.data;
      renderNews(result.data);
      updateAdminNewsList();

      // Update ticker with top pinned news if available
      const pinned = result.data.find((n) => n.isPinned);
      if (pinned) {
        const topEl = document.getElementById('top-announcement');
        if (topEl) topEl.textContent = pinned.title;
      }
    }
  } catch (error) {
    console.warn('News fetch warning:', error.message);
  }
}

function renderNews(newsList) {
  const grid = document.getElementById('news-grid');
  if (!grid) return;

  grid.innerHTML = newsList
    .map(
      (item) => `
      <div class="news-card glass-panel ${item.isPinned ? 'pinned' : ''}" data-id="${item.id || item._id}">
        <div class="news-header">
          <span class="news-category-badge">${escapeHTML(item.category || 'News')}</span>
          <span class="news-date">${escapeHTML(item.date)}</span>
        </div>
        <h3 class="news-title">${escapeHTML(item.title)}</h3>
        <p class="news-summary">${escapeHTML(item.summary)}</p>
        <div class="news-footer">
          <span><i class="fa-solid fa-file-lines"></i> ${item.details ? 'Official Notice' : 'Notice'}</span>
        </div>
      </div>
    `
    )
    .join('');
}

/* ==========================================================================
   10. Contact & Citizen Suggestion Form Submission
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const phoneInput = document.getElementById('contact-phone');
  const categoryInput = document.getElementById('contact-category');
  const messageInput = document.getElementById('contact-message');
  const submitBtn = document.getElementById('submit-btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous error messages
    clearFormErrors();

    // Validate inputs
    let isValid = true;
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const category = categoryInput ? categoryInput.value : 'General Inquiry';
    const message = messageInput.value.trim();

    if (!name) {
      setError('name-error', 'Please enter your full name.');
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setError('email-error', 'Please enter a valid email address.');
      isValid = false;
    }

    if (!phone || phone.length < 8) {
      setError('phone-error', 'Please enter a valid phone number (at least 8 digits).');
      isValid = false;
    }

    if (!message || message.length < 5) {
      setError('message-error', 'Please write a message with at least 5 characters.');
      isValid = false;
    }

    if (!isValid) return;

    // Toggle loading state
    setButtonLoading(submitBtn, true);

    try {
      // Determine endpoint based on category
      const endpoint = category.includes('Suggestion') ? '/api/suggestions' : '/api/contact';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          category,
          subject: category,
          message,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showToast(data.message || 'Submission received successfully!', 'success');
        form.reset();
        loadInquiries();
      } else {
        throw new Error(data.message || 'Failed to submit form');
      }
    } catch (error) {
      showToast(error.message || 'Failed to connect to server. Please try again.', 'error');
    } finally {
      setButtonLoading(submitBtn, false);
    }
  });
}

function setError(elementId, message) {
  const el = document.getElementById(elementId);
  if (el) el.textContent = message;
}

function clearFormErrors() {
  document.querySelectorAll('.error-msg').forEach((el) => (el.textContent = ''));
}

function setButtonLoading(button, isLoading) {
  if (!button) return;
  const btnText = button.querySelector('.btn-text');
  const btnSpinner = button.querySelector('.btn-spinner');

  if (isLoading) {
    button.disabled = true;
    if (btnText) btnText.style.display = 'none';
    if (btnSpinner) btnSpinner.style.display = 'inline-flex';
  } else {
    button.disabled = false;
    if (btnText) btnText.style.display = 'inline-flex';
    if (btnSpinner) btnSpinner.style.display = 'none';
  }
}

/* ==========================================================================
   11. Admin Dashboard Modal & CRUD Operations
   ========================================================================== */
function initAdminDashboard() {
  const triggerBtn = document.getElementById('admin-modal-btn');
  const modal = document.getElementById('admin-modal');
  const closeBtn = document.getElementById('admin-close-btn');
  const backdrop = document.getElementById('admin-backdrop');

  if (triggerBtn && modal) {
    triggerBtn.addEventListener('click', () => {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      loadInquiries();
    });
  }

  const hideModal = () => {
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    }
  };

  if (closeBtn) closeBtn.onclick = hideModal;
  if (backdrop) backdrop.onclick = hideModal;

  // Admin Tab Switching
  const tabs = document.querySelectorAll('.admin-tab');
  const tabContents = document.querySelectorAll('.admin-tab-content');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tabContents.forEach((c) => c.classList.remove('active'));

      tab.classList.add('active');
      const targetId = tab.getAttribute('data-tab');
      const content = document.getElementById(targetId);
      if (content) content.classList.add('active');
    });
  });

  // Admin CRUD Forms initialization
  setupAdminForms();
}

function setupAdminForms() {
  // Facility Form Toggle & Submit
  const showFacBtn = document.getElementById('btn-show-add-facility');
  const cancelFacBtn = document.getElementById('btn-cancel-facility');
  const facForm = document.getElementById('form-add-facility');

  if (showFacBtn && facForm) {
    showFacBtn.onclick = () => (facForm.style.display = 'block');
    if (cancelFacBtn) cancelFacBtn.onclick = () => (facForm.style.display = 'none');

    facForm.onsubmit = async (e) => {
      e.preventDefault();
      const title = document.getElementById('fac-input-title').value.trim();
      const icon = document.getElementById('fac-input-icon').value.trim();
      const timings = document.getElementById('fac-input-timings').value.trim();
      const category = document.getElementById('fac-input-category').value.trim();
      const description = document.getElementById('fac-input-desc').value.trim();

      try {
        const res = await fetch('/api/facilities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, icon, timings, category, description }),
        });
        const data = await res.json();
        if (data.success) {
          showToast('New facility added successfully!', 'success');
          facForm.reset();
          facForm.style.display = 'none';
          loadFacilities();
        }
      } catch (err) {
        showToast('Error adding facility', 'error');
      }
    };
  }

  // Event Form Toggle & Submit
  const showEvtBtn = document.getElementById('btn-show-add-event');
  const cancelEvtBtn = document.getElementById('btn-cancel-event');
  const evtForm = document.getElementById('form-add-event');

  if (showEvtBtn && evtForm) {
    showEvtBtn.onclick = () => (evtForm.style.display = 'block');
    if (cancelEvtBtn) cancelEvtBtn.onclick = () => (evtForm.style.display = 'none');

    evtForm.onsubmit = async (e) => {
      e.preventDefault();
      const title = document.getElementById('evt-input-title').value.trim();
      const date = document.getElementById('evt-input-date').value;
      const location = document.getElementById('evt-input-location').value.trim();
      const category = document.getElementById('evt-input-category').value.trim();
      const description = document.getElementById('evt-input-desc').value.trim();

      try {
        const res = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, date, location, category, description }),
        });
        const data = await res.json();
        if (data.success) {
          showToast('Event created successfully!', 'success');
          evtForm.reset();
          evtForm.style.display = 'none';
          loadEvents();
        }
      } catch (err) {
        showToast('Error creating event', 'error');
      }
    };
  }

  // Project Form Toggle & Submit
  const showProjBtn = document.getElementById('btn-show-add-project');
  const cancelProjBtn = document.getElementById('btn-cancel-project');
  const projForm = document.getElementById('form-add-project');

  if (showProjBtn && projForm) {
    showProjBtn.onclick = () => (projForm.style.display = 'block');
    if (cancelProjBtn) cancelProjBtn.onclick = () => (projForm.style.display = 'none');

    projForm.onsubmit = async (e) => {
      e.preventDefault();
      const title = document.getElementById('proj-input-title').value.trim();
      const budget = document.getElementById('proj-input-budget').value.trim();
      const status = document.getElementById('proj-input-status').value;
      const progress = Number(document.getElementById('proj-input-progress').value);
      const description = document.getElementById('proj-input-desc').value.trim();

      try {
        const res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, budget, status, progress, description }),
        });
        const data = await res.json();
        if (data.success) {
          showToast('Project registered successfully!', 'success');
          projForm.reset();
          projForm.style.display = 'none';
          loadProjects();
        }
      } catch (err) {
        showToast('Error registering project', 'error');
      }
    };
  }

  // Gallery Form Toggle & Submit
  const showGalBtn = document.getElementById('btn-show-add-gallery');
  const cancelGalBtn = document.getElementById('btn-cancel-gallery');
  const galForm = document.getElementById('form-add-gallery');

  if (showGalBtn && galForm) {
    showGalBtn.onclick = () => (galForm.style.display = 'block');
    if (cancelGalBtn) cancelGalBtn.onclick = () => (galForm.style.display = 'none');

    galForm.onsubmit = async (e) => {
      e.preventDefault();
      const title = document.getElementById('gal-input-title').value.trim();
      const category = document.getElementById('gal-input-category').value;
      const caption = document.getElementById('gal-input-caption').value.trim();

      try {
        const res = await fetch('/api/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, category, caption }),
        });
        const data = await res.json();
        if (data.success) {
          showToast('Photo added to gallery!', 'success');
          galForm.reset();
          galForm.style.display = 'none';
          loadGallery(appState.currentGalleryFilter);
        }
      } catch (err) {
        showToast('Error adding photo', 'error');
      }
    };
  }

  // News Form Toggle & Submit
  const showNewsBtn = document.getElementById('btn-show-add-news');
  const cancelNewsBtn = document.getElementById('btn-cancel-news');
  const newsForm = document.getElementById('form-add-news');

  if (showNewsBtn && newsForm) {
    showNewsBtn.onclick = () => (newsForm.style.display = 'block');
    if (cancelNewsBtn) cancelNewsBtn.onclick = () => (newsForm.style.display = 'none');

    newsForm.onsubmit = async (e) => {
      e.preventDefault();
      const title = document.getElementById('news-input-title').value.trim();
      const category = document.getElementById('news-input-category').value;
      const summary = document.getElementById('news-input-summary').value.trim();

      try {
        const res = await fetch('/api/news', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, category, summary }),
        });
        const data = await res.json();
        if (data.success) {
          showToast('Announcement published successfully!', 'success');
          newsForm.reset();
          newsForm.style.display = 'none';
          loadNews();
        }
      } catch (err) {
        showToast('Error publishing announcement', 'error');
      }
    };
  }
}

// Admin List Renderers
function updateAdminFacilitiesList() {
  const container = document.getElementById('admin-facilities-list');
  if (!container) return;

  container.innerHTML = appState.facilities
    .map(
      (f) => `
    <div class="admin-list-item">
      <div class="admin-item-info">
        <strong>${escapeHTML(f.title)}</strong>
        <span>Category: ${escapeHTML(f.category || 'General')} • Timings: ${escapeHTML(f.timings || 'Daily')}</span>
      </div>
      <div class="admin-item-actions">
        <button class="admin-btn-delete" onclick="deleteFacility('${f.id || f._id}')">
          <i class="fa-solid fa-trash"></i> Delete
        </button>
      </div>
    </div>
  `
    )
    .join('');
}

window.deleteFacility = async function (id) {
  if (!confirm('Are you sure you want to remove this facility?')) return;
  try {
    const res = await fetch(`/api/facilities/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      showToast('Facility deleted', 'info');
      loadFacilities();
    }
  } catch (err) {
    showToast('Failed to delete facility', 'error');
  }
};

function updateAdminEventsList() {
  const container = document.getElementById('admin-events-list');
  if (!container) return;

  container.innerHTML = appState.events
    .map(
      (e) => `
    <div class="admin-list-item">
      <div class="admin-item-info">
        <strong>${escapeHTML(e.title)}</strong>
        <span>Date: ${escapeHTML(e.displayDate || e.date)} • Location: ${escapeHTML(e.location)}</span>
      </div>
      <div class="admin-item-actions">
        <button class="admin-btn-delete" onclick="deleteEvent('${e.id || e._id}')">
          <i class="fa-solid fa-trash"></i> Delete
        </button>
      </div>
    </div>
  `
    )
    .join('');
}

window.deleteEvent = async function (id) {
  if (!confirm('Cancel this event?')) return;
  try {
    const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      showToast('Event removed', 'info');
      loadEvents();
    }
  } catch (err) {
    showToast('Failed to delete event', 'error');
  }
};

function updateAdminProjectsList() {
  const container = document.getElementById('admin-projects-list');
  if (!container) return;

  container.innerHTML = appState.projects
    .map(
      (p) => `
    <div class="admin-list-item">
      <div class="admin-item-info">
        <strong>${escapeHTML(p.title)} (${p.progress}%)</strong>
        <span>Status: ${escapeHTML(p.status)} • Budget: ${escapeHTML(p.budget || 'N/A')}</span>
      </div>
      <div class="admin-item-actions">
        <button class="btn btn-sm btn-outline" onclick="toggleProjectStatus('${p.id || p._id}', '${p.status}')">
          <i class="fa-solid fa-rotate"></i> Toggle Status
        </button>
      </div>
    </div>
  `
    )
    .join('');
}

window.toggleProjectStatus = async function (id, currentStatus) {
  const nextStatus = currentStatus === 'Completed' ? 'In Progress' : 'Completed';
  const progress = nextStatus === 'Completed' ? 100 : 75;
  try {
    const res = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus, progress }),
    });
    const data = await res.json();
    if (data.success) {
      showToast(`Project updated to ${nextStatus}`, 'success');
      loadProjects();
    }
  } catch (err) {
    showToast('Failed to update project status', 'error');
  }
};

function updateAdminGalleryList() {
  const container = document.getElementById('admin-gallery-list');
  if (!container) return;

  container.innerHTML = appState.activeLightboxList
    .map(
      (g) => `
    <div class="admin-list-item">
      <div class="admin-item-info">
        <strong>${escapeHTML(g.title)}</strong>
        <span>Category: ${escapeHTML(g.category)} • ${escapeHTML(g.caption || '')}</span>
      </div>
      <div class="admin-item-actions">
        <button class="admin-btn-delete" onclick="deleteGalleryItem('${g.id || g._id}')">
          <i class="fa-solid fa-trash"></i> Delete
        </button>
      </div>
    </div>
  `
    )
    .join('');
}

window.deleteGalleryItem = async function (id) {
  if (!confirm('Delete this photo from gallery?')) return;
  try {
    const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      showToast('Photo removed', 'info');
      loadGallery(appState.currentGalleryFilter);
    }
  } catch (err) {
    showToast('Failed to delete photo', 'error');
  }
};

function updateAdminNewsList() {
  const container = document.getElementById('admin-news-list');
  if (!container) return;

  container.innerHTML = appState.news
    .map(
      (n) => `
    <div class="admin-list-item">
      <div class="admin-item-info">
        <strong>${escapeHTML(n.title)}</strong>
        <span>Category: ${escapeHTML(n.category)} • Date: ${escapeHTML(n.date)}</span>
      </div>
      <div class="admin-item-actions">
        <button class="admin-btn-delete" onclick="deleteNews('${n.id || n._id}')">
          <i class="fa-solid fa-trash"></i> Delete
        </button>
      </div>
    </div>
  `
    )
    .join('');
}

window.deleteNews = async function (id) {
  if (!confirm('Delete this news announcement?')) return;
  try {
    const res = await fetch(`/api/news/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      showToast('Announcement removed', 'info');
      loadNews();
    }
  } catch (err) {
    showToast('Failed to delete announcement', 'error');
  }
};

async function loadInquiries() {
  const container = document.getElementById('admin-inquiries-list');
  const badge = document.getElementById('inquiries-count-badge');
  if (!container) return;

  try {
    const [cntRes, sugRes] = await Promise.all([
      fetch('/api/contact').then((r) => r.json()),
      fetch('/api/suggestions').then((r) => r.json()),
    ]);

    const contacts = cntRes.data || [];
    const suggestions = sugRes.data || [];
    const all = [
      ...contacts.map((c) => ({ ...c, type: 'Contact' })),
      ...suggestions.map((s) => ({ ...s, type: 'Suggestion' })),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (badge) badge.textContent = `${all.length} Received`;

    if (all.length === 0) {
      container.innerHTML = '<p style="color: var(--text-muted); padding: 12px;">No citizen messages submitted yet.</p>';
      return;
    }

    container.innerHTML = all
      .map(
        (m) => `
      <div class="admin-list-item" style="flex-direction: column; align-items: flex-start;">
        <div style="display: flex; justify-content: space-between; width: 100%;">
          <strong>${escapeHTML(m.name)} <span style="font-size: 0.78rem; font-weight: normal; color: var(--primary);">(${escapeHTML(m.type)})</span></strong>
          <span style="font-size: 0.75rem; color: var(--text-light);">${new Date(m.createdAt).toLocaleDateString()}</span>
        </div>
        <div style="font-size: 0.8rem; color: var(--text-muted); margin: 4px 0;">
          <span><i class="fa-solid fa-envelope"></i> ${escapeHTML(m.email)}</span> | 
          <span><i class="fa-solid fa-phone"></i> ${escapeHTML(m.phone || 'N/A')}</span>
        </div>
        <p style="font-size: 0.88rem; color: var(--text-main); margin-top: 6px; background: var(--bg-alt); padding: 8px 12px; border-radius: var(--radius-sm); width: 100%;">
          ${escapeHTML(m.message)}
        </p>
      </div>
    `
      )
      .join('');
  } catch (err) {
    console.warn('Inquiries loading error:', err.message);
  }
}

/* ==========================================================================
   12. Floating Scroll-To-Top Button
   ========================================================================== */
function initScrollTop() {
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  if (!scrollTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
}

/* ==========================================================================
   13. Toast Notification Helper
   ========================================================================== */
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const iconClass =
    type === 'success'
      ? 'fa-solid fa-circle-check'
      : type === 'error'
      ? 'fa-solid fa-circle-xmark'
      : 'fa-solid fa-circle-info';

  toast.innerHTML = `
    <i class="${iconClass}"></i>
    <span>${escapeHTML(message)}</span>
  `;

  container.appendChild(toast);

  // Auto remove after 4.5 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (toast.parentElement) toast.parentElement.removeChild(toast);
    }, 300);
  }, 4500);
}

/* Helper to sanitize HTML content */
function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
