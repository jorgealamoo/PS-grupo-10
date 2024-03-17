import {initializeMap} from './loadMap.js';

document.addEventListener('DOMContentLoaded', async function () {


    localStorage.setItem('publicationID', 'iWXO0uDHygJx4vz0vGKq'); //para poder hacer pruebas
    console.log(localStorage.getItem("publicationID"))

    var dataJSON = null

    function initializeMap(latitude, longitude) {
        // Crea el mapa y configura la vista inicial utilizando las coordenadas proporcionadas
        var map = L.map('map').setView([latitude, longitude], 13);

        // Añade una capa de mapa base (puedes elegir entre diferentes proveedores, como OpenStreetMap, Mapbox, etc.)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

        // Añade un marcador en la posición especificada
        var marker = L.marker([latitude, longitude]).addTo(map);

        // Retorna el objeto de mapa
        return map;
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

            const location = documentData['ubicacion'];
            const latitude = location.latitude;
            const longitude = location.longitude;

            // Llama a la función initializeMap con las coordenadas específicas
            const map = initializeMap(latitude, longitude);


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
