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




//.......... AQUÍ VA EL LOADER + MODAL
function loaderMedia(event) {
    const file = (event.target.files)[0];

    if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        const reader = new FileReader();
        const videoURL = URL.createObjectURL(file);
        reader.onload = function(event) {
            const mediaDataURL = event.target.result;

            // Show modal with media
            showModal(videoURL, mediaDataURL, file.type.startsWith('image/'));
        };
        reader.readAsDataURL(file);
    } else {
        console.warn('The selected file is not an image or a video:', file ? file.name : 'No file selected');
    }
}

function showModal(mediaDataURL, reader, isImage) {
    // Create modal container
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal';

    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    // Create close button
    const closeBtn = document.createElement('span');
    closeBtn.className = 'close';
    closeBtn.textContent = '×';

    // Append close button to modal content
    modalContent.appendChild(closeBtn);

    // Create container for media element
    const container = document.createElement('div');
    container.className = 'container';

    if (isImage) {
        const mediaElement = document.createElement('img');
        mediaElement.src = mediaDataURL;
        container.appendChild(mediaElement);
    } else {
        const videoElement = document.createElement('video');
        videoElement.src = mediaDataURL;
        videoElement.controls = true;
        container.appendChild(videoElement);
    }

    // Append container to modal content
    modalContent.appendChild(container);
    modalContainer.appendChild(modalContent);
    document.body.appendChild(modalContainer);

    // Show modal
    modalContainer.style.display = 'block';

    // Close modal when close button is clicked
    closeBtn.onclick = function() {
        closeModal(modalContainer);
    };

    // Add Cancel and Add Media buttons
    const footer = document.createElement('div');
    footer.className = 'modal-footer';
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.id = 'CancelBTN';
    cancelBtn.onclick = function() {
        closeModal(modalContainer);
    };
    const addMediaBtn = document.createElement('button');
    addMediaBtn.textContent = 'Add Media';
    addMediaBtn.id = 'AddBTN';
    addMediaBtn.onclick = function() {
        // Add media to array or perform any action needed
        images.push(reader);
        console.log(images)
        closeModal(modalContainer);
    };

    // Append buttons to footer
    footer.appendChild(cancelBtn);
    footer.appendChild(addMediaBtn);
    modalContent.appendChild(footer);
}


function closeModal(modalContainer) {
    modalContainer.style.display = 'none';
}

// Event listener for file input change
const fileInput = document.getElementById('imageUpload');
fileInput.addEventListener('change', loaderMedia);



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

function selectRate() {
    const rateButtons = document.getElementsByName('rate');
    let selectedRate = 0;
    for (const button of rateButtons) {
        if (button.checked) {
            selectedRate = parseInt(button.value);
            break;
        }
    }
    return selectedRate;
}

async function addDocument() {
    datos.valoracion = selectRate();
    console.log(datos.valoracion);
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
   const data = await fetch('http://localhost:3000/api/addUniqueDoc/publicacion', opciones)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al agregar datos');
            }
            return response.json();
        })
        .then(data => {
                console.log('Datos agregados con éxito:', data);
                return data;
            }
        ).catch(error => {
            console.error('Error al agregar datos:', error);
        });
   modifyDoc("publicacion",data.id,{publication_id:data.id});
   let publicationMap ={};
   publicationMap[data.id] = datos.nombre;
   modifyDoc("listas","publicaciones",{publicaciones:publicationMap});
   let publicationList = await takeUserPublicationList(user_id);
   if (publicationList.length === 0) {
       publicationList = [data.id];
   }else {
       publicationList.push(data.id);
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
document.addEventListener('DOMContentLoaded', addPingToMap());

document.getElementById('saveBtn').addEventListener('click', async function () {
    if (!checkVariables()) {
        alert('Debes rellenar todos los campos antes de crear la publicación');
    } else {
        await addDocument();
        //window.location.href = "../Account/account.html";
    }
});
