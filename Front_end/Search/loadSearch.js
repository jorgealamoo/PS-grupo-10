import {fetchImage} from '../JavaScript/loadPublication.js'

async function searchPublications(keyword) {
    try {
        const response = await fetch('http://localhost:3000/api/getDocument/listas/publicaciones');

        if (!response.ok) {
            throw new Error('No se pudo obtener la lista de publicaciones');
        }

        const publications = await response.json();

        // Filtrar las publicaciones que contienen el keyword en su título
        const filteredPublications = Object.keys(publications).filter(publicationName => {
            return publicationName.toLowerCase().includes(keyword.toLowerCase());
        }).map(publicationName => ({
            title: publicationName,
            ids: publications[publicationName]
        }));

        return filteredPublications;
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

async function displayResults(results, type) {
    const container = type === 'publications' ? document.getElementById('publications') : document.getElementById('users');

    if (results.length === 0) {
        container.innerHTML = '<p>No se encontraron resultados.</p>';
        return;
    }

    console.log(results);
    for (const result of results) {
        for (const publicationId of result.ids) {
            try {
                const response = await fetch('http://localhost:3000/api/getDocument/publicacion/' + publicationId);
                const publicationData = await response.json();
                const resultElement = document.createElement('div');

                const firstImage = await fetchImage(publicationData['lista_imagenes'][0]);
                resultElement.innerHTML = `
                <img src="${firstImage}" alt="Imagen de la publicación">
                <h2>${result.title}</h2>
                <p>Rate: ${publicationData['valoracion']}</p>
                `;

                container.appendChild(resultElement);

            } catch (error) {
                console.error('Error al encontrar publicacion:', error);
                break;
            }
        }
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


