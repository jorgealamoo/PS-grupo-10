function agregarImagen(contenedor, imagenPath, texto) {
    let nuevoElemento = document.createElement('div');
    nuevoElemento.className = 'imagewd';

    let imagen = document.createElement('img');
    imagen.src = imagenPath;
    imagen.style.width = '450px';
    imagen.style.height = '450px';
    imagen.style.cursor = 'pointer';

    imagen.addEventListener('click', function() {
        window.location.href = '../Publication/publication.html';
    });

    nuevoElemento.appendChild(imagen);

    let textoElemento = document.createElement('div');
    textoElemento.innerHTML = texto;
    nuevoElemento.appendChild(textoElemento);

    contenedor.appendChild(nuevoElemento);
}

function cargarImagenes() {
    const contenedorImagenes = document.getElementById('imagenContainer');
    const imagenesYTextos = [
        { imagenPath: '/Images/aspa.png', texto: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed'},
        { imagenPath: '/Images/aspa2.png', texto: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed' },
        { imagenPath: '/Images/aspa3.png', texto: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed' },
    ];

    imagenesYTextos.forEach(item => {
        agregarImagen(contenedorImagenes, item.imagenPath, item.texto);
    });
}

// Llama a la función cargarImagenes al cargar la página
document.addEventListener('DOMContentLoaded', cargarImagenes);
