import {initializeMap} from './loadMap.js';

document.addEventListener('DOMContentLoaded', async function () {



    localStorage.setItem('publicationID', 'iWXO0uDHygJx4vz0vGKq'); //para poder hacer pruebas
    console.log(localStorage.getItem("publicationID"))

    var dataJSON = null

    const map = initializeMap();
    function addPingToMap() {
        var marker = null;
        function addMark(e) {
            if (marker) {
                map.removeLayer(marker);
            }
            marker = L.marker(e.latlng).addTo(map);
            Pointermap.latitude = e.latlng.lat;
            Pointermap.longitude = e.latlng.lng;
        }
        map.on('click', addMark);
    }

    async function fetchDocument() {
        try {
            const publicationID = localStorage.getItem('publicationID');
            const response = await fetch('http://localhost:3000/api/getDocument/publicacion/' + publicationID);
            if (!response.ok) {
                throw new Error('Failed to fetch document');
            }
            const data = await response.json();
            dataJSON = data
            return data;
        } catch (error) {
            console.error('Error fetching document:', error.message);
            return null;
        }
    }

    async function fetchImage(documentData) {
        try {
            const response = await fetch('http://localhost:3000/api/getImage/' + documentData['lista_imagenes']);
            if (!response.ok) {
                throw new Error('Failed to fetch image');
            }
            const data = await response.json();
            return data.imageUrl;
        } catch (error) {
            console.error('Error fetching image:', error.message);
            return null;
        }
    }

    async function displayDocumentData() {
        const documentData = await fetchDocument();
        if (documentData) {
            console.log(documentData);
            // Update the name element's text content
            document.getElementById('name-publication').textContent = documentData['nombre'];
            document.getElementById('description').textContent = documentData['descripcion'];

            const longitud = documentData['ubicacion'][0];
            const latitud = documentData['ubicacion'][1];
            console.log(documentData['ubicacion'][1]);

            const listaComentarios = document.getElementById('listaComentarios');

            // Recorremos el mapa de comentarios
            for (const key in documentData["lista_comentarios"]) {
                if (Object.hasOwnProperty.call(documentData["lista_comentarios"], key)) {
                    // Creamos un nuevo elemento de lista (<li>) para cada comentario
                    const nuevoComentario = document.createElement('li');

                    // Asignamos el contenido del comentario al elemento de lista
                    nuevoComentario.textContent = documentData["lista_comentarios"][key];

                    // Añadimos el elemento de lista al contenedor de la lista de comentarios en el HTML
                    listaComentarios.appendChild(nuevoComentario);
                }
            }

        }
    }

    // Call the displayDocumentData function to execute
    displayDocumentData();
});
