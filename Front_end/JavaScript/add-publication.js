import {uploadAllImagesToAPI} from './UploadImages.js';
import {initializeMap} from './loadMap.js';

//localStorage.setItem('userId', '0zbkPGwrhlfAjIcQ3odeqSte5jD3'); //para poder hacer pruebas

var Pointermap = {};
var comment = document.getElementById('description');
var images   = [];
const inputElement = document.getElementById('imageUpload');
var comment_list = [];
var label=[];
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
    lista_imagenes: [],
    nombre: titel,
    ubicacion: Pointermap,
    user_id: user_id,
    valoracion:valoracion,
    descripcion:comment
};

function showImage(fileElement) {
    if (fileElement && fileElement.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const imageDataURL = event.target.result;
            document.getElementById('addImageLabel').style.backgroundImage = `url('${imageDataURL}')`;
        };
        reader.readAsDataURL(fileElement);
    } else {
        console.warn('El archivo seleccionado no es una imagen:', fileElement ? fileElement.name : 'No se seleccionó ningún archivo');
    }
}

function loaderImage(event) {
    const files = event.target.files;
    showImage(files[0]);
    for (const file of files) {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const imageDataURL = event.target.result;
                images.push(imageDataURL);
            };
            reader.readAsDataURL(file);
        } else {
            console.warn('El archivo seleccionado no es una imagen:', file ? file.name : 'No se seleccionó ningún archivo');
        }
    }
    console.log(images);
}


function takeUserPublicationList(userID) {
    return fetch('http://localhost:3000/api/getDocument/usuario/'+userID+'')
        .then(response => {
            // Verificar si la respuesta es exitosa (código de estado 200)
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Parsear la respuesta como JSON
            return response.json();
        })
        .then(data => {
            // Verificar si el campo lista_publicaciones está presente en el documento
            if (data.hasOwnProperty('lista_publicaciones')) {
                const listaPublicaciones = data.lista_publicaciones;
                return listaPublicaciones;
            } else {
                console.error('El campo lista_publicaciones no está presente en el documento');
                return null; // Devolver null en caso de que el campo no esté presente
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            throw error;
        });
}


async function modifyDoc(collection,document,data) {
    try {
        const response = await fetch(`http://localhost:3000/api/changeDoc/`+collection+'/'+document+'', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Error al añadir el documento');
        }
        const responseDoc = await response.json();
        //console.log(data);
        return data;
    } catch (error) {
        console.error('Error al añadir a la lista del documento:', error);
        throw error;
    }
}

async function addDocument() {
    datos.descripcion = comment.value.trim();
    datos.nombre = titel.value.trim();
    //console.log(images);
    datos.lista_imagenes = await uploadAllImagesToAPI(images);
    let opciones = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    };
   const id = await fetch('http://localhost:3000/api/addUniqueDoc/publicacion', opciones)
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
   modifyDoc("publicacion",id,{publication_id:id});
   let publicationList = await takeUserPublicationList(user_id);
   if (publicationList.length === 0) {
       publicationList = [id];
   }else {
       publicationList.push(id);
   }
   const newJson = {
       lista_publicaciones: publicationList
   }
   modifyDoc("usuario",user_id,newJson);
}

function checkVariables() {
    let result = true;
    if(Object.keys(Pointermap).length === 0){
        result = false;
    }if (comment.value === ""){
        result = false;
    }if (titel.value === "") {
        result = false;
    }if (Object.keys(images).length === 0){
        result = false;
    }
    return result;
}

export {datos};
inputElement.addEventListener('change', loaderImage);
document.addEventListener('DOMContentLoaded', addPingToMap());

document.getElementById('saveBtn').addEventListener('click', async function () {
    if (!checkVariables()) {
        alert('Debes rellenar todos los campos antes de crear la publicación');
    } else {
        await addDocument();
        window.location.href = "../Account/account.html";
    }
});
