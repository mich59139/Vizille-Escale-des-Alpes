// ============================================
// Carte Patrimoniale - Vizille Escale des Alpes
// Source: AHPV - Revue Mémoire
// ============================================

let map;
let markers = [];
let markerClusterGroup;
let filteredArticles = [];

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    initFilters();
    renderArticles(AHPV_ARTICLES);
});

// Carte Leaflet
function initMap() {
    map = L.map('map', {
        center: [45.085, 5.780], // Centre sur les 6 communes
        zoom: 12,
        zoomControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap | Données: <a href="https://mich59139.github.io/AHPV/">AHPV</a>',
        maxZoom: 18
    }).addTo(map);

    // Cluster de marqueurs
    markerClusterGroup = L.markerClusterGroup({
        disableClusteringAtZoom: 14,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        maxClusterRadius: 50,
        iconCreateFunction: function(cluster) {
            const count = cluster.getChildCount();
            let size = 'small';
            if (count > 20) size = 'medium';
            if (count > 50) size = 'large';
            return L.divIcon({
                html: `<div><span>${count}</span></div>`,
                className: `marker-cluster marker-cluster-${size}`,
                iconSize: L.point(40, 40)
            });
        }
    });
    map.addLayer(markerClusterGroup);
}

// Créer un marqueur personnalisé
function createMarker(article) {
    const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="
            background: ${article.color};
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });

    const marker = L.marker(article.coords, { icon });
    
    // Popup
    const popupContent = `
        <div class="popup-title">${article.titre}</div>
        <div class="popup-article-meta">
            📍 ${article.villes}<br>
            📖 ${article.numero} (${article.annee})<br>
            ✍️ ${article.auteurs || 'Non précisé'}
        </div>
        ${article.themes ? `<div style="margin-top:8px;font-size:0.75rem;color:#666;">🏷️ ${article.themes}</div>` : ''}
    `;
    marker.bindPopup(popupContent, { maxWidth: 300 });
    
    marker.articleData = article;
    return marker;
}

// Grouper les articles par lieu
function groupByLocation(articles) {
    const groups = {};
    articles.forEach(art => {
        const key = `${art.coords[0]},${art.coords[1]}`;
        if (!groups[key]) {
            groups[key] = {
                coords: art.coords,
                ville: art.villes.split(',')[0].trim(),
                articles: [],
                color: art.color
            };
        }
        groups[key].articles.push(art);
    });
    return Object.values(groups);
}

// Rendu des articles
function renderArticles(articles) {
    filteredArticles = articles;
    
    // Clear
    markerClusterGroup.clearLayers();
    markers = [];
    
    // Grouper par lieu pour la carte
    const locations = groupByLocation(articles);
    
    locations.forEach(loc => {
        const icon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="
                background: ${loc.color};
                width: ${Math.min(24 + loc.articles.length * 2, 40)}px;
                height: ${Math.min(24 + loc.articles.length * 2, 40)}px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 11px;
                font-weight: bold;
            ">${loc.articles.length > 1 ? loc.articles.length : ''}</div>`,
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });

        const marker = L.marker(loc.coords, { icon });
        
        // Popup avec liste d'articles
        let popupHtml = `<div class="popup-title">📍 ${loc.ville}</div>`;
        popupHtml += `<div class="popup-count">${loc.articles.length} article${loc.articles.length > 1 ? 's' : ''}</div>`;
        popupHtml += `<div class="popup-articles">`;
        loc.articles.slice(0, 10).forEach(art => {
            popupHtml += `
                <div class="popup-article">
                    <div class="popup-article-title">${art.titre}</div>
                    <div class="popup-article-meta">${art.numero} • ${art.auteurs || ''}</div>
                </div>
            `;
        });
        if (loc.articles.length > 10) {
            popupHtml += `<div style="padding:8px;text-align:center;color:#666;font-size:0.75rem;">+ ${loc.articles.length - 10} autres articles</div>`;
        }
        popupHtml += `</div>`;
        
        marker.bindPopup(popupHtml, { maxWidth: 320, maxHeight: 350 });
        markerClusterGroup.addLayer(marker);
        markers.push(marker);
    });
    
    // Liste sidebar
    const listEl = document.getElementById('articlesList');
    listEl.innerHTML = '';
    
    articles.slice(0, 100).forEach((art, idx) => {
        const card = document.createElement('div');
        card.className = 'article-card';
        card.innerHTML = `
            <div class="article-title">${art.titre}</div>
            <div class="article-meta">
                <span>📍 ${art.commune}</span>
                <span>📖 ${art.annee}</span>
            </div>
            ${art.themes ? `<div class="article-themes">${art.themes.split(',').slice(0,3).map(t => `<span class="theme-tag">${t.trim()}</span>`).join('')}</div>` : ''}
        `;
        card.onclick = () => {
            // Zoom sur le lieu
            map.setView(art.coords, 15);
            // Highlight
            document.querySelectorAll('.article-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        };
        listEl.appendChild(card);
    });
    
    if (articles.length > 100) {
        const more = document.createElement('div');
        more.style.cssText = 'text-align:center;padding:1rem;color:#666;font-size:0.8rem;';
        more.textContent = `+ ${articles.length - 100} autres articles (affiner les filtres)`;
        listEl.appendChild(more);
    }
    
    // Stats
    document.getElementById('countFiltered').textContent = articles.length;
    document.getElementById('countLieux').textContent = locations.length;
}

// Filtres
function initFilters() {
    const filterCommune = document.getElementById('filterCommune');
    const filterTheme = document.getElementById('filterTheme');
    const filterSearch = document.getElementById('filterSearch');
    
    const applyFilters = () => {
        let results = AHPV_ARTICLES;
        
        // Filtre commune
        const commune = filterCommune.value;
        if (commune) {
            results = results.filter(a => a.villes.toLowerCase().includes(commune.toLowerCase()));
        }
        
        // Filtre thème
        const theme = filterTheme.value;
        if (theme) {
            results = results.filter(a => a.themes && a.themes.toLowerCase().includes(theme.toLowerCase()));
        }
        
        // Recherche texte
        const search = filterSearch.value.toLowerCase().trim();
        if (search) {
            results = results.filter(a => 
                a.titre.toLowerCase().includes(search) ||
                (a.auteurs && a.auteurs.toLowerCase().includes(search)) ||
                a.villes.toLowerCase().includes(search)
            );
        }
        
        renderArticles(results);
    };
    
    filterCommune.onchange = applyFilters;
    filterTheme.onchange = applyFilters;
    filterSearch.oninput = applyFilters;
}

// Toggle sidebar mobile
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}
