// ===== CARTE INTERACTIVE =====
document.addEventListener('DOMContentLoaded', function() {
  // Vérifier si l'élément map existe
  const mapElement = document.getElementById('map');
  if (!mapElement) return;

  // Initialiser la carte centrée sur le territoire
  const map = L.map('map').setView([45.08, 5.78], 12);

  // Ajouter le fond de carte OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18,
  }).addTo(map);

  // Icônes personnalisées
  const icons = {
    commune: L.divIcon({
      className: 'custom-marker commune-marker',
      html: '<div class="marker-inner">🏘️</div>',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    }),
    patrimoine: L.divIcon({
      className: 'custom-marker patrimoine-marker',
      html: '<div class="marker-inner">🏰</div>',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    }),
    hebergement: L.divIcon({
      className: 'custom-marker hebergement-marker',
      html: '<div class="marker-inner">🏨</div>',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    }),
    insolite: L.divIcon({
      className: 'custom-marker insolite-marker',
      html: '<div class="marker-inner">🏕️</div>',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    }),
    thermes: L.divIcon({
      className: 'custom-marker thermes-marker',
      html: '<div class="marker-inner">♨️</div>',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    })
  };

  // Données des points d'intérêt
  const pointsInteret = [
    // Communes
    { lat: 45.0775, lng: 5.7725, type: 'communes', icon: icons.commune, 
      title: 'Vizille', desc: 'Cœur patrimonial du territoire. Château et Musée de la Révolution française.' },
    { lat: 45.1025, lng: 5.7486, type: 'communes', icon: icons.commune, 
      title: 'Jarrie', desc: 'Pôle économique. Site privilégié pour le futur hôtel.' },
    { lat: 45.1183, lng: 5.8100, type: 'communes', icon: icons.commune, 
      title: 'Vaulnaveys-le-Haut', desc: 'Nature préservée, hébergements insolites.' },
    { lat: 45.1083, lng: 5.7950, type: 'communes', icon: icons.commune, 
      title: 'Vaulnaveys-le-Bas', desc: 'Porte vers les Thermes d\'Uriage.' },
    { lat: 45.0983, lng: 5.7667, type: 'communes', icon: icons.commune, 
      title: 'Montchaboud', desc: 'Village préservé, authenticité rurale.' },
    { lat: 45.0617, lng: 5.7583, type: 'communes', icon: icons.commune, 
      title: 'Les Mésages', desc: 'Tranquillité, vue sur la vallée.' },
    
    // Patrimoine
    { lat: 45.0778, lng: 5.7728, type: 'patrimoine', icon: icons.patrimoine, 
      title: 'Château de Vizille', desc: 'Musée de la Révolution française. 800 000 visiteurs/an. Entrée gratuite.',
      link: 'https://www.chateau-vizille.fr' },
    { lat: 45.1450, lng: 5.8300, type: 'patrimoine', icon: icons.thermes, 
      title: 'Thermes d\'Uriage', desc: 'Station thermale réputée. Soins bien-être et récupération sportive.',
      link: 'https://www.uriage-les-bains.com' },
    
    // Hébergements
    { lat: 45.1453, lng: 5.8295, type: 'hebergements', icon: icons.hebergement, 
      title: 'Grand Hôtel & Spa Uriage', desc: 'Hôtel 4 étoiles. Spa thermal, piscine, restaurant gastronomique.',
      link: 'https://www.grand-hotel-uriage.com' },
    { lat: 45.1350, lng: 5.8250, type: 'hebergements', icon: icons.hebergement, 
      title: 'Auberge Saint-Michel', desc: 'Auberge de charme avec jardin et terrasse.',
      link: 'https://www.booking.com' },
    { lat: 45.0780, lng: 5.7720, type: 'hebergements', icon: icons.hebergement, 
      title: 'Locations Airbnb Vizille', desc: '60+ appartements et maisons. Dès 17€/nuit.',
      link: 'https://www.airbnb.fr/vizille-france/stays' },
    { lat: 45.1200, lng: 5.8150, type: 'hebergements', icon: icons.insolite, 
      title: 'Camping du Buisson', desc: 'Yourtes avec jacuzzi, dôme géodésique. Vue panoramique.',
      link: 'https://www.camping-grenoble-alpes.fr' },
    { lat: 45.1400, lng: 5.8200, type: 'hebergements', icon: icons.insolite, 
      title: 'Cabanes & Dômes', desc: 'Hébergements insolites : cabanes perchées, bulles transparentes.',
      link: 'https://www.abracadaroom.com' },
  ];

  // Groupes de couches pour le filtrage
  const layers = {
    all: L.layerGroup(),
    communes: L.layerGroup(),
    hebergements: L.layerGroup(),
    patrimoine: L.layerGroup()
  };

  // Ajouter les marqueurs
  pointsInteret.forEach(poi => {
    const popupContent = `
      <div class="map-popup">
        <h4>${poi.title}</h4>
        <p>${poi.desc}</p>
        ${poi.link ? `<a href="${poi.link}" target="_blank" class="popup-link">En savoir plus →</a>` : ''}
      </div>
    `;
    
    const marker = L.marker([poi.lat, poi.lng], { icon: poi.icon })
      .bindPopup(popupContent);
    
    marker.addTo(layers.all);
    marker.addTo(layers[poi.type]);
  });

  // Afficher tous les points par défaut
  layers.all.addTo(map);

  // Gestion des filtres
  const filterButtons = document.querySelectorAll('.carte-filter');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      // Retirer la classe active de tous les boutons
      filterButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Récupérer le filtre
      const filter = this.dataset.filter;
      
      // Retirer toutes les couches
      Object.values(layers).forEach(layer => map.removeLayer(layer));
      
      // Ajouter la couche correspondante
      layers[filter].addTo(map);
    });
  });

  // Style des marqueurs (ajouté via CSS)
  const style = document.createElement('style');
  style.textContent = `
    .custom-marker {
      background: none;
      border: none;
    }
    .marker-inner {
      width: 40px;
      height: 40px;
      background: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      border: 3px solid #1e3a5f;
      transition: transform 0.2s;
    }
    .marker-inner:hover {
      transform: scale(1.1);
    }
    .patrimoine-marker .marker-inner { border-color: #9c27b0; }
    .hebergement-marker .marker-inner { border-color: #c9a227; }
    .insolite-marker .marker-inner { border-color: #2d6a4f; }
    .thermes-marker .marker-inner { border-color: #0077b6; }
    
    .map-popup h4 {
      margin: 0 0 8px 0;
      color: #1e3a5f;
      font-size: 1rem;
    }
    .map-popup p {
      margin: 0 0 8px 0;
      font-size: 0.875rem;
      color: #4a5568;
    }
    .popup-link {
      color: #c9a227;
      font-weight: 600;
      text-decoration: none;
      font-size: 0.875rem;
    }
    .popup-link:hover {
      text-decoration: underline;
    }
  `;
  document.head.appendChild(style);
});
