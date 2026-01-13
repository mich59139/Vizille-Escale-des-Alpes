// ===== NAVIGATION MOBILE =====
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle?.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  navToggle.classList.toggle('active');
});

// Close menu when clicking a link
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
      const offset = 80;
      const position = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: position, behavior: 'smooth' });
    }
  });
});

// ===== ANIMATED COUNTERS =====
const animateCounters = () => {
  const counters = document.querySelectorAll('.stat-value[data-target]');
  
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
      current += step;
      if (current < target) {
        counter.textContent = Math.floor(current).toLocaleString('fr-FR');
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target.toLocaleString('fr-FR');
      }
    };
    
    updateCounter();
  });
};

// Trigger counters when hero is visible
const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      heroObserver.disconnect();
    }
  });
}, { threshold: 0.3 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) heroObserver.observe(heroStats);

// ===== WEATHER WIDGET =====
const updateWeather = async () => {
  const weatherWidget = document.getElementById('weather');
  if (!weatherWidget) return;
  
  try {
    // Using Open-Meteo API (free, no API key needed)
    const response = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=45.0775&longitude=5.7725&current=temperature_2m,weather_code&timezone=Europe/Paris'
    );
    const data = await response.json();
    
    if (data.current) {
      const temp = Math.round(data.current.temperature_2m);
      const weatherCode = data.current.weather_code;
      
      // Map weather codes to emojis
      const weatherIcons = {
        0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
        45: '🌫️', 48: '🌫️',
        51: '🌧️', 53: '🌧️', 55: '🌧️',
        61: '🌧️', 63: '🌧️', 65: '🌧️',
        71: '🌨️', 73: '🌨️', 75: '🌨️',
        80: '🌦️', 81: '🌦️', 82: '🌦️',
        95: '⛈️', 96: '⛈️', 99: '⛈️'
      };
      
      const icon = weatherIcons[weatherCode] || '🌡️';
      
      weatherWidget.innerHTML = `
        <span class="weather-icon">${icon}</span>
        <span class="weather-temp">${temp}°C</span>
        <span class="weather-loc">Vizille</span>
      `;
    }
  } catch (error) {
    console.log('Weather fetch failed, using fallback');
    // Fallback display
    weatherWidget.innerHTML = `
      <span class="weather-icon">🏔️</span>
      <span class="weather-temp">--°C</span>
      <span class="weather-loc">Vizille</span>
    `;
  }
};

updateWeather();

// ===== GALLERY INFINITE SCROLL =====
const galleryTrack = document.querySelector('.gallery-track');
if (galleryTrack) {
  // Clone slides for infinite loop
  const slides = galleryTrack.innerHTML;
  galleryTrack.innerHTML = slides + slides;
}

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
      scrollObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// Add animation classes to elements
document.querySelectorAll('.parcours-card, .hebergement-card, .restaurant-card, .event-card, .commune-card, .activite-card, .testimonial-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  scrollObserver.observe(el);
});

// Add animate-in class styles
const style = document.createElement('style');
style.textContent = `
  .animate-in {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
`;
document.head.appendChild(style);

// ===== NAVBAR SCROLL EFFECT =====
let lastScroll = 0;
const nav = document.querySelector('.nav');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 100) {
    nav.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
  } else {
    nav.style.boxShadow = '0 2px 20px rgba(0,0,0,0.05)';
  }
  
  lastScroll = currentScroll;
});

// ===== COUNTDOWN TO NEXT EVENT =====
const updateCountdown = () => {
  const nextEventDate = new Date('2026-03-29T08:00:00');
  const now = new Date();
  const diff = nextEventDate - now;
  
  if (diff > 0) {
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const nextEventElement = document.querySelector('.next-event-date');
    if (nextEventElement && days > 0) {
      nextEventElement.innerHTML = `29 mars 2026 <small style="opacity:0.7; display:block; font-size:0.75rem;">J-${days}</small>`;
    }
  }
};

updateCountdown();

// ===== PARALLAX EFFECT ON HERO =====
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector('.hero');
  if (hero && scrolled < 600) {
    hero.style.backgroundPosition = `center ${scrolled * 0.3}px`;
  }
});

// ===== INTERACTIVE CARDS TILT EFFECT =====
document.querySelectorAll('.parcours-card, .hebergement-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
  });
});

// ===== LAZY LOADING FOR IMAGES =====
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.classList.add('loaded');
        }
        imageObserver.unobserve(img);
      }
    });
  });
  
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// ===== FORM VALIDATION (for future contact form) =====
const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// ===== TOOLTIP SYSTEM =====
document.querySelectorAll('[data-tooltip]').forEach(el => {
  el.addEventListener('mouseenter', function() {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = this.dataset.tooltip;
    tooltip.style.cssText = `
      position: absolute;
      background: #1e3a5f;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.8rem;
      z-index: 1000;
      pointer-events: none;
    `;
    document.body.appendChild(tooltip);
    
    const rect = this.getBoundingClientRect();
    tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10 + window.scrollY}px`;
    tooltip.style.left = `${rect.left + rect.width/2 - tooltip.offsetWidth/2}px`;
    
    this._tooltip = tooltip;
  });
  
  el.addEventListener('mouseleave', function() {
    if (this._tooltip) {
      this._tooltip.remove();
    }
  });
});

// ===== PRINT FRIENDLY =====
window.addEventListener('beforeprint', () => {
  document.querySelectorAll('.animate-in').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
});

console.log('🚴 Vizille Escale des Alpes - Site chargé !');
