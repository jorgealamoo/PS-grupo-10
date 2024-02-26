function cargarTemplate(url, selector) {
    fetch(url)
        .then(response => {
            return response.text();
        })
        .then(data => {
            let container = document.querySelector(selector);
            container.innerHTML = data;
        })
        .catch(error => {
            console.error('Error al cargar el template:', error);
        });
}

