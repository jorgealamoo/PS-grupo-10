// Utilizamos fetch para obtener el contenido de "header.html"
fetch('../Reusables/Header/header.html')
    .then(response => response.text())
    .then(data => {
        // Insertamos el contenido en el contenedor con id "headerContainer"
        document.getElementById('headerContainer').innerHTML = data;
    })
    .catch(error => console.error('Error al cargar el archivo header.html:', error));

fetch('../Reusables/Footer/footer.html')
    .then(response => response.text())
    .then(data => {
        // Insertamos el contenido en el contenedor con id "headerContainer"
        document.getElementById('footerContainer').innerHTML = data;
    })
    .catch(error => console.error('Error al cargar el archivo footer.html:', error));