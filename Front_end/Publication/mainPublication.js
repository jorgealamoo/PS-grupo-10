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




