// ===== VIZILLE ESCALE DES ALPES - Main JS =====

document.addEventListener('DOMContentLoaded', function() {
  
  // ===== NAVIGATION MOBILE =====
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }
  
  // Fermer menu au clic sur un lien
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
    });
  });

  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // ===== ONGLETS PARCOURS VÉLO / RANDO =====
  const tabs = document.querySelectorAll('.parcours-tab');
  const contents = document.querySelectorAll('.parcours-content');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabId = tab.getAttribute('data-tab');
      
      // Désactiver tous les onglets et contenus
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      
      // Activer l'onglet cliqué et son contenu
      tab.classList.add('active');
      document.getElementById('tab-' + tabId).classList.add('active');
    });
  });

  // ===== NAVBAR SCROLL EFFECT =====
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
    } else {
      nav.style.boxShadow = 'none';
    }
  });

  // ===== ANIMATION AU SCROLL =====
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observer les cartes parcours
  document.querySelectorAll('.parcours-card, .package-ticket').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
  });

});
