import {initializeMap} from './loadMap.js';
const map = initializeMap();
const ratingControl = L.control({position: 'topleft'});
ratingControl.onAdd = function (map) {
    return document.getElementById('ratingControl');
};
ratingControl.addTo(map);

const ubicacionControl = L.control({position: 'bottomright'});
ubicacionControl.onAdd = function(map) {
    return document.getElementById('currentLocationButton');
};
ubicacionControl.addTo(map);

async function loadAllPublication() {
    try {
        const response = await fetch('http://localhost:3000/api/fetchData/publicacion/');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

async function paintMap(minRating= 4) {
    const publications = await loadAllPublication();
    const filteredPublications = publications.filter(pub => pub.valoracion >= minRating);
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;

            // Crear marcador en la ubicación actual
            var customIcon = L.icon({
                iconUrl: '/Front_end/Images/selfubication.png',
                iconSize: [32, 32], // Tamaño del icono en píxeles
                iconAnchor: [16, 32], // Punto de anclaje del icono, se ajusta según el diseño del icono
                popupAnchor: [0, -32] // Punto donde se abrirá el popup, ajustado según el diseño del icono
            });

            // Crear marcador con el icono personalizBado en la ubicación actual
            var marker = L.marker([lat, lng], { icon: customIcon }).addTo(map)

            // Centrar mapa en la ubicación actual
            map.setView([lat, lng], 17);
        }, function(error) {
            console.error('Error al obtener la ubicación: ', error);
        });
    } else {
        console.error('Geolocalización no es soportada por este navegador.');
    }
    for (const publication of filteredPublications) {
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

document.addEventListener('DOMContentLoaded', function () {
    // Carga el mapa con la valoración mínima predeterminada (0)
    paintMap();

    document.getElementById('ratingFilter').addEventListener('change', function () {
        map.eachLayer(function (layer) {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });
        // Pinta el mapa con la nueva valoración mínima
        paintMap(parseInt(this.value));
    });

    document.getElementById('currentLocationButton').addEventListener('click',currentUbication);
});

function currentUbication() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const latitud = position.coords.latitude;
            const longitud = position.coords.longitude;
            map.setView([latitud, longitud], 15); // Ajusta el nivel de zoom según sea necesario
        }, function(error) {
            console.error(error);
            alert('Error al obtener la ubicación: ' + error.message);
        });
    } else {
        alert('La geolocalización no está disponible en tu navegador.');
    }
}
