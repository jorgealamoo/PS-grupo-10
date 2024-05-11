import {uploadAllImagesToAPI} from "../JavaScript/UploadImages.js";
const newImages = [];


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

async function checkCreator(userId, data) {
    if (userId == data.user_id) {
        document.getElementById('botonAñadir').style.display = 'block';
    } else {
        document.getElementById('botonAñadir').style.display = 'none';
    }
}


document.addEventListener('DOMContentLoaded', async function() {
    const inputElementImage = document.getElementById('imageUpload');
    const userId = localStorage.getItem('userId');
    const publicationID = localStorage.getItem('currentPublication');
    const infoPublicacion = await fetch('http://localhost:3000/api/getDocument/publicacion/' + publicationID);
    const data = await infoPublicacion.json();

    await checkCreator(userId, data);

    inputElementImage.addEventListener('change', loaderImage);
    document.getElementById('saveBtn').addEventListener('click', async function () {
        await addImageToDocument(publicationID);
    });
    const boton_borrar = document.getElementById("boton_eliminar_publicacion");
    boton_borrar.addEventListener("click",  function () {
        const modal = document.querySelector("#popUp_eliminar");
        modal.showModal();
        document.getElementById('confirmar_borrado').addEventListener('click',async () => {
            modal.close();
            borrarPublicación(publicationID);
            window.location.href = "../MapPage/map.html";
        });
        document.getElementById('cancelar_borrado').addEventListener('click',async () => {
            modal.close();
        });

    });

});
async function addImageToDocument(documentID) {
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

async function borrarPublicación(publicationID) {
    const documento = await fetch('http://localhost:3000/api/getDocument/publicacion/'+publicationID);
    const documentoData = await documento.json();

    for (var i = 0; i<documentoData.lista_comentarios.length; i++) {
        const comentario = await fetch('http://localhost:3000/api/getDocument/publicacion/'+documentoData.lista_comentarios[i]);
        const comentarioData = await comentario.json();
        await deleteFromDatabase(comentarioData.comment_id);
    }

    const creador = fetch('http://localhost:3000/api/getDocument/usuario/'+documentoData.user_id);
    //eliminar publicación de lista_publicacion

}

async function deleteFromDatabase(commentID) {
    try {
        const response = await fetch('http://localhost:3000/api/deleteDocument/comentario/' + commentID,{
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

