// Función para mostrar u ocultar un elemento


// Obtenemos los elementos description y title cuando se carga el DOM
import {uploadAllImagesToAPI} from "./UploadImages.js";

document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar elementos después de que el DOM esté completamente cargado
    var description = document.getElementById('descripcion');
    var title = document.getElementById('title');
    var form = document.getElementById('addComment');
    const user_id = localStorage.getItem("userId");
    const publication_id = localStorage.getItem("currentPublication");
    const inputElement = document.getElementById('imageUpload');
    var images = [];

    // Agregar evento de envío al formulario
    form.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevenir el comportamiento de envío predeterminado

        // Obtener valores de los campos de entrada
        const datos = {
            titulo: title.value,
            descripcion: description.value,
            user_id: user_id,
            publication_id: publication_id,
            lista_imagenes: await uploadAllImagesToAPI(images)
        };

        try {
            // Realizar la petición al servidor
            const opciones = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            };

            const response = await fetch('http://localhost:3000/api/addUniqueDoc/comentario', opciones);
            if (!response.ok) {
                throw new Error('Error al agregar datos');
            }

            // Obtener el ID del comentario agregado
            const data = await response.json();
            console.log('Datos agregados con éxito:', data);
            const comentarioId = data.id;

            // Modificar el documento de comentario con el ID del comentario
            await modifyDoc("comentario", comentarioId, {comment_id: comentarioId});

            // Obtener y actualizar la lista de comentarios asociada a la publicación
            let commentsList = await takePublicationCommentsList(publication_id);
            commentsList = commentsList.length === 0 ? [comentarioId] : [...commentsList, comentarioId];
            const newJson = { lista_comentarios: commentsList };
            await modifyDoc("publicacion", publication_id, newJson);
        } catch (error) {
            console.error('Error al agregar datos:', error);
        }
    });

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

    function takePublicationCommentsList(publication_id) {
        return fetch('http://localhost:3000/api/getDocument/publicacion/'+publication_id+'')
            .then(response => {
                // Verificar si la respuesta es exitosa (código de estado 200)
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                // Parsear la respuesta como JSON
                return response.json();
            })
            .then(data => {
                // Verificar si el campo lista_comentarios está presente en el documento
                if (data.hasOwnProperty('lista_comentarios')) {
                    const listaComentarios = data.lista_comentarios;
                    return listaComentarios;
                } else {
                    console.error('El campo lista_comentarios no está presente en el documento');
                    return null; // Devolver null en caso de que el campo no esté presente
                }
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
                throw error;
            });
    }

    async function modifyDoc(collection, document, data) {
        try {
            const response = await fetch(`http://localhost:3000/api/changeDoc/${collection}/${document}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Error al añadir el documento');
            }

            const responseDoc = await response.json(); // Esperar a que se resuelva la promesa de respuesta JSON
            return responseDoc;
        } catch (error) {
            console.error('Error al añadir a la lista del documento:', error);
            throw error;
        }
    }





    inputElement.addEventListener('change', loaderImage);


});

