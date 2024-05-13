import {uploadAllImagesToAPI} from './UploadImages.js';
import {initializeMap} from './loadMap.js';
import {deleteDocument, addToList} from './cargarTodasLasPublicaciones.js';
import {initCarousel, moveCarousel, getSlideNumber} from './carrusel.js'



var Pointermap = {};
var comment = document.getElementById('description');
var images   = [];
var selectedImages   = [];
var fileType   = [];    //true == image | false == video
var imagesTrash   = [];
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
    descripcion:comment,
    rating_list: {}
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
    console.log("Deciding On: " + mediaDataURL)

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
        imagesTrash.push(reader)
        console.log(images)
        closeModal(modalContainer);
    };
    const addMediaBtn = document.createElement('button');
    addMediaBtn.textContent = 'Add Media';
    addMediaBtn.id = 'AddBTN';
    addMediaBtn.onclick = function() {
        // Add media to array or perform any action needed
        images.push(reader);
        selectedImages.push(mediaDataURL)
        fileType.push(isImage)
        console.log(images, fileType)
        closeModal(modalContainer);
    };

    // Append buttons to footer
    footer.appendChild(cancelBtn);
    footer.appendChild(addMediaBtn);
    modalContent.appendChild(footer);
}

function showFilesSelectedModal() {
    // Create modal container
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal';

    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    // Create close button
    const closeDIV = document.createElement('div');
    closeDIV.className = 'close-div';
    const closeBtn = document.createElement('span');
    closeBtn.className = 'close';
    closeBtn.textContent = '×';

    // Append close button to modal content
    closeDIV.appendChild(closeBtn)
    modalContent.appendChild(closeDIV);

    // Create container for media element
    const container = document.createElement('div');
    container.className = 'container';

    if (images.length == 0) {   //No hay imágenes
        const emptyMessage = document.createElement('h1');
        emptyMessage.textContent = 'No Media Selected';
        container.appendChild(emptyMessage)
    } else {    //Hay imágenes
        // Crear el carrusel
        const carousel = document.createElement('div');
        carousel.id = 'ImageCarrusel';
        carousel.className = 'image-carousel-container';

        console.log("Viewing: " + selectedImages)

        //------------------------------ AÑADIR IMÁGENES/VIDEOS A CARROUSEL
        for (let i = 0; i < images.length; i++) {
            if (fileType[i]) { //Es una imagen
                const nuevaImagen = document.createElement('img');
                nuevaImagen.src = selectedImages[i];
                carousel.appendChild(nuevaImagen);
            } else {    //Es un vídeo
                const nuevoVideo = document.createElement('video');
                nuevoVideo.src = selectedImages[i];
                nuevoVideo.controls = true; // Add controls to the video element
                carousel.appendChild(nuevoVideo);
            }
        }

        // Crear botones de navegación
        const leftButton = document.createElement('div');
        leftButton.className = 'carousel-button left';
        leftButton.textContent = '❮';
        leftButton.onclick = function() {
            moveCarousel(-1);
            console.log(getSlideNumber())
        };

        const rightButton = document.createElement('div');
        rightButton.className = 'carousel-button right';
        rightButton.textContent = '❯';
        rightButton.onclick = function() {
            moveCarousel(1);
            console.log(getSlideNumber())
        };

// Agregar los botones al carrusel
        carousel.appendChild(leftButton);
        carousel.appendChild(rightButton);

// Agregar el carrusel al contenedor
        container.appendChild(carousel);
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

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.id = 'DeleteBTN';
    deleteBtn.onclick = function() {
        images.splice(getSlideNumber()-1, 1);
        fileType.splice(getSlideNumber()-1, 1);
        selectedImages.splice(getSlideNumber()-1, 1);
        closeModal(modalContainer);
        console.log(images, fileType, selectedImages)
    };

    // Append buttons to footer
    footer.appendChild(cancelBtn);
    images.length !== 0 && footer.appendChild(deleteBtn);
    modalContent.appendChild(footer);
}



function closeModal(modalContainer) {
    modalContainer.style.display = 'none';
    modalContainer.remove();
}

function viewSelectedModal() {
    showFilesSelectedModal()
    initCarousel('.image-carousel-container img, .image-carousel-container video')
}

// Event listener for file input change
const fileInput = document.getElementById('imageUpload');
const carrouselView = document.getElementById('carrouselBTN');
fileInput.addEventListener('change', loaderMedia);
carrouselView.addEventListener('click', viewSelectedModal);

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
    datos.rating_list[localStorage.getItem('userId')] = datos.valoracion;
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
                //window.location.href = "../Account/account.html";
                return data;
            }
        ).catch(error => {
            console.error('Error al agregar datos:', error);
        });
   modifyDoc("publicacion",data.id,{publication_id:data.id});
   const nombre = datos.nombre;
   addToList("publicaciones",nombre,data.id);
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
   window.location.href = "../Account/account.html";
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
    }
});
