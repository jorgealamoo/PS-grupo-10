import {uploadAllImagesToAPI} from './UploadImages.js';
import {initializeMap} from './loadMap.js';

localStorage.setItem('userId', 'EjemploIdUser'); //para poder hacer pruebas

var Pointermap = {};
var comment = document.getElementById('description');
var images   = {};
const inputElement = document.getElementById('imageUpload');
var comment_list = {};
var label={};
var titel = document.getElementById('publicationName');
var user_id= localStorage.getItem('userId');
var valoracion = 0;


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
const datos = {
    lista_comentarios: comment_list,
    lista_etiquetas: label,
    lista_imagenes: images,
    nombre: titel,
    ubicacion: Pointermap,
    user_id: user_id,
    valoracion:valoracion,
    descripcion:comment
};

function loaderImage(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const imageDataURL = event.target.result;
            document.getElementById('addImageLabel').style.backgroundImage = `url('${imageDataURL}')`;
        };
        reader.readAsDataURL(file);
    } else {
        console.warn('El archivo seleccionado no es una imagen:', file ? file.name : 'No se seleccionó ningún archivo');
    }
}


async function addDocument() {
    datos.descripcion = comment.value.trim();
    datos.nombre = titel.value.trim();
    let opciones = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
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
    let result = true;
    if(Object.keys(Pointermap).length === 0){
        let mapDiv = document.getElementById('icono-advertencia_ubi');
        mapDiv.style.display = "inline-block";
        setTimeout(()=>{
            mapDiv.style.display = "none";
        },2000);
        result = false;
    }if (comment.value === ""){
        let commentDiv = document.getElementById('icono-advertencia_description');
        commentDiv.style.display = "inline";
        setTimeout(()=>{
            commentDiv.style.display = "none";
        },2000);
        result = false;
    }if (titel.value === "") {
        let nameDiv = document.getElementById('icono-advertencia-name');
        nameDiv.style.display = "inline";
        setTimeout(() => {
            nameDiv.style.display = "none";
        }, 2000);
        result = false;
    }if (Object.keys(images).length === 0){
        let item = document.querySelectorAll(".add_images_section");
        let original = item.style.borderColor;
        item.style.borderColor = "#ff0000";
        setTimeout(() => {
            item.style.borderColor = original;
        }, 2000);
        result = false;
    }

    return result;
}

export {datos};
inputElement.addEventListener('change', loaderImage);
document.addEventListener('DOMContentLoaded', addPingToMap());
document.getElementById('saveBtn').addEventListener('click', function() {
    if(!checkVariables()){
       // alert('Debes rellenar todos los campos antes de crear la publicación');
    }else {addDocument();}
});