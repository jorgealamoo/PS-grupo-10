//import {initializeMap} from './loadMap.js';
const newImages = [];

var dataJSON = null

function initializeMap(latitude, longitude) {
    // Crea el mapa y configura la vista inicial utilizando las coordenadas proporcionadas
    var map = L.map('map',{
        maxZoom: 20,
        minZoom: 6,
        zoomControl: false
    }).setView([latitude, longitude], 17);
    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);
    // Añade una capa de mapa base (puedes elegir entre diferentes proveedores, como OpenStreetMap, Mapbox, etc.)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    // Añade un marcador en la posición especificada
    var marker = L.marker([latitude, longitude]).addTo(map);
    const southWest = L.latLng(-66.206333, -168.986456); // Esquina suroeste
    const northEast = L.latLng(78.829917, 179.876336); // Esquina noreste
    const bounds = L.latLngBounds(southWest, northEast);

// Aplica los límites al mapa
    map.setMaxBounds(bounds);
    map.on('drag', function () {
        map.panInsideBounds(bounds, { animate: false });
    });
    return map;
}


// Agrega un evento de clic al botón de cerrar
document.querySelector('.close').addEventListener('click', function () {
    // Oculta el pop-up al hacer clic en el botón de cerrar
    popup.style.display = 'none';
});


function createScore(valoration) {
    const valorationElement = document.getElementById("score");
    valorationElement.innerHTML = valoration;
    const valorationValue = parseFloat(valoration);
    const roundedValue = Math.floor(valorationValue);

    // Agregar cinco estrellas vacías por defecto
    for (let i = 0; i < 5; i++) {
        const star = document.createElement('span');
        star.className = 'star';
        star.innerHTML = '&#9734;'; // Unicode de estrella vacía
        valorationElement.appendChild(star);
    }

    // Rellenar las estrellas según el puntaje
    for (let i = 0; i < roundedValue; i++) {
        const star = valorationElement.children[i];
        star.innerHTML = '&#9733;';
    }
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

async function fetchImageType(imageurl) {
    try {
        const response = await fetch('http://localhost:3000/api/getImage/' + imageurl);
        if (!response.ok) {
            throw new Error('Failed to fetch image');
        }
        const data = await response.json();
        return data.imageType;
    } catch (error) {
        console.error('Error fetching image:', error.message);
        return null;
    }
}

async function loadComment(comment_list) {
    for (let comment of comment_list) {
        const response = await fetch('http://localhost:3000/api/getDocument/comentario/' + comment)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Can not load comment");
                }
                return response.json();
            });
        const user = await fetch('http://localhost:3000/api/getDocument/usuario/' + response.user_id)
            .then(async response => {
                if (!response.ok) {
                    throw new Error("Fail to fetch document");
                }
                return await response.json()
            });
        const userName = user.nombre;
        const photoUser = await fetchImage(user.photoPerfil);
        const text = response.contenido;
        const titulo = response.titulo;
        const userID = response.user_id;
        const imagenEditar = await fetchImage("2024-04-29T11_43_27_805Z_image.png");

        let imageComment = [];
        for (const imageUrl of response.lista_imagenes) {
            const image = await fetchImage(imageUrl);
            if (image) {
                imageComment.push(image);
            }
        }
        createComment(userName, photoUser, text, titulo, userID, imageComment, imagenEditar, response.comment_id);
    }
}

function confirmationMessage(commentID) {
    const confirmDelete = confirm("¿Estás seguro de que quieres borrar este comentario?");
    if (confirmDelete) deleteComment(commentID);
}


