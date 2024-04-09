function mostrarOcultar() {
    var elemento = document.getElementById("elemento-oculto");
    if (elemento.style.display === "none") {
        elemento.style.display = "block"; // Muestra el elemento
    } else {
        elemento.style.display = "none"; // Oculta el elemento
    }
}
