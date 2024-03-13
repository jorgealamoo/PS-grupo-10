var Pointermap = {};
var comment = document.getElementById('description');
var image   = {};
var comment_list = {};
var label={};
var titel = document.getElementById('publicationName');
var user_id="";
var valoracion = 0;
function initializeMap() {
    var map = L.map('map').setView([28.072876, -15.451502], 17);

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
    var marker = null;
    // Evento de doble clic en el mapa para crear un ping
    function addMark(e) {
        if (marker) {
            // Si hay un marcador existente, elimínalo
            map.removeLayer(marker);
        }
        // Agregar el nuevo marcador
        marker = L.marker(e.latlng).addTo(map);
        Pointermap.latitude = e.latlng.lat;
        Pointermap.longitude = e.latlng.lng;
    }
    map.on('click', addMark);
}
// Llamada a la función de inicialización cuando se cargue la página
document.addEventListener('DOMContentLoaded', initializeMap());



const datos = {
    lista_comentarios: comment_list,
    lista_etiquetas: label,
    lista_imagenes: image,
    nombre: titel,
    ubicacion: Pointermap,
    user_id:0,
    valoracion:valoracion,
    descripcion:comment
};

// URL de la API para agregar un documento a la colección especificada
// Opciones para la solicitud POST
let opciones = {
    method: 'POST', // Método HTTP POST para agregar datos
    headers: {
        'Content-Type': 'application/json' // Especificar que estamos enviando datos en formato JSON
    },
    body: JSON.stringify(datos) // Convertir el objeto JSON a una cadena JSON antes de enviarlo
};

// Realizar la solicitud fetch
async function addDocument() {
    datos.descripcion = comment.value.trim();
    datos.nombre = titel.value.trim();
    opciones = {
        method: 'POST', // Método HTTP POST para agregar datos
        headers: {
            'Content-Type': 'application/json' // Especificar que estamos enviando datos en formato JSON
        },
        body: JSON.stringify(datos) // Convertir el objeto JSON a una cadena JSON antes de enviarlo
    };
    const id = await fetch('http://localhost:3000/api/addUniqueDoc/publicacion',opciones)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al agregar datos');
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos agregados con éxito:', data);
            return data.id;
            }
        ).catch(error => {
            console.error('Error al agregar datos:', error);
        });
    datos.publicacion_id = id;

}
function checkVariables() {
    result = true;
    if(Object.keys(Pointermap).length === 0){
        mapDiv = document.getElementById('icono-advertencia_ubi');
        mapDiv.style.display = "inline-block";
        setTimeout(()=>{
            mapDiv.style.display = "none";
        },2000);
        result = false;
    }if (comment.value === ""){
        commentDiv = document.getElementById('icono-advertencia_description');
        commentDiv.style.display = "inline";
        setTimeout(()=>{
            commentDiv.style.display = "none";
        },2000);
        result = false;
    }if (titel.value === "") {
        nameDiv = document.getElementById('icono-advertencia-name');
        nameDiv.style.display = "inline";
        setTimeout(() => {
            nameDiv.style.display = "none";
        }, 2000);
        result = false;
    }

    return result;
}
document.getElementById('saveBtn').addEventListener('click', function() {


    if(!checkVariables()){
       // alert('Debes rellenar todos los campos antes de crear la publicación');
    }else {addDocument();}
});