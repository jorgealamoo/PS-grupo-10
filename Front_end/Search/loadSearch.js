function searchPublications(keyword) {
    // Aquí iría la lógica para buscar publicaciones
    // Supongamos que obtienes un array de publicaciones encontradas
    const publications = [];
    return publications;
}

function searchUsers(keyword) {
    // Aquí iría la lógica para buscar usuarios
    // Supongamos que obtienes un array de usuarios encontrados
    const users = [];
    return users;
}

function displayResults(results, type) {
    const container = type === 'publications' ? document.getElementById('publications') : document.getElementById('users');

    if (results.length === 0) {
        container.innerHTML = '<p>No se encontraron resultados.</p>';
        return;
    }

    results.forEach(result => {
        // Aquí podrías crear el HTML para mostrar cada resultado en el contenedor
        const resultElement = document.createElement('div');
        // Supongamos que cada resultado tiene una propiedad 'title'
        resultElement.textContent = result.title;
        container.appendChild(resultElement);
    });
}

function performSearch(keyword, type) {
    if (type === 'publications') {
        const results = searchPublications(keyword);
        displayResults(results, 'publications');
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


