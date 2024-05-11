//import {initializeMap} from './loadMap.js';

const newImages = [];
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


async function loadComment(comment_list) {
    for ( comment of comment_list){
        const response = await fetch('http://localhost:3000/api/getDocument/comentario/' + comment)
            .then(response =>{
                if (!response.ok){
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
        var userName = user.nombre;
        var photoUser =  await fetchImage(user.photoPerfil);
        var text = response.contenido;
        var titulo = response.titulo;
        var userID = response.user_id;
        var imagenEditar = await fetchImage("2024-04-29T11_43_27_805Z_image.png");

        var imageComment = null;
        if (response.lista_imagenes.length > 0) {
             imageComment = await fetchImage(response.lista_imagenes[0]);
        }
        createComment(userName,photoUser,text,titulo, userID, imageComment, imagenEditar, response.comment_id);

    }
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
    imagenComentarioImg.addEventListener('click', function() {
        redirectToUser(userID);
    });

    headerCommentDiv.appendChild(imagenComentarioImg);

    // Create nombre h3 element
    var nombreH3 = document.createElement('h3');
    nombreH3.classList.add('nombre');
    nombreH3.textContent = userName;
    nombreH3.addEventListener('click', function() {
        redirectToUser(userID);
    });
    headerCommentDiv.appendChild(nombreH3);

    if (userID == localStorage.getItem('userId')) {
        var editComment = document.createElement('img');
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

    //Crear imagen añadida por el usuario
    if (imageComment != null) {
        var imageAddComment = document.createElement('img');
        imageAddComment.src = imageComment;
        imageAddComment.style.width = 'auto';
        imageAddComment.style.height = '300px';
        imageAddComment.style.display = 'block'; // Hacer que la imagen sea un bloque para centrarla horizontalmente
        imageAddComment.style.margin = '0 auto'
        nuevoComentario.appendChild(imageAddComment);
    }
    // Append the new comment to the comments div
    comentariosDiv.appendChild(nuevoComentario);
}


async function showCreatorData(user_id) {
    const user = await fetch('http://localhost:3000/api/getDocument/usuario/' + user_id)
        .then(async response => {
            if (!response.ok) {
                throw new Error("Fail to fetch document");
            }
            return await response.json()
        });
    var userName = user.nombre;
    var photoUser = await fetchImage(user.photoPerfil);
    document.getElementById("username").textContent = userName;
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
    console.log(user.lista_guardados);
    if(user.lista_guardados && user.lista_guardados.some(item => item === localStorage.getItem('currentPublication'))){
        const saves = document.getElementById('saves');
        saves.src='/Front_end/Images/guardar-activate.png';
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
        for (const key in documentData["lista_imagenes"]) {
            if (Object.hasOwnProperty.call(documentData["lista_imagenes"], key)) {
                const nuevaImagen = document.createElement('img');
                const imageUrl = await fetchImage(documentData["lista_imagenes"][key]);
                nuevaImagen.src = imageUrl;
                listaImagenes.appendChild(nuevaImagen);
            }
        }
        await loadComment(documentData["lista_comentarios"]);
        createScore(calculateValoration(documentData["valoracion"]));
        await isSave();
    }
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
function calculateValoration(publicationValoration) {
    return publicationValoration;
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
        await modifyDoc('usuario',user_id,{lista_guardados: user.lista_guardados.filter(item => item !== localStorage.getItem('currentPublication'))})

    } else {
        button.src = '/Front_end/Images/guardar-activate.png';
        saves = user.lista_guardados;
        saves.push(localStorage.getItem('currentPublication'))
        await modifyDoc('usuario',user_id,{lista_guardados: saves})

    }
}

document.addEventListener("DOMContentLoaded", function() {
    const userId = localStorage.getItem('userId');
    document.getElementById("photoUser").addEventListener("click", redirectToCreatorUser);
    document.getElementById("username").addEventListener("click", redirectToCreatorUser);

    function myFunction(event) {
        console.log(event.target.id + " was clicked.");
    }

    // Get all div elements with the class 'prpr'
    var prprDivs = document.getElementsByClassName('comentario');
    console.log(prprDivs)

    // Add onclick event listener to each prpr div
    Array.from(prprDivs).forEach(function(prprDiv) {
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
            vaciar = true;
            borrar.style.display = "block";

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
        document.getElementById('confirmar_borrado').addEventListener('click',async () => {
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
