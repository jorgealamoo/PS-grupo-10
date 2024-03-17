import {initializeMap} from './loadMap.js';
const map = initializeMap();

async function loadAllPublication() {
    const  response = await fetch('http://localhost:3000/api/fetchData/publicacion')
        .then(response =>{
            if(!response.ok){
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
    return response;
}

async function paintMap() {
    const publications = await loadAllPublication();
    for (const publication of publications) {
        let location = [];
        const ubicacion = publication.ubicacion;
        location.push(ubicacion.latitude);
        location.push(ubicacion.longitude);
        const marker = L.marker(location, {
                        id: publication.publication_id,
                        name: publication.nombre
                         }).addTo(map);
        marker.on('click', function (e){
           localStorage.setItem('currentPublication',e.target.options.id);
           window.location.href = "../Publication/publication.html"
        });
        marker.bindTooltip(publication.nombre);
        marker.on('mouseover', function(e) {
            marker.openTooltip(); // Abre el tooltip cuando el ratón se coloca sobre el marcador
        });
        marker.on('mouseout', function(e) {
            marker.closeTooltip(); // Cierra el tooltip cuando el ratón sale del marcador
        });
    }
}

document.addEventListener('DOMContentLoaded', paintMap);