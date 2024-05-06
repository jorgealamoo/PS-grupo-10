import {initializeMap} from './loadMap.js';
const map = initializeMap();
async function loadAllPublication() {
    try {
        const response = await fetch('http://localhost:3000/api/fetchData/publicacion/');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        return []; // Devuelve una lista vacía en caso de error
    }
}

async function paintMap() {
    const publications = await loadAllPublication();
    for (const publication of publications) {
        const location = [publication.ubicacion.latitude, publication.ubicacion.longitude];
        const marker = L.marker(location, {
            id: publication.publication_id,
            name: publication.nombre,
        }).addTo(map);

        marker.on('click', function (e) {
            localStorage.setItem('currentPublication', e.target.options.id);
            window.location.href = '../Publication/publication.html';
        });

        marker.bindTooltip(publication.nombre);
        marker.on('mouseover', function (e) {
            marker.openTooltip();
        });
        marker.on('mouseout', function (e) {
            marker.closeTooltip();
        });
    }
}

document.addEventListener('DOMContentLoaded', paintMap);