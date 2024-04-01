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
    textoElemento.style.width = '97.5%'

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
async function getUserPublicationsIDs(url, fieldName) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const publicationList = data[fieldName];
            return publicationList.map(publication => publication.publication_id);
        });
}
async function loadUserName(url) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const userName = document.getElementById("userName");
            userName.textContent = data["user"];
        });
}
async function loadProfilePhoto(url, imageID) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const profile = document.getElementById(imageID);
            profile.src = data["user_image"];
            profile.style.borderRadius = "50%";
        });
}


async function getPublicationURL(id) {
    return fetch("/Front_end/Datos/publication.JSON")
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const publications = data["Publication"];
            if (id >= 1 && id <= publications.length) {
                const index = id - 1;
                return publications[index].url;
            } else {
                throw new Error('Publication ID out of range');
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            throw error;
        });
}
async function loadPublicationField(url, fieldName) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            return data[fieldName];
        })
        .then(data => {
            return (fieldName === "name") ? data : data[0];
        });
}

