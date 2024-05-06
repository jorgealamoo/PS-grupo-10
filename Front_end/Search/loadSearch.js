

async function searchPublications(keyword) {
    try {
        const response = await fetch('http://localhost:3000/api/getDocument/listas/publicaciones');

        if (!response.ok) {
            throw new Error('No se pudo obtener la lista de publicaciones');
        }

        const publications = await response.json();

        // Filtrar las publicaciones que contienen el keyword en su título
        return Object.keys(publications).filter(publicationName => {
            return publicationName.toLowerCase().includes(keyword.toLowerCase());
        }).map(publicationName => ({
            title: publicationName,
            ids: publications[publicationName]
        }));
    } catch (error) {
        console.error('Error al buscar publicaciones:', error);
        return []; // Devolver un array vacío en caso de error
    }
}

function searchUsers(keyword) {
    // Aquí iría la lógica para buscar usuarios
    // Supongamos que obtienes un array de usuarios encontrados
    const users = [];
    return users;
}

async function fetchUser(userId) {
    const user = await fetch('http://localhost:3000/api/getDocument/usuario/' + userId)
        .then(async response => {
            if (!response.ok) {
                throw new Error("Fail to fetch document");
            }
            return await response.json()
        });
    return user.usuario;
}

async function displayResults(results, type) {
    const container = type === 'publications' ? document.getElementById('publications') : document.getElementById('users');

    if (results.length === 0) {
        container.innerHTML = '<p>No se encontraron resultados.</p>';
        return;
    }

    for (const result of results) {
        for (const publicationId of result.ids) {
            try {
                const response = await fetch('http://localhost:3000/api/getDocument/publicacion/' + publicationId);
                const publicationData = await response.json();
                const resultElement = document.createElement('div');
                resultElement.classList.add('publication');

                const firstImage = await fetchImage(publicationData['lista_imagenes'][0]);
                const username = await fetchUser(publicationData['user_id']);
                resultElement.innerHTML = `
                <div class="publication-content">
                    <img src="${firstImage}" alt="Imagen de la publicación">
                    <div class="publication-info">
                        <h2>${result.title}</h2>
                        <h3>${username}</h3>
                        <p>Rate: ${publicationData['valoracion']}</p>
                    </div>
                </div>
                `;

                resultElement.addEventListener('click', () => {
                    localStorage.setItem("currentPublication", publicationId);
                    window.location.href = '../Publication/publication.html';
                });

                container.appendChild(resultElement);

            } catch (error) {
                console.error('Error al encontrar publicacion:', error);
                break;
            }
        }
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

function performSearch(keyword, type) {
    if (type === 'publications') {
        searchPublications(keyword).then(results => {
            displayResults(results, 'publications');
        }).catch(error => {
            console.error('Error al buscar publicaciones:', error);
        });
    } else {
        const results = searchUsers(keyword);
        displayResults(results, 'users');
    }
}

function toggleSearch(){
    const toggleButton = document.getElementById("toggleSearch");
    if (toggleButton.src.endsWith('publication_seleccionada.png')) {
        toggleButton.src = '/Front_end/Images/user_seleccionado.png';
    } else {
        toggleButton.src = '/Front_end/Images/publication_seleccionada.png';
    }
}


document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            const pContainer = document.getElementById('publications');
            pContainer.innerHTML = '';
            const uContainer = document.getElementById('users');
            uContainer.innerHTML = '';

            const keyword = searchInput.value;
            const type = document.getElementById('toggleSearch').src.endsWith('publication_seleccionada.png') ? 'publications' : 'users';
            performSearch(keyword, type);
        }
    });

    document.querySelector('.search-icon').addEventListener('click', function() {
        const pContainer = document.getElementById('publications');
        pContainer.innerHTML = '';
        const uContainer = document.getElementById('users');
        uContainer.innerHTML = '';

        const keyword = document.getElementById('searchInput').value;
        const type = document.getElementById('toggleSearch').src.endsWith('publication_seleccionada.png') ? 'publications' : 'users';
        performSearch(keyword, type);
    });
});