function createComment(userName, photoUser, text, title, userID, imageComment, imagenEditar, commentID) {
    var comentariosDiv = document.getElementById('coments');

    // Create new comment element
    var nuevoComentario = document.createElement('div');
    nuevoComentario.id = userID;
    nuevoComentario.classList.add('comentario');

    // Create header-comment div
    var headerCommentDiv = document.createElement('div');
    headerCommentDiv.classList.add('header-comment');
    nuevoComentario.appendChild(headerCommentDiv);

    // Create image element
    var imagenComentarioImg = document.createElement('img');
    imagenComentarioImg.src = photoUser;
    imagenComentarioImg.classList.add('imagen-comentario');
    imagenComentarioImg.addEventListener('click', function () {
        redirectToUser(userID);
    });
    headerCommentDiv.appendChild(imagenComentarioImg);

    // Create nombre h3 element
    var nombreH3 = document.createElement('h3');
    nombreH3.classList.add('nombre');
    nombreH3.textContent = userName;
    nombreH3.addEventListener('click', function () {
        redirectToUser(userID);
    });
    headerCommentDiv.appendChild(nombreH3);

    if (userID == localStorage.getItem('userId')) {
        const editComment = document.createElement('img');
        editComment.src = imagenEditar;
        editComment.style.width = 'auto';
        editComment.style.height = '20px';
        editComment.style.float = 'right'
        editComment.style.border = 'none';
        editComment.style.marginLeft = 'auto';
        editComment.addEventListener('click', function() {
            editarComentario(userID, commentID, text, title);
        });
        headerCommentDiv.appendChild(editComment);
    }
    // Create title div
    var titleDiv = document.createElement('div');
    titleDiv.classList.add('title');
    titleDiv.textContent = title;
    nuevoComentario.appendChild(titleDiv);

    // Create mensaje div
    var mensajeDiv = document.createElement('div');
    mensajeDiv.classList.add('mensaje');
    mensajeDiv.textContent = text;
    nuevoComentario.appendChild(mensajeDiv);

    // Create container for additional images
    var imagesContainer = document.createElement('div');
    imagesContainer.classList.add('images-container');
    nuevoComentario.appendChild(imagesContainer);

    //Crear imagen añadida por el usuario

    if (imageComment != null) {
        if (Array.isArray(imageComment)) {
            imageComment.forEach(function (imageUrl) {
                var imageAddComment = document.createElement('img');
                imageAddComment.src = imageUrl;
                imageAddComment.classList.add('additional-image');
                imagesContainer.appendChild(imageAddComment);
            });
        }
    }


    if (userID == localStorage.getItem('userId')) {
        const deleteButton = document.createElement('img');
        deleteButton.src = "../Images/borrar.png";
        deleteButton.classList.add("deleteButton");
        deleteButton.style.width = 'auto';
        deleteButton.style.height = '30px';
        deleteButton.style.float = 'right'
        deleteButton.style.border = 'none';
        deleteButton.style.marginLeft = '10px';
        deleteButton.addEventListener('click', function () {
            confirmationMessage(commentID);
        });
        headerCommentDiv.appendChild(deleteButton);
    }

    // Append the new comment to the comments div
    comentariosDiv.appendChild(nuevoComentario);
}



document.addEventListener('DOMContentLoaded', function () {
    // Obtener todas las imágenes de comentarios
    const commentImages = document.querySelectorAll('.additional-image');

    // Agregar evento de clic a cada imagen
    commentImages.forEach(function (image) {
        image.addEventListener('click', function () {
            // Mostrar la ventana emergente al hacer clic en la imagen
            const modal = document.getElementById('myModal');
            const modalImg = document.getElementById('modal-img');
            modal.style.display = "block";
            modalImg.src = this.src;

            // Agregar evento de clic al botón de cerrar la ventana emergente
            const closeBtn = document.getElementsByClassName("close")[0];
            closeBtn.addEventListener('click', function () {
                modal.style.display = "none"; // Ocultar la ventana emergente al hacer clic en el botón de cerrar
            });
        });
    });
});


