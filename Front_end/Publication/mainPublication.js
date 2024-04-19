import {uploadAllImagesToAPI} from "../JavaScript/UploadImages.js";

const inputElement = document.getElementById('imageUpload');
const newImages = [];


async function checkCreator(userId, data) {
    if (userId == data.user_id) {
        document.getElementById('botonAñadir').style.display = 'block';
    } else {
        document.getElementById('botonAñadir').style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    const userId = localStorage.getItem('userId');
    const publicationID = localStorage.getItem('currentPublication');
    const infoPublicacion = await fetch('http://localhost:3000/api/getDocument/publicacion/' + publicationID);
    const data = await infoPublicacion.json();

    await checkCreator(userId, data);

    inputElement.addEventListener('change', loaderImage);
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
function loaderImage(event) {
    const files = event.target.files;
    showImage(files[0]);
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
