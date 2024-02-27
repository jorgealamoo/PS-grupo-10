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
    function agregarImagen(contenedor, imagenPath, texto) {
        let nuevoElemento = document.createElement('div');
        nuevoElemento.className = 'imagewd';
        nuevoElemento.innerHTML = `<img src="${imagenPath}" alt=""> ${texto}`;
        contenedor.appendChild(nuevoElemento);
    }

    // Datos de imágenes y textos
    const imagenesYTextos = [
        { imagenPath: '/Images/aspa.png', texto: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed' },
        // Agrega más objetos según sea necesario
    ];

    // Agregar imágenes y textos al contenedor
    const contenedorImagenes = document.getElementById('imagenContainer');
    imagenesYTextos.forEach(item => {
        agregarImagen(contenedorImagenes, item.imagenPath, item.texto);
    });
}

