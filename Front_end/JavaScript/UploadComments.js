function load(elementId) {
    fetch('/Prueba_carga_dinamica/comentarios.txt')
        .then(response => response.text())
        .then(data => {
            var comentariosDiv = document.getElementById(elementId);
            var lineas = data.split('\n');
            lineas.forEach(linea => {
                var comentarioInfo = linea.split('{');
                var nombreUsuario = comentarioInfo[0];
                var valoracion = comentarioInfo[1];
                var mensaje = comentarioInfo[2];
                var comentarioHTML = `
                <div class="comentario">
                    <div class="header-comment">
                        <img src="/Images/aspa.png" alt="photo ${nombreUsuario}" class="imagen-comentario"> 
                        <h3 class="nombre">${nombreUsuario}</h3>
                        <h3 class="valoracion">${valoracion}★</h3>
                    </div>
                    <div class="mensaje">${mensaje}</div>
                    <div class="reporte">
                        <button>Reportar</button>
                    </div>
                </div>
            `;
                comentariosDiv.innerHTML += comentarioHTML;
            });
        });
}