function addImage(imagenPath, texto, publicationID) {
    let nuevoElemento = document.createElement('div');
    nuevoElemento.className = 'imagewd';
    nuevoElemento.style.width = '40vh';
    nuevoElemento.style.height = '40vh';
    nuevoElemento.style.position = 'relative';
    nuevoElemento.style.backgroundImage = `url('${imagenPath}')`;
    nuevoElemento.style.backgroundSize = 'cover';
    nuevoElemento.style.backgroundPosition = 'center';
    nuevoElemento.style.cursor = 'pointer';
    nuevoElemento.style.border = '2px solid black'

    let textoElemento = document.createElement('div');
    textoElemento.innerHTML = texto;
    textoElemento.style.position = 'absolute';
    textoElemento.style.bottom = '0';
    textoElemento.style.color = 'white';
    textoElemento.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    textoElemento.style.padding = '5px';
    textoElemento.style.display = 'none';
    textoElemento.style.width = '96.5%'

    nuevoElemento.addEventListener('mouseover', function() {
        textoElemento.style.display = 'block';
    });

    nuevoElemento.addEventListener('mouseout', function() {
        textoElemento.style.display = 'none';
    });

    nuevoElemento.addEventListener('click', function() {
        localStorage.setItem("currentPublication", publicationID);
        window.location.href = '../Publication/publication.html';
    });

    nuevoElemento.appendChild(textoElemento);
    let contenedor = document.getElementById("imagenContainer");
    contenedor.appendChild(nuevoElemento);
}
function loadUserData(fieldName, selfUser=true) {
    let userID = localStorage.getItem("userId");
    if (!selfUser) userID = localStorage.getItem("viewAccountId");
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
                console.error('El campo no está presente en el documento');
                return null;
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            throw error;
        });
}

function loadPublicationData(fieldName, publicationID) {
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

async function loadProfilePhoto(imagenContainer, selfUser=true) {
    const profilePhoto = await loadUserData("photoPerfil", selfUser);
    const url = await getImgURL(profilePhoto);
    const imagen = document.getElementById(imagenContainer);
    imagen.src = url;
}

async function loadUserName(container, selfUser=true) {
    const username = await loadUserData("usuario", selfUser);
    const texto = document.getElementById(container);
    texto.textContent = username;
}

async function loadFollowers(container, selfUser=true) {
    const followers = await loadUserData("lista_seguidores", selfUser);
    const texto = document.getElementById(container);
    texto.textContent = "Followers: " + followers.length;
}

async function loadFollowing(container, selfUser=true) {
    const following = await loadUserData("lista_siguiendo", selfUser);
    const texto = document.getElementById(container);
    texto.textContent = "Following: " + following.length;
}

async function checkIfFollowing() {
    const followButton = document.getElementById("FollowButton");
    const seguidores = document.getElementById("seguidores");
    const siguiendo = document.getElementById("siguiendo");
    const selfID = localStorage.getItem("userId");
    const lista_seguidores = await loadUserData("lista_seguidores", false);
    const lista_siguiendo = await loadUserData("lista_siguiendo", false);

    seguidores.textContent = lista_seguidores.length;
    siguiendo.textContent = lista_siguiendo.length;

    for (let i=0; i<lista_seguidores.length; i++) {
        if (selfID === lista_seguidores[i]) {
            followButton.textContent = "Following";
        }
    }
}
async function getTotalFollow(element, followers) {
    if (followers) {
        const list = await loadUserData("lista_seguidores");
    } else {
        const list = await loadUserData("lista_siguiendo");
    }
}