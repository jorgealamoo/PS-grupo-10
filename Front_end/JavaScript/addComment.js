// Función para mostrar u ocultar un elemento


// Obtenemos los elementos description y title cuando se carga el DOM
import {uploadAllImagesToAPI} from "./UploadImages.js";

document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar elementos después de que el DOM esté completamente cargado
    var description = document.getElementById('descripcion');
    var title = document.getElementById('title');
    var form = document.getElementById('addComment');
    const user_id = localStorage.getItem("userId");
    const publication_id = localStorage.getItem("currentPublication")
    const inputElement = document.getElementById('imageUpload');
    var images= [];

    // Agregar evento de envío al formulario
    form.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevenir el comportamiento de envío predeterminado

        // Obtener valores de los campos de entrada
        const datos = {
            titulo: title.value,
            descripcion: description.value,
            user_id: user_id,
            publication_id: publication_id,
            lista_imagenes: []
        };

        datos.lista_imagenes = await uploadAllImagesToAPI(images);

        try {
            // Realizar la petición al servidor
            var opciones = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            };

            var response = await fetch('http://localhost:3000/api/addUniqueDoc/comentario', opciones);
            if (!response.ok) {
                throw new Error('Error al agregar datos');
            }

            var data = await response.json();
            console.log('Datos agregados con éxito:', data);
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

    function modifyDoc(collection,document,data) {
        try {
            const response =  fetch(`http://localhost:3000/api/changeDoc/` + collection + '/' + document + '', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Error al añadir el documento');
            }
            const responseDoc =  response.json();
            //console.log(data);
            return data;
        } catch (error) {
            console.error('Error al añadir a la lista del documento:', error);
            throw error;
        }
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
                // Verificar si el campo lista_publicaciones está presente en el documento
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

    let commentsList =  takePublicationCommentsList(publication_id);
    if (commentsList.length === 0) {
        commentsList = [id];
    }else {
        commentsList.push(id);
    }
    const newJson = {
        lista_comentarios: commentsList
    }
    modifyDoc("publicacion",publication_id,newJson);


inputElement.addEventListener('change', loaderImage);


});

