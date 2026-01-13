// ===== NAVIGATION =====
const nav = document.querySelector('.nav');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

// Scroll effect
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// Mobile menu toggle
navToggle?.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  navToggle.classList.toggle('active');
});

// Close menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
  });
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ===== ANIMATIONS ON SCROLL =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.parcours-card, .commune-card, .service-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// Add animate-in styles
const style = document.createElement('style');
style.textContent = `
  .animate-in {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
`;
document.head.appendChild(style);

// ===== COUNTER ANIMATION =====
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);
  
  function update() {
    start += increment;
    if (start < target) {
      element.textContent = Math.floor(start).toLocaleString('fr-FR');
      requestAnimationFrame(update);
    } else {
      element.textContent = target.toLocaleString('fr-FR');
    }
  }
  
  update();
}

// Animate stats when visible
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statElements = entry.target.querySelectorAll('.stat-value, .cta-stat');
      statElements.forEach(stat => {
        const value = parseInt(stat.textContent.replace(/\s/g, ''));
        if (!isNaN(value)) {
          animateCounter(stat, value);
        }
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.hero-stats, .cta-content').forEach(el => {
  statsObserver.observe(el);
});

// ===== PARCOURS FILTER (for future use) =====
function filterParcours(difficulty) {
  const cards = document.querySelectorAll('.parcours-card');
  cards.forEach(card => {
    if (difficulty === 'all' || card.classList.contains(difficulty)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// ===== COMMUNE HOVER EFFECT =====
document.querySelectorAll('.commune-tag').forEach(tag => {
  tag.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.05)';
  });
  tag.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
  });
});

// ===== FORM HANDLING (for future contact form) =====
function handleContactForm(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  
  // Simulate form submission
  console.log('Form submitted:', data);
  alert('Merci pour votre message ! Nous vous recontacterons bientôt.');
  e.target.reset();
}

// ===== UTILITY: Debounce =====
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ===== PARALLAX EFFECT (subtle) =====
const parallaxElements = document.querySelectorAll('.hero');
window.addEventListener('scroll', debounce(() => {
  const scrolled = window.scrollY;
  parallaxElements.forEach(el => {
    const speed = 0.3;
    el.style.backgroundPositionY = `${scrolled * speed}px`;
  });
}, 10));

// ===== CONSOLE MESSAGE =====
console.log('%c🚴 Vizille Escale des Alpes', 'font-size: 24px; font-weight: bold; color: #1e3a5f;');
console.log('%c6 communes • 4 boucles • 800 000 opportunités', 'font-size: 14px; color: #c9a227;');