async function deleteFromDatabase(commentID) {
    try {
        const response = await fetch('http://localhost:3000/api/deleteDocument/comentario/' + commentID, {
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


async function deleteComment(commentID) {
    const cp = localStorage.getItem("currentPublication");
    const lista_comentarios = await loadPublicationData("lista_comentarios", cp);
    const index = lista_comentarios.indexOf(commentID);
    lista_comentarios.splice(index, 1);
    const pubData = await fetch('http://localhost:3000/api/getDocument/publicacion/' + cp)
        .then(async response => {
            if (!response.ok) {
                throw new Error("Fail to fetch document");
            }
            return await response.json()
        });
    pubData['lista_comentarios'] = lista_comentarios;
    await modifyDoc("publicacion", cp, pubData);
    await deleteCommentImages(commentID);
    await deleteFromDatabase(commentID);
    alert("Comentario borrado con éxito");
    window.location.href = "../Publication/publication.html";
}

async function deleteCommentImages(commentID) {
    const data = await fetch('http://localhost:3000/api/getDocument/comentario/' + commentID)
        .then(async response => {
            if (!response.ok) {
                throw new Error("Fail to fetch document");
            }
            return await response.json();
        });
    const images = data['lista_imagenes'];
    if (images.length === 0) return;
    for (let i = 0; i < images.length; i++) {
        await fetch('http://localhost:3000/api/deleteImage' + images[i]);
    }
}

async function showCreatorData(user_id) {
    const user = await fetch('http://localhost:3000/api/getDocument/usuario/' + user_id)
        .then(async response => {
            if (!response.ok) {
                throw new Error("Fail to fetch document");
            }
            return await response.json()
        });
    const userName = user.usuario;
    const name = user.nombre;
    const apellido = user.apellido;
    const photoUser = await fetchImage(user.photoPerfil);
    document.getElementById("username").textContent = userName;
    document.getElementById("fullName").textContent = name + " " + apellido;
    document.getElementById("photoUser").src = photoUser;
}

async function isSave() {
    const user_id = localStorage.getItem('userId');
    const user = await fetch('http://localhost:3000/api/getDocument/usuario/' + user_id)
        .then(async response => {
            if (!response.ok) {
                throw new Error("Error al acceder al usuario");
            } else {
                return await response.json();
            }
        });
    //console.log(user.lista_guardados);
    if (user.lista_guardados && user.lista_guardados.some(item => item === localStorage.getItem('currentPublication'))) {
        const saves = document.getElementById('saves');
        saves.src = '/Front_end/Images/guardar-activate.png';
    }

}


function getTypeFromMimeType(mimeType) {
    if (mimeType.startsWith('image/')) {
        return 'image';
    } else if (mimeType.startsWith('video/')) {
        return 'video';
    } else {
        return 'unknown';
    }
}


async function displayDocumentData() {
    const documentData = await fetchDocument();
    if (documentData) {
        // Update the name element's text content
        document.getElementById('name').textContent = documentData['nombre'];
        document.getElementById('description').textContent = documentData['descripcion'];
        await showCreatorData(documentData['user_id']);
        const location = documentData['ubicacion'];
        const latitude = location.latitude;
        const longitude = location.longitude;
        const map = initializeMap(latitude, longitude);
        const listaImagenes = document.getElementById('ImageCarrusel');
        console.log(documentData["lista_imagenes"]);

        for (const key in documentData["lista_imagenes"]) {
            if (Object.hasOwnProperty.call(documentData["lista_imagenes"], key)) {
                const url = await fetchImage(documentData["lista_imagenes"][key]);
                const type = await fetchImageType(documentData["lista_imagenes"][key]);
                const mediaType = await getTypeFromMimeType(type);
                console.log(url + " || " + mediaType)

                if (mediaType === 'image') {
                    const nuevaImagen = document.createElement('img');
                    nuevaImagen.src = url;
                    listaImagenes.appendChild(nuevaImagen);
                } else if (mediaType === 'video') {
                    const nuevoVideo = document.createElement('video');
                    nuevoVideo.src = url;
                    nuevoVideo.controls = true; // Add controls to the video element
                    listaImagenes.appendChild(nuevoVideo);
                }
            }
        }
        console.log(listaImagenes)
        console.log(dataJSON["ubicacion"].latitude)
        console.log(dataJSON["ubicacion"].longitude)

        await loadComment(documentData["lista_comentarios"]);
        createScore(documentData["valoracion"]);
        await isSave();
    }
}

async function modifyDoc(collection, document, data) {
    try {
        const response = await fetch(`http://localhost:3000/api/changeDoc/` + collection + '/' + document + '', {
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

async function updateRating(rating) {
    const publicationID = localStorage.getItem('currentPublication');

    try {
        const response = await fetch('http://localhost:3000/api/getDocument/publicacion/' + publicationID);
        if (!response.ok) {
            throw new Error("Error al cargar la publicación");
        }

        const data = await response.json();

        let ratingList = data.hasOwnProperty("rating_list") ? data.rating_list : {};

        // Agrega el nuevo rating al ratingList
        ratingList[localStorage.getItem('userId')] = rating;

        // Calcula la media de las valoraciones en el ratingList
        let totalRating = 0;
        let numRatings = 0;
        for (const userId in ratingList) {
            if (ratingList.hasOwnProperty(userId)) {
                totalRating += parseInt(ratingList[userId]);
                numRatings++;
            }
        }
        const averageRating = (totalRating / numRatings).toFixed(2);

        // Actualiza la valoración global de la publicación
        const updatedData = {
            ...data,
            rating_list: ratingList,
            valoracion: averageRating
        };

        // Guarda los cambios en la base de datos
        await modifyDoc('publicacion', publicationID, updatedData);
        window.location.href = "../Publication/publication.html";

        console.log("Valoración actualizada con éxito:", averageRating);
    } catch (error) {
        console.error('Error al actualizar la valoración:', error.message);
    }

}

async function changeIcon() {
    const user_id = localStorage.getItem('userId');
    const user = await fetch('http://localhost:3000/api/getDocument/usuario/' + user_id)
        .then(async response => {
            if (!response.ok) {
                throw new Error("Error al acceder al usuario");
            } else {
                return await response.json();
            }
        });
    const button = document.getElementById('saves');
    if (button.src.endsWith('guardar-activate.png')) {
        button.src = '/Front_end/Images/guardar-instagram.png';
        await modifyDoc('usuario', user_id, {lista_guardados: user.lista_guardados.filter(item => item !== localStorage.getItem('currentPublication'))})

    } else {
        button.src = '/Front_end/Images/guardar-activate.png';
        saves = user.lista_guardados;
        saves.push(localStorage.getItem('currentPublication'))
        await modifyDoc('usuario', user_id, {lista_guardados: saves})

    }
}

document.addEventListener("DOMContentLoaded", function () {
    function myFunction(event) {
        console.log(event.target.id + " was clicked.");
    }

    // Get all div elements with the class 'prpr'
    var prprDivs = document.getElementsByClassName('comentario');
    console.log(prprDivs)

    // Add onclick event listener to each prpr div
    Array.from(prprDivs).forEach(function (prprDiv) {
        prprDiv.addEventListener('click', myFunction);
    });
});

function redirectToCreatorUser() {
    localStorage.setItem('viewAccountId', dataJSON["user_id"]);
    window.location.href = "../ViewAccount/viewAccount.html";
}

function redirectToUser(userID) {
    localStorage.setItem('viewAccountId', userID);
    window.location.href = "../ViewAccount/viewAccount.html";
}

function redirectGoogleMaps() {
    // Crear la URL de Google Maps con la latitud y longitud especificadas
    var url = "https://www.google.com/maps?q=" + dataJSON["ubicacion"].latitude + "," + dataJSON["ubicacion"].longitude;
    // Abrir la ubicación en Google Maps en una nueva ventana
    window.open(url);
}





function loaderImage(event) {
    console.log('Se ha iniciado loaderImage');
    const files = event.target.files;
    console.log('Se esta cargando la imagen');
    for (const file of files) {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const imageDataURL = event.target.result;
                newImages.push(imageDataURL);
            };
            reader.readAsDataURL(file);
        } else {
            console.warn('El archivo seleccionado no es una imagen:', file ? file.name : 'No se seleccionó ningún archivo');
        }
    }
    console.log(newImages);
}
async function addImageToDocument(documentID) {
    try {
        const documento = await fetch('http://localhost:3000/api/getDocument/comentario/'+documentID);
        const documentoData = await documento.json();

        if (!documento.ok) {
            throw new Error('Error al obtener el documento');
        }
        console.log(newImages);
        const currentImageList = documentoData.lista_imagenes;
        const imagenNueva = await uploadAllImagesToAPI(newImages);
        const updatedImageList = [...currentImageList, ...imagenNueva];

        await modifyDoc('comentario', documentID, {lista_imagenes:updatedImageList});

        console.log('Imagen añadida correctamente a la lista de imágenes del documento.');
    } catch (error) {
        console.error('Error al añadir la imagen al documento:', error);
        throw error;
    }
}
async function editarComentario(userID, commentID,  contenido, titulo) {
    const modal = document.querySelector("#modal");
    document.getElementById("editTitle").value = titulo;
    document.getElementById("edit_contenido").value = contenido;
    const inputElementImage = document.getElementById('imageUpload_Comment');
    modal.showModal();
    var vaciar = false;

    inputElementImage.addEventListener('change', loaderImage);

    document.getElementById('edit_submit').addEventListener('click',async (event) => {
        event.preventDefault();

        var texto_contenido = document.getElementById('edit_contenido').value;

        await modifyDoc('comentario', commentID, {contenido: texto_contenido});

        var titulo_contenido = document.getElementById('editTitle').value;

        await modifyDoc('comentario', commentID, {titulo: titulo_contenido});

        if (vaciar == true) {
            await modifyDoc('comentario', commentID, {lista_imagenes: []});
        }
        if (newImages.length > 0) {
            await addImageToDocument(commentID);
        }
        window.location.href = "../Publication/publication.html";
    });
    document.getElementById('delete_edit_imageUpload_Comment').addEventListener('click', async (event) => {
        event.preventDefault();
        const borrar = document.getElementById("confirmacion_borrar")
        if (vaciar == false) {
            vaciar = true;
            borrar.style.display = "block";
        } else {
            vaciar = false;
            borrar.style.display = "none";
        }
    });

    document.getElementById('salir_button').addEventListener('click',async (event) => {
        event.preventDefault();
        const cancelarEditar = document.querySelector("#cancelarEditar");
        cancelarEditar.showModal();

        document.getElementById('cancel_button').addEventListener('click',async () => {
            modal.close();
            cancelarEditar.close();
            window.location.href = "../Publication/publication.html";
        });
        document.getElementById('volver_button').addEventListener('click',async () => {
            cancelarEditar.close();
        });
    });
}


async function uploadAllImagesToAPI(imageList) {
    const successfulUploads = [];

    // Iterar sobre cada imagen en la lista
    for (const imageDataURL of imageList) {
        try {
            // Cargar la imagen a la API
            const uploadedImageName = await uploadImageToAPI(imageDataURL);
            if (uploadedImageName !== null) {
                successfulUploads.push(uploadedImageName);
            }
        } catch (error) {
            console.error('Error al subir una imagen:', error.message);
        }
    }
    return successfulUploads;
}

async function uploadImageToAPI(imageDataURL) {
    const url = 'http://localhost:3000/api/uploadImage';
    const formData = new FormData();

    // Convertir el Data URL en un Blob
    const blob = dataURLtoBlob(imageDataURL);

    // Agregar la imagen al FormData
    formData.append('file', blob, 'image.png'); // Puedes ajustar el nombre del archivo según tu preferencia

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Error al subir la imagen: ' + response.statusText);
        }

        // Parsear la respuesta para obtener el nombre de la imagen
        const responseData = await response.json();
        const imageName = responseData.fileName;

        return imageName;
    } catch (error) {
        // Manejar errores
        console.error('Error al subir la imagen:', error.message);
        return null;
    }
}

// Función para convertir un Data URL en un Blob
function dataURLtoBlob(dataURL) {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}