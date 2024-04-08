var dataJSON = null
localStorage.setItem('userId','0zbkPGwrhlfAjIcQ3odeqSte5jD3');
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
        createComment(userName,photoUser,text);

    }
}
function createComment(userName, photoUser, text) {
    var comentariosDiv = document.getElementById('coments');
    var comentarioHTML = `
                <div class="comentario">
                    <div class="header-comment">
                        <img src="${photoUser}" class="imagen-comentario"> 
                        <h3 class="nombre">${userName}</h3>
                    </div>
                    <div class="mensaje">${text}</div>
                </div>
            `;
    comentariosDiv.innerHTML += comentarioHTML;
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
    if(user.lista_guardados.includes(localStorage.getItem('currentPublication'))){
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
        await isSave();
        await loadComment(documentData["lista_comentarios"]);
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
    if (button.src.endsWith('guardar-instagram.png')) {
        button.src = '/Front_end/Images/guardar-activate.png';
        await modifyDoc('usuario',user,{lista_guardados: user.lista_guardados.filter(item => item !== localStorage.getItem('currentPublication'))})

    } else {
        button.src = '/Front_end/Images/guardar-instagram.png';
        await modifyDoc('usuario',user,{lista_guardados: user.lista_guardados.push(localStorage.getItem('currentPublication'))})

    }
}
