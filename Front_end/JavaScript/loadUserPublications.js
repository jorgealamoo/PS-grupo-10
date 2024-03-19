function loadUserData(fieldName) {
    const userID = localStorage.getItem("userId");
    return fetch('http://localhost:3000/api/getDocument/usuario/'+userID+'')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.hasOwnProperty(fieldName)) {
                return data[fieldName];
            } else {
                console.error('El campo lista_publicaciones no está presente en el documento');
                return null;
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            throw error;
        });
}

function loadPublicationData(fieldName, publicationID) {
    const userID = localStorage.getItem("userId");
    return fetch('http://localhost:3000/api/getDocument/publicacion/'+publicationID+'')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }).then(data => {
            return data[fieldName];
        });
}

function getImgURL(imgName) {
    return fetch("http://localhost:3000/api/getImage/" + imgName)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            return data.imageUrl;
        });
}

function addImage(contenedor, imagenPath, texto) {
    let nuevoElemento = document.createElement('div');
    nuevoElemento.className = 'imagewd';
    nuevoElemento.style.width = '450px';
    nuevoElemento.style.height = '450px';
    nuevoElemento.style.overflow = 'hidden';
    nuevoElemento.style.position = 'relative';
    nuevoElemento.style.backgroundImage = `url('${imagenPath}')`;
    nuevoElemento.style.backgroundSize = 'cover';
    nuevoElemento.style.backgroundPosition = 'center';
    nuevoElemento.style.cursor = 'pointer';

    nuevoElemento.addEventListener('click', function() {
        window.location.href = '../Publication/publication.html';
    });

    let textoElemento = document.createElement('div');
    textoElemento.innerHTML = texto;
    textoElemento.style.position = 'absolute';
    textoElemento.style.bottom = '10px';
    textoElemento.style.left = '10px';
    textoElemento.style.color = 'white';
    textoElemento.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    textoElemento.style.padding = '5px';
    textoElemento.style.display = 'none';

    nuevoElemento.addEventListener('mouseover', function() {
        textoElemento.style.display = 'block';
    });

    nuevoElemento.addEventListener('mouseout', function() {
        textoElemento.style.display = 'none';
    });

    nuevoElemento.appendChild(textoElemento);

    contenedor.appendChild(nuevoElemento);
}

async function loadProfilePhotoAndName() {
    const profilePhoto = await loadUserData("photoPerfil");
    const usuario = await loadUserData("usuario");
    const url = await getImgURL(profilePhoto);
    const user = document.getElementsByClassName("User")[0];
    let imagen = document.createElement('img');
    imagen.src = url;
    user.appendChild(imagen);
}

await loadProfilePhotoAndName();

const container = document.getElementById("imagenContainer");
const userPublications = await loadUserData("lista_publicaciones");

for (let i=0; i<userPublications.length; i++) {
    const publicationID = await loadPublicationData("lista_imagenes", userPublications[i]);
    const name = await loadPublicationData("nombre", userPublications[i]);
    const url = await getImgURL(publicationID[0]);
    addImage(container, url, name);
}

