//import {initializeMap} from './loadMap.js';

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
        const publicationID = localStorage.getItem('currentPublication');
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

async function fetchImage(imageurl) {
    try {
        const response = await fetch('http://localhost:3000/api/getImage/' + imageurl);
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
        // Update the name element's text content
        document.getElementById('name').textContent = documentData['nombre'];
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

                // Creamos un elemento span para el emoji de reportar
                const reporteEmoji = document.createElement('span');
                reporteEmoji.textContent = "🚨"; // Emoji de reportar
                reporteEmoji.className = 'reporte'; // Aplicamos una clase para estilos opcionales

                // Añadimos el emoji de reportar al comentario
                nuevoComentario.appendChild(reporteEmoji);

                // Añadimos el elemento de lista al contenedor de la lista de comentarios en el HTML
                listaComentarios.appendChild(nuevoComentario);
            }
        }

        const listaImagenes = document.getElementById('ImageCarrusel');

        // Recorremos el mapa de imágenes
        for (const key in documentData["lista_imagenes"]) {
            if (Object.hasOwnProperty.call(documentData["lista_imagenes"], key)) {
                // Creamos un nuevo elemento de lista (<li>) para cada imagen
                //const divImage = document.getElementById('pepejuan');

                // Creamos un nuevo elemento de imagen (<img>) para la imagen
                const nuevaImagen = document.createElement('img');

                // Obtenemos la URL de la imagen correspondiente
                const imageUrl = await fetchImage(documentData["lista_imagenes"][key]);

                // Establecemos la URL de la imagen como el atributo src del elemento de imagen
                nuevaImagen.src = imageUrl;
                // Agregamos el elemento de imagen al elemento de lista
                //divImage.appendChild(nuevaImagen);

                // Agregamos el elemento de lista al contenedor de imágenes en el HTML
                listaImagenes.appendChild(nuevaImagen);

            }
        }
    }
}