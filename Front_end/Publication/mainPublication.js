import {uploadAllImagesToAPI} from "../JavaScript/UploadImages.js";
import {getSlideNumber, initCarousel, moveCarousel} from "../JavaScript/carrusel.js";
const newImages = [];
var selectedImages   = [];
var fileType   = [];    //true == image | false == video
var imagesTrash   = [];

var dataJSON = null;
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
        console.log(newImages)
        closeModal(modalContainer);
    };
    const addMediaBtn = document.createElement('button');
    addMediaBtn.textContent = 'Add Media';
    addMediaBtn.id = 'AddBTN';
    addMediaBtn.onclick = function() {
        // Add media to array or perform any action needed
        newImages.push(reader);
        selectedImages.push(mediaDataURL)
        fileType.push(isImage)
        console.log(newImages, fileType)
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

    if (newImages.length == 0) {   //No hay imágenes
        const emptyMessage = document.createElement('h1');
        emptyMessage.textContent = 'No Media Selected';
        container.appendChild(emptyMessage)
    } else {    //Hay imágenes
        // Crear el carrusel
        const carousel = document.createElement('div');
        carousel.id = 'ImageCarrusel';
        carousel.className = 'image-carousel-container-modal';

        console.log("Viewing: " + selectedImages)

        //------------------------------ AÑADIR IMÁGENES/VIDEOS A CARROUSEL
        for (let i = 0; i < newImages.length; i++) {
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
        newImages.splice(getSlideNumber()-1, 1);
        fileType.splice(getSlideNumber()-1, 1);
        selectedImages.splice(getSlideNumber()-1, 1);
        closeModal(modalContainer);
        console.log(newImages, fileType, selectedImages)
    };

    // Append buttons to footer
    footer.appendChild(cancelBtn);
    newImages.length !== 0 && footer.appendChild(deleteBtn);
    modalContent.appendChild(footer);
}


function closeModal(modalContainer) {
    modalContainer.style.display = 'none';
    modalContainer.remove();
}

async function checkCreator(userId, data) {
    if (userId == data.user_id) {
        document.getElementById('botonAñadir').style.display = 'block';
    } else {
        document.getElementById('botonAñadir').style.display = 'none';
    }
}


document.addEventListener('DOMContentLoaded', async function() {
    const inputElementImage = document.getElementById('imageUpload');
    const carrouselBTN = document.getElementById('carrouselBTN');
    const userId = localStorage.getItem('userId');
    const publicationID = localStorage.getItem('currentPublication');
    const infoPublicacion = await fetch('http://localhost:3000/api/getDocument/publicacion/' + publicationID);
    const data = await infoPublicacion.json();

    await checkCreator(userId, data);

    inputElementImage.addEventListener('change', loaderMedia);
    //carrouselBTN.addEventListener('click', viewSelectedModal);
    document.getElementById('saveBtn').addEventListener('click', async function () {
        await addImageToDocument(publicationID);
        window.location.href = "../Publication/publication.html";
    });
    const boton_borrar = document.getElementById("boton_eliminar_publicacion");
    boton_borrar.addEventListener("click",  function () {
        const modal = document.querySelector("#popUp_eliminar");
        modal.showModal();
        document.getElementById('confirmar_borrado').addEventListener('click',async () => {
            modal.close();
            await borrarPublicacion(publicationID);
            window.location.href = "../MapPage/map.html";
        });
        document.getElementById('cancelar_borrado').addEventListener('click',async () => {
            modal.close();
        });

    });

    function viewSelectedModal() {
        showFilesSelectedModal()
        initCarousel('.image-carousel-container-modal img, .image-carousel-container-modal video')
    }

});
export async function addImageToDocument(documentID) {
    try {
        const documento = await fetch('http://localhost:3000/api/getDocument/publicacion/'+documentID);
        const documentoData = await documento.json();

        if (!documento.ok) {
            throw new Error('Error al obtener el documento');
        }
        console.log(newImages);
        const currentImageList = documentoData.lista_imagenes;
        const imagenNueva = await uploadAllImagesToAPI(newImages);
        const updatedImageList = [...currentImageList, ...imagenNueva];

        await modifyDoc('publicacion', documentID, {lista_imagenes:updatedImageList});

        console.log('Imagen añadida correctamente a la lista de imágenes del documento.');
    } catch (error) {
        console.error('Error al añadir la imagen al documento:', error);
        throw error;
    }
}

async function borrarPublicacion(publicationID) {
        const documento = await fetch('http://localhost:3000/api/getDocument/publicacion/'+ publicationID);
    const documentoData = await documento.json();
    for (let i = 0; i<documentoData.lista_comentarios.length; i++) {
        const comentario = await fetch('http://localhost:3000/api/getDocument/comentario/'+documentoData.lista_comentarios[i]);
        const comentarioData = await comentario.json();
        let id = comentarioData.comment_id;
        await deleteFromDatabase('comentario',id);
    }

    const creador = await fetch('http://localhost:3000/api/getDocument/usuario/'+ documentoData.user_id);
    const creadorData = await creador.json();
    let listaPublicacionesActualizada = [];
    for (let j = 0; j<creadorData.lista_publicaciones.length;j++) {
        if (creadorData.lista_publicaciones[j] == documentoData.publication_id) {}
        else {
            listaPublicacionesActualizada.push(creadorData.lista_publicaciones[j]);
        }
    }
    await modifyDoc('usuario', creadorData.id, {lista_publicaciones:listaPublicacionesActualizada});

    await deleteFromDatabase('publicacion', publicationID);
}

async function deleteFromDatabase(coleccion, ID) {
    try {
        const response = await fetch('http://localhost:3000/api/deleteDocument/'+coleccion +'/' + ID,{
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Error deleting document');
        }
        const data = await response.json();
        console.log(data.message);
    } catch (error) {
        console.error('Error deleting document:', error);
    }
}




