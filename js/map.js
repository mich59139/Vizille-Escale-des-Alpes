// ===== CARTE INTERACTIVE LEAFLET =====

document.addEventListener('DOMContentLoaded', function() {
  const mapContainer = document.getElementById('map');
  if (!mapContainer) return;

  // Initialize map centered on Vizille
  const map = L.map('map', {
    center: [45.095, 5.79],
    zoom: 12,
    scrollWheelZoom: false
  });

  // Add OpenStreetMap tiles with custom style
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18
  }).addTo(map);

  // Enable scroll zoom on click
  map.on('click', function() {
    map.scrollWheelZoom.enable();
  });

  // Custom icon creator
  const createIcon = (emoji, color) => {
    return L.divIcon({
      html: `<div style="
        background: ${color};
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        box-shadow: 0 3px 10px rgba(0,0,0,0.3);
        border: 3px solid white;
      ">${emoji}</div>`,
      className: 'custom-marker',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20]
    });
  };

  // ===== DATA: Points of Interest =====
  const poiData = {
    communes: [
      {
        name: 'Vizille',
        lat: 45.0775,
        lng: 5.7725,
        desc: 'Cœur patrimonial du territoire. Château de Vizille et Musée de la Révolution française.',
        icon: '🏰',
        color: '#1e3a5f',
        link: 'https://www.chateau-vizille.fr'
      },
      {
        name: 'Jarrie',
        lat: 45.1025,
        lng: 5.7486,
        desc: 'Pôle économique avec la gare TER Jarrie-Vizille. Accès A480.',
        icon: '🚉',
        color: '#1e3a5f'
      },
      {
        name: 'Vaulnaveys-le-Haut',
        lat: 45.1183,
        lng: 5.8100,
        desc: 'Village nature avec hébergements insolites et vue sur Belledonne.',
        icon: '🌲',
        color: '#1e3a5f'
      },
      {
        name: 'Vaulnaveys-le-Bas',
        lat: 45.1083,
        lng: 5.7950,
        desc: 'Porte vers Uriage et ses thermes. Golf et parcours cyclistes.',
        icon: '⛳',
        color: '#1e3a5f'
      },
      {
        name: 'Montchaboud',
        lat: 45.0983,
        lng: 5.7667,
        desc: 'Village authentique préservé au cœur du territoire.',
        icon: '🏡',
        color: '#1e3a5f'
      },
      {
        name: 'Les Mésages',
        lat: 45.0617,
        lng: 5.7583,
        desc: 'Petit village de caractère avec vue panoramique.',
        icon: '🏘️',
        color: '#1e3a5f'
      }
    ],
    hebergements: [
      {
        name: 'Grand Hôtel & Spa Uriage',
        lat: 45.1453,
        lng: 5.8295,
        desc: 'Hôtel 4 étoiles avec spa thermal, piscine chauffée et restaurant gastronomique.',
        icon: '🏨',
        color: '#c9a227',
        link: 'https://www.grand-hotel-uriage.com'
      },
      {
        name: 'Auberge Saint-Michel',
        lat: 45.1350,
        lng: 5.8250,
        desc: 'Auberge de charme à Saint-Martin-d\'Uriage avec jardin.',
        icon: '🏠',
        color: '#c9a227'
      },
      {
        name: 'Airbnb Vizille',
        lat: 45.0780,
        lng: 5.7720,
        desc: '60+ locations disponibles. Studios dès 17€/nuit, maisons familiales.',
        icon: '🏘️',
        color: '#c9a227',
        link: 'https://www.airbnb.fr/vizille-france/stays'
      },
      {
        name: 'Camping du Buisson',
        lat: 45.1200,
        lng: 5.8150,
        desc: 'Hébergements insolites : yourtes avec jacuzzi et vue panoramique.',
        icon: '🏕️',
        color: '#2d6a4f',
        link: 'https://www.camping-grenoble-alpes.fr'
      },
      {
        name: 'Cabanes & Dômes Belledonne',
        lat: 45.1400,
        lng: 5.8200,
        desc: 'Cabanes perchées et dômes transparents. Nuit sous les étoiles.',
        icon: '🌲',
        color: '#2d6a4f'
      }
    ],
    patrimoine: [
      {
        name: 'Château de Vizille',
        lat: 45.0778,
        lng: 5.7728,
        desc: 'Musée de la Révolution française. Parc de 100 hectares. Entrée gratuite.',
        icon: '🏛️',
        color: '#9c27b0',
        link: 'https://www.chateau-vizille.fr'
      },
      {
        name: 'Thermes d\'Uriage',
        lat: 45.1450,
        lng: 5.8300,
        desc: 'Station thermale depuis 1823. Soins dermatologiques et rhumatologie.',
        icon: '♨️',
        color: '#9c27b0',
        link: 'https://www.uriage-les-bains.com'
      },
      {
        name: 'Château d\'Uriage',
        lat: 45.1420,
        lng: 5.8280,
        desc: 'Château médiéval surplombant la vallée. Vue panoramique.',
        icon: '🏰',
        color: '#9c27b0'
      }
    ],
    restaurants: [
      {
        name: 'Les Terrasses d\'Uriage',
        lat: 45.1455,
        lng: 5.8290,
        desc: 'Restaurant étoilé du chef Christophe Aribert. Cuisine créative.',
        icon: '⭐',
        color: '#e74c3c'
      },
      {
        name: 'Le Floréal',
        lat: 45.0776,
        lng: 5.7730,
        desc: 'Restaurant dans le parc du Château de Vizille. Cadre exceptionnel.',
        icon: '🍽️',
        color: '#e74c3c',
        link: 'https://www.lefloreal.net'
      },
      {
        name: 'Le Chalet Gourmand',
        lat: 45.0770,
        lng: 5.7715,
        desc: 'Pizzas artisanales au feu de bois. Ambiance conviviale.',
        icon: '🍕',
        color: '#e74c3c'
      },
      {
        name: 'Houmous & Curry',
        lat: 45.0782,
        lng: 5.7735,
        desc: 'Cuisine libanaise et indienne fait maison. Mezzés et grillades.',
        icon: '🥘',
        color: '#e74c3c'
      },
      {
        name: 'Restaurant des Mésanges',
        lat: 45.1355,
        lng: 5.8255,
        desc: 'Cuisine de terroir à Saint-Martin-d\'Uriage. Vue montagne.',
        icon: '🍳',
        color: '#e74c3c'
      }
    ],
    parcours: [
      {
        name: 'Départ Boucle Familiale',
        lat: 45.0778,
        lng: 5.7728,
        desc: '15 km autour du Château. Idéal familles et VAE.',
        icon: '🚴',
        color: '#48bb78'
      },
      {
        name: 'Col de la Crête de Malbouchet',
        lat: 45.1150,
        lng: 5.8050,
        desc: 'Point culminant du parcours sportif. Vue 360° exceptionnelle.',
        icon: '⛰️',
        color: '#ed8936'
      }
    ]
  };

  // ===== CREATE LAYER GROUPS =====
  const layers = {
    communes: L.layerGroup(),
    hebergements: L.layerGroup(),
    patrimoine: L.layerGroup(),
    restaurants: L.layerGroup(),
    parcours: L.layerGroup()
  };

  // Add markers to layers
  Object.keys(poiData).forEach(category => {
    poiData[category].forEach(poi => {
      const marker = L.marker([poi.lat, poi.lng], {
        icon: createIcon(poi.icon, poi.color)
      });

      let popupContent = `
        <div style="min-width: 200px; padding: 5px;">
          <h3 style="margin: 0 0 8px 0; color: #1e3a5f; font-size: 1.1rem;">${poi.icon} ${poi.name}</h3>
          <p style="margin: 0 0 10px 0; color: #4a5568; font-size: 0.9rem; line-height: 1.4;">${poi.desc}</p>
      `;
      
      if (poi.link) {
        popupContent += `<a href="${poi.link}" target="_blank" style="
          display: inline-block;
          background: #1e3a5f;
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          text-decoration: none;
        ">En savoir plus →</a>`;
      }
      
      popupContent += '</div>';

      marker.bindPopup(popupContent);
      layers[category].addLayer(marker);
    });
  });

  // Add all layers to map by default
  Object.values(layers).forEach(layer => layer.addTo(map));

  // ===== FILTER BUTTONS =====
  const filterButtons = document.querySelectorAll('.carte-filter');
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      // Update active state
      filterButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      const filter = this.dataset.filter;
      
      // Show/hide layers based on filter
      Object.keys(layers).forEach(layerName => {
        if (filter === 'all' || filter === layerName) {
          map.addLayer(layers[layerName]);
        } else {
          map.removeLayer(layers[layerName]);
        }
      });
    });
  });

  // ===== ADD ROUTE POLYLINES =====
  
  // Boucle Familiale (simplified)
  const boucleFamiliale = [
    [45.0775, 5.7725],
    [45.0800, 5.7750],
    [45.0850, 5.7800],
    [45.0900, 5.7850],
    [45.0850, 5.7900],
    [45.0800, 5.7850],
    [45.0775, 5.7725]
  ];

  L.polyline(boucleFamiliale, {
    color: '#48bb78',
    weight: 4,
    opacity: 0.7,
    dashArray: '10, 10'
  }).addTo(map).bindPopup('🚴 Boucle Familiale - 15 km');

  // Circuit Vizille-Uriage
  const circuitUriage = [
    [45.0775, 5.7725],
    [45.0850, 5.7800],
    [45.0950, 5.7900],
    [45.1050, 5.8000],
    [45.1150, 5.8100],
    [45.1300, 5.8200],
    [45.1450, 5.8300]
  ];

  L.polyline(circuitUriage, {
    color: '#4299e1',
    weight: 4,
    opacity: 0.7,
    dashArray: '10, 10'
  }).addTo(map).bindPopup('🚴 Circuit Vizille → Uriage - 25 km');

  // ===== MAP CONTROLS =====
  
  // Add scale
  L.control.scale({
    metric: true,
    imperial: false,
    position: 'bottomleft'
  }).addTo(map);

  // Fit bounds to show all markers
  const allCoords = [];
  Object.values(poiData).forEach(category => {
    category.forEach(poi => {
      allCoords.push([poi.lat, poi.lng]);
    });
  });
  
  if (allCoords.length > 0) {
    const bounds = L.latLngBounds(allCoords);
    map.fitBounds(bounds.pad(0.1));
  }

  // ===== GEOLOCATION =====
  const locateButton = document.createElement('button');
  locateButton.innerHTML = '📍';
  locateButton.style.cssText = `
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1000;
    background: white;
    border: 2px solid #ccc;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    font-size: 18px;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  `;
  locateButton.title = 'Ma position';
  
  locateButton.addEventListener('click', () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.setView([latitude, longitude], 14);
          
          L.marker([latitude, longitude], {
            icon: createIcon('📍', '#e74c3c')
          }).addTo(map).bindPopup('Vous êtes ici').openPopup();
        },
        () => {
          alert('Impossible de récupérer votre position');
        }
      );
    }
  });
  
  mapContainer.appendChild(locateButton);

  console.log('🗺️ Carte interactive chargée avec', allCoords.length, 'points d\'intérêt');
});
