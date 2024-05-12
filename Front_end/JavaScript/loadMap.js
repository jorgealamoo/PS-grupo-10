function initializeMap() {
    var map = L.map('map',{
            maxZoom: 20,
            minZoom: 3,
            zoomControl: false
    }).setView([28.072876, -15.451502], 17);
    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);

    // Tile type: openstreetmap normal
    var openstreetmap = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 20,
            attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        });

// Tile type: openstreetmap Hot
    var openstreetmapHot = L.tileLayer(
        'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
            maxZoom: 20
        });

// Tile type: openstreetmap Osm
    var openstreetmapOsm = L.tileLayer(
        'http://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
            maxZoom: 20
        });

//Base layers definition and addition
    var allOptions = {
        "Open streetmap": openstreetmap,
        "Open streetmap: Hot": openstreetmapHot,
        "Open streetmap: Osm": openstreetmapOsm
    };

    L.control.layers(allOptions).addTo(map);
    // Añadir capa por defecto
    openstreetmapHot.addTo(map);
    // Obtener ubicación actual del usuario
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

            // Crear marcador con el icono personalizado en la ubicación actual
            var marker = L.marker([lat, lng], { icon: customIcon }).addTo(map)

            // Centrar mapa en la ubicación actual
            map.setView([lat, lng], 17);
        }, function(error) {
            console.error('Error al obtener la ubicación: ', error);
        });
    } else {
        console.error('Geolocalización no es soportada por este navegador.');
    }

    const southWest = L.latLng(-66.206333, -168.986456); // Esquina suroeste
    const northEast = L.latLng(78.829917, 179.876336); // Esquina noreste
    const bounds = L.latLngBounds(southWest, northEast);

// Aplica los límites al mapa
    map.setMaxBounds(bounds);
    map.on('drag', function () {
        map.panInsideBounds(bounds, { animate: false });
    });
    return map;
}

// Exportar la función initializeMap
export { initializeMap };

