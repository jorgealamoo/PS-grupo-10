// Función para agregar una imagen con texto a un contenedor
function addImage(imagePath, text, publicationID) {
    const nuevoElemento = document.createElement('div');
    nuevoElemento.className = 'imagewd';
    nuevoElemento.style.cssText = `
        width: 40vh;
        height: 40vh;
        position: relative;
        background-image: url('${imagePath}');
        background-size: cover;
        background-position: center;
        cursor: pointer;
        border: 2px solid black;
    `;

    const textoElemento = document.createElement('div');
    textoElemento.innerHTML = text;
    textoElemento.style.cssText = `
        position: absolute;
        bottom: 0;
        color: white;
        background-color: rgba(0, 0, 0, 0.5);
        padding: 5px;
        display: none;
        width: 96.5%;
    `;

    nuevoElemento.addEventListener('mouseover', () => {
        textoElemento.style.display = 'block';
    });

    nuevoElemento.addEventListener('mouseout', () => {
        textoElemento.style.display = 'none';
    });

    nuevoElemento.addEventListener('click', () => {
        localStorage.setItem("currentPublication", publicationID);
        window.location.href = '../Publication/publication.html';
    });

    nuevoElemento.appendChild(textoElemento);
    document.getElementById("imagenContainer").appendChild(nuevoElemento);
}

// Función para cargar datos del usuario
 async function loadUserData(fieldName, selfUser = true) {
    try {
        let userID = localStorage.getItem(selfUser ? "userId" : "viewAccountId");
        const response = await fetch(`http://localhost:3000/api/getDocument/usuario/${userID}`);
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        if (data.hasOwnProperty(fieldName)) {
            return data[fieldName];
        } else {
            console.error('The field is not present in the document');
            return null;
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
}

async function loadAnotherUserData(fieldName, userID) {
    try {
        const response = await fetch(`http://localhost:3000/api/getDocument/usuario/${userID}`);
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        if (data.hasOwnProperty(fieldName)) {
            return data[fieldName];
        } else {
            console.error('The field is not present in the document');
            return null;
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
}

// Función para cargar datos de una publicación
async function loadPublicationData(fieldName, publicationID) {
    try {
        const response = await fetch(`http://localhost:3000/api/getDocument/publicacion/${publicationID}`);
        if (!response.ok) {
            throw new Error('Failed to fetch publication data');
        }
        const data = await response.json();
        return data[fieldName];
    } catch (error) {
        console.error('Error fetching publication data:', error);
        throw error;
    }
}

// Función para obtener la URL de una imagen
async function getImgURL(imgName) {
    try {
        const response = await fetch(`http://localhost:3000/api/getImage/${imgName}`);
        if (!response.ok) {
            throw new Error('Failed to fetch image URL');
        }
        const data = await response.json();
        return data.imageUrl;
    } catch (error) {
        console.error('Error fetching image URL:', error);
        throw error;
    }
}

// Función para alternar el botón de logout
function toggleLogOut() {
    var logOutButton = document.getElementById("LogOut");
    if (logOutButton.style.opacity === "1") {
        logOutButton.style.opacity = "0";
    } else {
        logOutButton.style.opacity = "1";
    }
}

// Función para cargar la foto de perfil
async function loadProfilePhoto(imageContainer, selfUser = true) {
    try {
        const profilePhoto = await loadUserData("photoPerfil", selfUser);
        document.getElementById(imageContainer).src = await getImgURL(profilePhoto);
    } catch (error) {
        console.error('Error loading profile photo:', error);
    }
}

// Función para cargar el nombre de usuario
async function loadUserName(container, selfUser = true) {
    try {
        document.getElementById(container).textContent = await loadUserData("usuario", selfUser);
    } catch (error) {
        console.error('Error loading username:', error);
    }
}

// Función para cargar el número de seguidores
async function loadFollowers(container, selfUser = true) {
    try {
        const followers = await loadUserData("lista_seguidores", selfUser);
        document.getElementById(container).textContent = followers.length;
    } catch (error) {
        console.error('Error loading followers:', error);
    }
}

// Función para cargar el número de personas a las que sigue el usuario
async function loadFollowing(container, selfUser = true) {
    try {
        const following = await loadUserData("lista_siguiendo", selfUser);
        document.getElementById(container).textContent = following.length;
    } catch (error) {
        console.error('Error loading following:', error);
    }
}

// Función para comprobar si el usuario sigue a la cuenta actual
async function checkIfFollowing() {
    try {
        const followButton = document.getElementById("FollowButton");
        const viewId = localStorage.getItem("userId");
        const lista_seguidores = await loadUserData("lista_seguidores", false);
        const lista_siguiendo = await loadUserData("lista_siguiendo", false);

        document.getElementById("seguidores").textContent = lista_seguidores.length;
        document.getElementById("siguiendo").textContent = lista_siguiendo.length;

        if (lista_seguidores.includes(viewId)) {
            followButton.textContent = "Following";
        }
    } catch (error) {
        console.error('Error checking if following:', error);
    }
}

// Función para actualizar la lista de seguidores
async function updateFollowers(lista_seguidores) {
    try {
        const userId = localStorage.getItem('viewAccountId');
        const response = await fetch(`http://localhost:3000/api/getDocument/usuario/${userId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch document');
        }
        const dataJSON = await response.json();
        dataJSON["lista_seguidores"] = lista_seguidores;

        updateNumber(dataJSON["lista_seguidores"].length);

        const apiUrl = `http://localhost:3000/api/changeDoc/usuario/${dataJSON['id']}`;
        const response2 = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataJSON)
        });
    } catch (error) {
        console.error('Error updating followers:', error);
    }
}

// Función para actualizar el número de seguidores mostrado en la interfaz
function updateNumber(number) {
    document.getElementById("seguidores").textContent = number;
}

// Función para seguir o dejar de seguir a un usuario
async function toggleFollow() {
    try {
        const button = document.getElementById("FollowButton");
        const userId = localStorage.getItem("userId");
        const viewId = localStorage.getItem("viewAccountId");
        let lista_seguidores = await loadUserData("lista_seguidores", false);
        let lista_siguiendo = await loadUserData("lista_siguiendo");

        if (Object.keys(lista_seguidores).length === 0) lista_seguidores = [];
        if (Object.keys(lista_siguiendo).length === 0) lista_siguiendo = [];

        if (button.textContent === "Following") {
            const index = lista_seguidores.indexOf(userId);
            const index2 = lista_siguiendo.indexOf(viewId);
            lista_seguidores.splice(index, 1);
            lista_siguiendo.splice(index2, 1);
            button.textContent = "Follow";
        } else if (button.textContent === "Follow") {
            lista_seguidores = lista_seguidores.concat(userId);
            lista_siguiendo = lista_siguiendo.concat(viewId);
            button.textContent = "Following";
        }

        await Promise.all([
            updateFollowers(lista_seguidores),
            updateListaSeguidos(lista_siguiendo)
        ]);
    } catch (error) {
        console.error('Error toggling follow:', error);
    }
}

// Función para actualizar la lista de usuarios seguidos por el usuario actual
async function updateListaSeguidos(lista_siguiendo) {
    try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(`http://localhost:3000/api/getDocument/usuario/${userId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch document');
        }
        const dataJSON = await response.json();
        dataJSON["lista_siguiendo"] = lista_siguiendo;

        const apiUrl = `http://localhost:3000/api/changeDoc/usuario/${dataJSON['id']}`;
        const response2 = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataJSON)
        });
    } catch (error) {
        console.error('Error updating followed users:', error);
    }
}

