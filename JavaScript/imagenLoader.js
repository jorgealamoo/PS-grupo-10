function agregarImagen(contenedor, imagenPath, texto) {
    let nuevoElemento = document.createElement('div');
    nuevoElemento.className = 'imagewd';

    let imagen = document.createElement('img');
    imagen.src = imagenPath;

    imagen.style.width = '450px';
    imagen.style.height = '450px';  // Ajusta la altura de forma proporcional

    nuevoElemento.appendChild(imagen);
    nuevoElemento.innerHTML += texto;

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
