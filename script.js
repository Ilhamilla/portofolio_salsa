document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const navItems = document.querySelectorAll('.nav-link');

  // 1. Sticky Navbar shadow on scroll
  const handleScroll = () => {
    if (window.scrollY > 12) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 2. Mobile Menu Toggle
  const closeMenu = () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navItems.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // 3. Active Navigation Highlighting on Scroll
  const sections = document.querySelectorAll('main section[id]');
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navItems.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-35% 0px -55% 0px' }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  // 4. Smooth Fade-in Animation on Scroll
  const fadeElements = document.querySelectorAll('.fade-in');
  const fadeObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  fadeElements.forEach((el) => fadeObserver.observe(el));

  // 5. Organization Filter Tabs
  const tabButtons = document.querySelectorAll('.tab-btn');
  const orgCards = document.querySelectorAll('.org-card');

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      tabButtons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      orgCards.forEach((card) => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden-card', !match);
      });
    });
  });

  // 6. Download CV Placeholder Toast & Print PDF
  const cvButtons = [
    document.getElementById('download-cv-btn'),
    document.getElementById('download-cv-mobile')
  ];
  const toast = document.getElementById('toast');
  const toastClose = document.getElementById('toast-close');
  const toastPrintBtn = document.getElementById('toast-print-btn');
  let toastTimer = null;

  const showToast = () => {
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.hidden = true;
    }, 7000);
  };

  cvButtons.forEach((btn) => {
    if (btn) {
      btn.addEventListener('click', () => {
        closeMenu();
        showToast();
      });
    }
  });

  toastClose.addEventListener('click', () => {
    toast.hidden = true;
    clearTimeout(toastTimer);
  });

  toastPrintBtn.addEventListener('click', () => {
    toast.hidden = true;
    window.print();
  });

  // 7. Contact Form Validation & Interactive Feedback
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('sender-name');
  const emailInput = document.getElementById('sender-email');
  const messageInput = document.getElementById('sender-message');
  const errorName = document.getElementById('error-name');
  const errorEmail = document.getElementById('error-email');
  const errorMessage = document.getElementById('error-message');
  const formFeedback = document.getElementById('form-feedback');

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const clearFieldError = (input, errorEl) => {
    input.classList.remove('invalid');
    errorEl.textContent = '';
  };

  nameInput.addEventListener('input', () => clearFieldError(nameInput, errorName));
  emailInput.addEventListener('input', () => clearFieldError(emailInput, errorEmail));
  messageInput.addEventListener('input', () => clearFieldError(messageInput, errorMessage));

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formFeedback.textContent = '';
    formFeedback.className = 'form-feedback';

    let isValid = true;
    const nameVal = nameInput.value.trim();
    const emailVal = emailInput.value.trim();
    const messageVal = messageInput.value.trim();

    if (nameVal.length < 2) {
      nameInput.classList.add('invalid');
      errorName.textContent = 'Mohon masukkan nama lengkap Anda (minimal 2 karakter).';
      isValid = false;
    }

    if (!validateEmail(emailVal)) {
      emailInput.classList.add('invalid');
      errorEmail.textContent = 'Mohon masukkan alamat email yang valid.';
      isValid = false;
    }

    if (messageVal.length < 10) {
      messageInput.classList.add('invalid');
      errorMessage.textContent = 'Mohon tuliskan pesan minimal 10 karakter.';
      isValid = false;
    }

    if (!isValid) return;

    formFeedback.textContent = `Terima kasih, ${nameVal}! Pesan Anda telah tercatat. Untuk respons lebih cepat, Anda juga dapat menghubungi langsung melalui WhatsApp atau Email.`;
    formFeedback.classList.add('success');
    contactForm.reset();
  });

  // 8. Dynamic Copyright Year
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