function addToList(username, imageURL) {

    const followerDiv = document.createElement('div');
    followerDiv.classList.add('follower');

    const img = document.createElement('img');
    img.src = imageURL;
    img.alt = 'Profile Picture';


    const usernamePara = document.createElement('p');
    usernamePara.textContent = username;

    followerDiv.appendChild(img);
    followerDiv.appendChild(usernamePara);

    const followersDisplay = document.getElementById('followersDisplay');

    followersDisplay.appendChild(followerDiv);
}


async function toggleDisplay(text, selfUser= true) {
    let elemento;
    let follow = [];
    if (text === "followers") {
        follow = await loadUserData("lista_seguidores", selfUser);
        elemento = document.getElementById("followersDisplay");
    } else {
        follow = await loadUserData("lista_siguiendo", selfUser);
        elemento = document.getElementById("followingDisplay");
    }

    // Vaciar el contenido del elemento
    elemento.innerHTML = '';

    // Verificar si tiene la clase "active"
    if (elemento.classList.contains("active")) {
        elemento.classList.remove("active");
        elemento.classList.add("inactive");
    } else {
        // Si no tiene la clase "active", entonces asumimos que tiene "inactive"
        elemento.classList.remove("inactive");
        elemento.classList.add("active");

        for (let i = 0; i < follow.length; i++) {
            const fotoName = await loadAnotherUserData("photoPerfil", follow[i]);
            const foto = await getImgURL(fotoName);
            const name = await loadAnotherUserData("usuario", follow[i]);

            const followerDiv = document.createElement("div");
            followerDiv.style.cursor = 'pointer';
            followerDiv.classList.add("follower");

            followerDiv.addEventListener('click', () => {
                localStorage.setItem("viewAccountId", follow[i]);
                window.location.href = '../ViewAccount/viewAccount.html';
            });

            const fotoImg = document.createElement("img");
            fotoImg.src = foto;
            fotoImg.alt = "Foto de perfil de " + name;

            const namePara = document.createElement("p");
            namePara.textContent = name;

            followerDiv.appendChild(fotoImg);
            followerDiv.appendChild(namePara);

            elemento.appendChild(followerDiv);
        }
    }
}

