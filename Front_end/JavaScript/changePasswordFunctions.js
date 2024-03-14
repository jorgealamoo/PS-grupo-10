// Función para mostrar/ocultar el contenedor de cambio de contraseña
function toggleChangePassword() {
    var container = document.getElementById('changePasswordContainer');
    container.classList.toggle('active');
}

function validateOfChangePassword() {
    pass1 = document.getElementById("newPassword");
    pass2 = document.getElementById("repeatPassword");
    var errorDiv = document.getElementById("passwordError");

    if (pass1.value !== pass2.value) {
        errorDiv.innerText = "Passwords do not match";
    }
    else {
        errorDiv.innerText = "";
        toggleChangePassword();
    }
}