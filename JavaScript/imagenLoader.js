// imagenLoader.js
function agregarImagen(contenedor, imagenPath, texto) {
    let nuevoElemento = document.createElement('div');
    nuevoElemento.className = 'imagewd';
    nuevoElemento.innerHTML = `<img src="${imagenPath}" alt=""> ${texto}`;
    contenedor.appendChild(nuevoElemento);
}

function cargarImagenes() {
    const contenedorImagenes = document.getElementById('imagenContainer');
    const imagenesYTextos = [
        { imagenPath: '/Images/aspa.png', texto: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed'},
        { imagenPath: '/Images/aspa2.png', texto: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed' },
    ];

    imagenesYTextos.forEach(item => {
        agregarImagen(contenedorImagenes, item.imagenPath, item.texto);
    });
}
